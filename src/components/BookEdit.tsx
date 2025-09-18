import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router";
import useNotifications from "../hooks/useNotifications/useNotifications";
import {
	getOne as getBook,
	updateOne as updateBook,
	type ApiBook,
} from "../data/book";
import BookForm, { type BookFormData } from "./BookForm";
import PageContainer from "./PageContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Internal component that renders BookForm prefilled with initial values
 * and handles success/error feedback and navigation.
 */
function BookEditForm({
	initialValues,
	onSubmit,
}: {
	initialValues: BookFormData;
	onSubmit: (formValues: BookFormData) => Promise<void>;
}) {
	const navigate = useNavigate();

	const notifications = useNotifications();

	// Wrap the parent's submit to show notifications and navigate back
	const handleFormSubmit = React.useCallback(
		async (data: BookFormData) => {
			try {
				await onSubmit(data);
				notifications.show("Book edited successfully.", {
					severity: "success",
					autoHideDuration: 3000,
				});

				navigate("/dashboard");
			} catch (editError) {
				notifications.show(
					`Failed to edit book. Reason: ${(editError as Error).message}`,
					{
						severity: "error",
						autoHideDuration: 3000,
					}
				);
				throw editError;
			}
		},
		[navigate, notifications, onSubmit]
	);

	return (
		<BookForm
			defaultValues={initialValues}
			onSubmit={handleFormSubmit}
			submitButtonLabel="Save"
			backButtonPath={`/dashboard`}
		/>
	);
}

/**
 * BookEdit
 * Page to edit an existing book:
 * - Loads the book by id
 * - Prefills BookForm
 * - Updates the book and invalidates relevant caches on submit
 */
export default function BookEdit() {
	const { bookId } = useParams();
	const queryClient = useQueryClient();
	// Fetch the book to edit
	const {
		data: book,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["book", bookId],
		queryFn: () => getBook(String(bookId)),
	});

	// Submit handler: update server and invalidate both list and item queries
	const handleSubmit = React.useCallback(
		async (formValues: BookFormData) => {
			await updateBook(
				String(bookId),
				formValues as Partial<Omit<ApiBook, "id">>
			);
			queryClient.invalidateQueries({ queryKey: ["books"] });
			queryClient.invalidateQueries({ queryKey: ["book", bookId] });
		},
		[bookId, queryClient]
	);

	// Memoize loaded/empty/error views for simpler render logic
	const renderEdit = React.useMemo(() => {
		if (isLoading) {
			return (
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						m: 1,
					}}
				>
					<CircularProgress />
				</Box>
			);
		}
		if (error) {
			return (
				<Box sx={{ flexGrow: 1 }}>
					<Alert severity="error">{error.message}</Alert>
				</Box>
			);
		}

		return book ? (
			<BookEditForm
				initialValues={{
					title: book.title,
					author: book.author,
					genre: book.genre,
					publishedYear: book.publishedYear,
					status: book.status,
				}}
				onSubmit={handleSubmit}
			/>
		) : null;
	}, [isLoading, error, book, handleSubmit]);

	return (
		<PageContainer title={`Edit Book ${bookId}`}>
			<Box sx={{ display: "flex", flex: 1 }}>{renderEdit}</Box>
		</PageContainer>
	);
}
