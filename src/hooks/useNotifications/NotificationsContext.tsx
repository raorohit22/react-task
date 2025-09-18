import { createContext } from "react";
import type { ShowNotification, CloseNotification } from "./useNotifications";

/**
 * NotificationsContext
 * Provides `show` and `close` functions for queued snackbars.
 * Use with `NotificationsProvider` and `useNotifications()`.
 */
const NotificationsContext = createContext<{
	show: ShowNotification;
	close: CloseNotification;
} | null>(null);

export default NotificationsContext;
