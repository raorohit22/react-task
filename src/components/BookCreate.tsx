import { useCallback } from "react";
import { useNavigate } from "react-router";
import useNotifications from "../hooks/useNotifications/useNotifications";
import { createOne as createBook, type ApiBook } from "../data/book";
import BookForm, { type BookFormData } from "./BookForm";
import PageContainer from "./PageContainer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * BookCreate
 * Page that composes BookForm to create a new book.
 * Uses React Query mutation with cache invalidation and toast notifications.
 */
export default function BookCreate() {
	const navigate = useNavigate();

	const notifications = useNotifications();
	const queryClient = useQueryClient();
	// Create mutation; invalidates the list on success to refetch
	const { mutateAsync } = useMutation({
		mutationKey: ["create-book"],
		mutationFn: (payload: Omit<ApiBook, "id">) => createBook(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["books"] });
		},
	});

	// Submit handler passed to BookForm
	const handleFormSubmit = useCallback(
		async (data: BookFormData) => {
			try {
				await mutateAsync(data as Omit<ApiBook, "id">);
				notifications.show("Book created successfully.", {
					severity: "success",
					autoHideDuration: 3000,
				});

				navigate("/dashboard");
			} catch (createError) {
				notifications.show(
					`Failed to create book. Reason: ${(createError as Error).message}`,
					{
						severity: "error",
						autoHideDuration: 3000,
					}
				);
				throw createError;
			}
		},
		[mutateAsync, navigate, notifications]
	);

	return (
		<PageContainer title="New Book">
			{/* Reuse the form; simple create flow */}
			<BookForm onSubmit={handleFormSubmit} submitButtonLabel="Create" />
		</PageContainer>
	);
}
