import * as React from "react";
import type { OpenDialog, CloseDialog } from "./useDialogs";

/**
 * DialogsContext
 * Provides `open` and `close` functions for stackable dialogs.
 * Use with `DialogsProvider` and `useDialogs()`.
 */
const DialogsContext = React.createContext<{
	open: OpenDialog;
	close: CloseDialog;
} | null>(null);

export default DialogsContext;
