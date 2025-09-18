import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { matchPath, useLocation } from "react-router";
import DashboardSidebarContext from "../context/DashboardSidebarContext";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "../constants";
import DashboardSidebarPageItem from "./DashboardSidebarPageItem";
import { Dashboard } from "@mui/icons-material";
import {
	getDrawerSxTransitionMixin,
	getDrawerWidthTransitionMixin,
} from "../mixins";

export interface DashboardSidebarProps {
	/** Whether the sidebar is expanded (full width) or in mini/hidden mode. */
	expanded?: boolean;
	/** Setter to control expansion state from parent layout (responsive-aware). */
	setExpanded: (expanded: boolean) => void;
	/** If true, disables collapsible behavior (keeps full width on small viewports). */
	disableCollapsibleSidebar?: boolean;
	/** Optional container element for the Drawer (useful with portals). */
	container?: Element;
}

/**
 * DashboardSidebar
 * Left navigation for the dashboard with responsive behavior:
 * - `temporary` Drawer on phones (xs): overlays content
 * - `permanent` mini/full Drawer on tablets (sm) when collapsible is allowed
 * - `permanent` Drawer on desktop (md+)
 *
 * It exposes a context so nested items can react to mini vs expanded mode
 * and whether width transitions have completed (for smooth UI).
 */
export default function DashboardSidebar({
	expanded = true,
	setExpanded,
	disableCollapsibleSidebar = false,
	container,
}: DashboardSidebarProps) {
	const theme = useTheme();

	const { pathname } = useLocation();

	const [expandedItemIds, setExpandedItemIds] = React.useState<string[]>([]);

	const isOverSmViewport = useMediaQuery(theme.breakpoints.up("sm"));
	const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

	// Track whether the drawer width transition has finished expanding/collapsing
	const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
	const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

	// After expand, mark fully-expanded once the width transition duration elapses
	React.useEffect(() => {
		if (expanded) {
			const drawerWidthTransitionTimeout = setTimeout(() => {
				setIsFullyExpanded(true);
			}, theme.transitions.duration.enteringScreen);

			return () => clearTimeout(drawerWidthTransitionTimeout);
		}

		setIsFullyExpanded(false);

		return () => {};
	}, [expanded, theme.transitions.duration.enteringScreen]);

	// After collapse, mark fully-collapsed once the width transition duration elapses
	React.useEffect(() => {
		if (!expanded) {
			const drawerWidthTransitionTimeout = setTimeout(() => {
				setIsFullyCollapsed(true);
			}, theme.transitions.duration.leavingScreen);

			return () => clearTimeout(drawerWidthTransitionTimeout);
		}

		setIsFullyCollapsed(false);

		return () => {};
	}, [expanded, theme.transitions.duration.leavingScreen]);

	// Mini mode = compact navigation (icons only) when collapsible is allowed and not expanded
	const mini = !disableCollapsibleSidebar && !expanded;

	// Helpers to open/close the drawer for the current viewport
	const handleSetSidebarExpanded = React.useCallback(
		(newExpanded: boolean) => () => {
			setExpanded(newExpanded);
		},
		[setExpanded]
	);

	// Clicking items with children toggles them; on phones, clicking a leaf closes the drawer
	const handlePageItemClick = React.useCallback(
		(itemId: string, hasNestedNavigation: boolean) => {
			if (hasNestedNavigation && !mini) {
				setExpandedItemIds((previousValue) =>
					previousValue.includes(itemId)
						? previousValue.filter(
								(previousValueItemId) => previousValueItemId !== itemId
						  )
						: [...previousValue, itemId]
				);
			} else if (!isOverSmViewport && !hasNestedNavigation) {
				setExpanded(false);
			}
		},
		[mini, setExpanded, isOverSmViewport]
	);

	// Enable smooth transitions on devices that can afford it
	const hasDrawerTransitions =
		isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

	/**
	 * Renders the drawer content: top spacer + navigation list.
	 * Adds aria-label based on viewport for better semantics.
	 */
	const getDrawerContent = React.useCallback(
		(viewport: "phone" | "tablet" | "desktop") => (
			<React.Fragment>
				<Toolbar />
				<Box
					component="nav"
					aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
					sx={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						overflow: "auto",
						scrollbarGutter: mini ? "stable" : "auto",
						overflowX: "hidden",
						pt: !mini ? 0 : 2,
						...(hasDrawerTransitions
							? getDrawerSxTransitionMixin(isFullyExpanded, "padding")
							: {}),
					}}
				>
					<List
						dense
						sx={{
							padding: mini ? 0 : 0.5,
							mb: 4,
							width: mini ? MINI_DRAWER_WIDTH : "auto",
						}}
					>
						<DashboardSidebarPageItem
							id="books"
							title="Dashboard"
							icon={<Dashboard />}
							href="/dashboard"
							selected={
								!!matchPath("/dashboard/*", pathname) || pathname === "/"
							}
						/>
					</List>
				</Box>
			</React.Fragment>
		),
		[mini, hasDrawerTransitions, isFullyExpanded, expandedItemIds, pathname]
	);

	// Shared Drawer styles for all variants; width reacts to mini vs expanded
	const getDrawerSharedSx = React.useCallback(
		(isTemporary: boolean) => {
			const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

			return {
				displayPrint: "none",
				width: drawerWidth,
				flexShrink: 0,
				...getDrawerWidthTransitionMixin(expanded),
				...(isTemporary ? { position: "absolute" } : {}),
				[`& .MuiDrawer-paper`]: {
					position: "absolute",
					width: drawerWidth,
					boxSizing: "border-box",
					backgroundImage: "none",
					...getDrawerWidthTransitionMixin(expanded),
				},
			};
		},
		[expanded, mini]
	);

	// Expose sidebar state to descendants (page items) via context
	const sidebarContextValue = React.useMemo(() => {
		return {
			onPageItemClick: handlePageItemClick,
			mini,
			fullyExpanded: isFullyExpanded,
			fullyCollapsed: isFullyCollapsed,
			hasDrawerTransitions,
		};
	}, [
		handlePageItemClick,
		mini,
		isFullyExpanded,
		isFullyCollapsed,
		hasDrawerTransitions,
	]);

	return (
		<DashboardSidebarContext.Provider value={sidebarContextValue}>
			{/* Phone (xs): temporary overlay drawer */}
			<Drawer
				container={container}
				variant="temporary"
				open={expanded}
				onClose={handleSetSidebarExpanded(false)}
				ModalProps={{
					keepMounted: true,
					disableEnforceFocus: true,
					disableAutoFocus: true,
					disableRestoreFocus: true,
				}}
				sx={{
					display: {
						xs: "block",
						sm: disableCollapsibleSidebar ? "block" : "none",
						md: "none",
					},
					...getDrawerSharedSx(true),
				}}
			>
				{getDrawerContent("phone")}
			</Drawer>
			{/* Tablet (sm): permanent drawer when collapsible is enabled */}
			<Drawer
				variant="permanent"
				sx={{
					display: {
						xs: "none",
						sm: disableCollapsibleSidebar ? "none" : "block",
						md: "none",
					},
					...getDrawerSharedSx(false),
				}}
			>
				{getDrawerContent("tablet")}
			</Drawer>
			{/* Desktop (md+): permanent drawer */}
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: "none", md: "block" },
					...getDrawerSharedSx(false),
				}}
			>
				{getDrawerContent("desktop")}
			</Drawer>
		</DashboardSidebarContext.Provider>
	);
}
