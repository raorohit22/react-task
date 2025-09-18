import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  createOne as createBook,
  type ApiBook,
} from '../data/book';
import BookForm, { type BookFormData } from './BookForm';
import PageContainer from './PageContainer';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function BookCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ['create-book'],
    mutationFn: (payload: Omit<ApiBook, 'id'>) => createBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const handleFormSubmit = React.useCallback(async (data: BookFormData) => {
    try {
      await mutateAsync(data as Omit<ApiBook, 'id'>);
      notifications.show('Book created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/dashboard');
    } catch (createError) {
      notifications.show(
        `Failed to create book. Reason: ${(createError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [mutateAsync, navigate, notifications]);

  return (
    <PageContainer
      title="New Book"
    >
      <BookForm
        onSubmit={handleFormSubmit}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
