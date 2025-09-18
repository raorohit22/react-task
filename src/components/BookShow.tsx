import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router";
import { useDialogs } from "../hooks/useDialogs/useDialogs";
import useNotifications from "../hooks/useNotifications/useNotifications";
import { deleteOne as deleteBook, getOne as getBook } from "../data/book";
import PageContainer from "./PageContainer";
import { useQuery } from "@tanstack/react-query";

/**
 * BookShow
 * Details page for a single book with edit/delete actions.
 * Fetches the book by id, shows loading/error states,
 * and renders a responsive two-column layout of fields.
 */
export default function BookShow() {
	const { bookId } = useParams();
	const navigate = useNavigate();

	const dialogs = useDialogs();
	const notifications = useNotifications();

	const {
		data: book,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["book", bookId],
		queryFn: () => getBook(String(bookId)),
	});

	// Navigate to edit page
	const handleBookEdit = React.useCallback(() => {
		navigate(`/books/${bookId}/edit`);
	}, [navigate, bookId]);

	// Confirm and delete this book, then navigate back to the list
	const handleBookDelete = React.useCallback(async () => {
		if (!book) {
			return;
		}

		const confirmed = await dialogs.confirm(
			`Do you wish to delete ${book.title}?`,
			{
				title: `Delete book?`,
				severity: "error",
				okText: "Delete",
				cancelText: "Cancel",
			}
		);

		if (confirmed) {
			try {
				await deleteBook(String(bookId));

				navigate("/dashboard");

				notifications.show("Book deleted successfully.", {
					severity: "success",
					autoHideDuration: 3000,
				});
			} catch (deleteError) {
				notifications.show(
					`Failed to delete book. Reason:' ${(deleteError as Error).message}`,
					{
						severity: "error",
						autoHideDuration: 3000,
					}
				);
			}
		}
	}, [book, dialogs, bookId, navigate, notifications]);

	// Back to dashboard (or adjust to previous list if desired)
	const handleBack = React.useCallback(() => {
		navigate("/dashboard");
	}, [navigate]);

	// Memoized UI for loading/error/data
	const renderShow = React.useMemo(() => {
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
					<Alert severity="error">{(error as Error).message}</Alert>
				</Box>
			);
		}

		return book ? (
			<Box sx={{ flexGrow: 1, width: "100%" }}>
				{/* Field grid */}
				<Grid container spacing={2} sx={{ width: "100%" }}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Title</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{book.title}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Author</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{book.author}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Published</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{book.publishedYear}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Genre</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{book.genre}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Status</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{book.status}
							</Typography>
						</Paper>
					</Grid>
				</Grid>
				{/* Page actions */}
				<Divider sx={{ my: 3 }} />
				<Stack direction="row" spacing={2} justifyContent="space-between">
					<Button
						variant="contained"
						startIcon={<ArrowBackIcon />}
						onClick={handleBack}
					>
						Back
					</Button>
					<Stack direction="row" spacing={2}>
						<Button
							variant="contained"
							startIcon={<EditIcon />}
							onClick={handleBookEdit}
						>
							Edit
						</Button>
						<Button
							variant="contained"
							color="error"
							startIcon={<DeleteIcon />}
							onClick={handleBookDelete}
						>
							Delete
						</Button>
					</Stack>
				</Stack>
			</Box>
		) : null;
	}, [isLoading, error, book, handleBack, handleBookEdit, handleBookDelete]);

	const pageTitle = `Book ${bookId}`;

	return (
		<PageContainer title={pageTitle}>
			<Box sx={{ display: "flex", flex: 1, width: "100%" }}>{renderShow}</Box>
		</PageContainer>
	);
}
