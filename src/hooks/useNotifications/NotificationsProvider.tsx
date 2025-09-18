import {
	Fragment,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import type { CloseReason } from "@mui/material/SpeedDial";
import CloseIcon from "@mui/icons-material/Close";
import useSlotProps from "@mui/utils/useSlotProps";
import NotificationsContext from "./NotificationsContext";
import type {
	CloseNotification,
	ShowNotification,
	ShowNotificationOptions,
} from "./useNotifications";

const RootPropsContext = createContext<NotificationsProviderProps | null>(null);

interface NotificationProps {
	notificationKey: string;
	badge: string | null;
	open: boolean;
	message: ReactNode;
	options: ShowNotificationOptions;
}

function Notification({
	notificationKey,
	open,
	message,
	options,
	badge,
}: NotificationProps) {
	const notificationsContext = useContext(NotificationsContext);
	if (!notificationsContext) {
		throw new Error("Notifications context was used without a provider.");
	}
	const { close } = notificationsContext;

	const {
		severity = "success",
		actionText,
		onAction,
		autoHideDuration,
	} = options;
	const alertColor = severity as "success" | "error" | "warning" | "info";

	const handleClose = useCallback(
		(_event: unknown, reason?: CloseReason | SnackbarCloseReason) => {
			if (reason === "clickaway") {
				return;
			}
			close(notificationKey);
		},
		[notificationKey, close]
	);

	const action = (
		<Fragment>
			{/* Optional action button; caller decides label & handler */}
			{onAction ? (
				<Button color="inherit" size="small" onClick={onAction}>
					{actionText ?? "Action"}
				</Button>
			) : null}
			{/* Close button */}
			<IconButton
				size="small"
				aria-label="Close"
				title="Close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	);

	const props = useContext(RootPropsContext);
	const snackbarSlotProps = useSlotProps({
		elementType: Snackbar,
		ownerState: props,
		externalSlotProps: {},
		additionalProps: {
			open,
			autoHideDuration,
			onClose: handleClose,
			action,
			anchorOrigin: { vertical: "top", horizontal: "right" } as const,
		},
	});

	return (
		<Snackbar key={notificationKey} {...snackbarSlotProps}>
			<Badge badgeContent={badge} color="primary" sx={{ width: "100%" }}>
				<Alert
					severity={severity}
					variant="standard"
					sx={(theme) => ({
						width: "100%",
						bgcolor: (theme.vars ?? theme).palette.background.paper,
						color: "inherit",
						"& .MuiAlert-message": { color: "inherit" },
						"& .MuiAlert-action": { color: "inherit" },
						"& .MuiAlert-icon": { color: theme.palette[alertColor].main },
						border: "1.5px solid",
						borderColor: (theme.vars ?? theme).palette.common.black,
					})}
					action={action}
				>
					{message}
				</Alert>
			</Badge>
		</Snackbar>
	);
}

interface NotificationQueueEntry {
	notificationKey: string;
	options: ShowNotificationOptions;
	open: boolean;
	message: React.ReactNode;
}

interface NotificationsState {
	queue: NotificationQueueEntry[];
}

interface NotificationsProps {
	state: NotificationsState;
}

function Notifications({ state }: NotificationsProps) {
	const currentNotification = state.queue[0] ?? null;

	return currentNotification ? (
		<Notification
			{...currentNotification}
			badge={state.queue.length > 1 ? String(state.queue.length) : null}
		/>
	) : null;
}

export interface NotificationsProviderProps {
	children?: ReactNode;
}

let nextId = 0;
const generateId = () => {
	const id = nextId;
	nextId += 1;
	return id;
};

/**
 * Provider for Notifications. The subtree of this component can use the `useNotifications` hook to
 * access the notifications API. The notifications are shown in the same order they are requested.
 */
export default function NotificationsProvider(
	props: NotificationsProviderProps
) {
	const { children } = props;
	const [state, setState] = useState<NotificationsState>({ queue: [] });

	// Enqueue a notification; dedupe by key if provided
	const show = useCallback<ShowNotification>((message, options = {}) => {
		const notificationKey =
			options.key ?? `::toolpad-internal::notification::${generateId()}`;
		setState((prev) => {
			if (prev.queue.some((n) => n.notificationKey === notificationKey)) {
				// deduplicate by key
				return prev;
			}
			return {
				...prev,
				queue: [
					...prev.queue,
					{ message, options, notificationKey, open: true },
				],
			};
		});
		return notificationKey;
	}, []);

	// Remove a notification from the queue
	const close = useCallback<CloseNotification>((key) => {
		setState((prev) => ({
			...prev,
			queue: prev.queue.filter((n) => n.notificationKey !== key),
		}));
	}, []);

	const contextValue = useMemo(() => ({ show, close }), [show, close]);

	return (
		<RootPropsContext.Provider value={props}>
			<NotificationsContext.Provider value={contextValue}>
				{children}
				{/* Only the head of the queue is shown; badge indicates count */}
				<Notifications state={state} />
			</NotificationsContext.Provider>
		</RootPropsContext.Provider>
	);
}
