import type { OpenDialog, CloseDialog } from "./useDialogs";
import { createContext } from "react";

/**
 * DialogsContext
 * Provides `open` and `close` functions for stackable dialogs.
 * Use with `DialogsProvider` and `useDialogs()`.
 */
const DialogsContext = createContext<{
	open: OpenDialog;
	close: CloseDialog;
} | null>(null);

export default DialogsContext;
