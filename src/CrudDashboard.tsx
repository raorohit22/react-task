import CssBaseline from '@mui/material/CssBaseline';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './components/DashboardLayout';
import BooksList from './components/BookList';
import BooksShow from './components/BookShow';
import BooksCreate from './components/BookCreate';
import BooksEdit from './components/BookEdit';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from './theme/shared-theme/AppTheme';
import {
  dataGridCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';

const router = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: BooksList,
      },
      {
        path: '/dashboard',
        Component: BooksList,
      },
      {
        path: '/books/:bookId',
        Component: BooksShow,
      },
      {
        path: '/books/new',
        Component: BooksCreate,
      },
      {
        path: '/books/:bookId/edit',
        Component: BooksEdit,
      },
      {
        path: '*',
        Component: BooksList,
      },
    ],
  },
]);

const themeComponents = {
  ...dataGridCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props: { disableCustomTheme?: boolean }) {
  const queryClient = new QueryClient();
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <DialogsProvider>
            <RouterProvider router={router} />
          </DialogsProvider>
        </NotificationsProvider>
      </QueryClientProvider>
    </AppTheme>
  );
}
