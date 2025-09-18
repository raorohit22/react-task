import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import BookLabIcon from "./BookLabIcon";

/**
 * DashboardLayout
 * Root shell for the dashboard pages. It composes:
 * - Top AppBar: `DashboardHeader` (menu toggle + brand + actions)
 * - Left Drawer: `DashboardSidebar` (navigation)
 * - Main content area: renders nested routes via <Outlet />
 *
 * Responsive behavior:
 * - Uses MUI breakpoints to keep separate expansion state for desktop vs mobile
 * - On `md` and up, the desktop expansion state is used
 * - Below `md`, the mobile expansion state is used (drawer-style)
 */
export default function DashboardLayout() {
	const theme = useTheme();

	// Persist separate expansion states for desktop and mobile
	const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
		React.useState(true);
	const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
		React.useState(false);

	// Track viewport breakpoint to switch which state we read/write
	const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

	// Read the active expansion state based on viewport
	const isNavigationExpanded = isOverMdViewport
		? isDesktopNavigationExpanded
		: isMobileNavigationExpanded;

	// Setter that writes to the correct state bucket for the current viewport
	const setIsNavigationExpanded = React.useCallback(
		(newExpanded: boolean) => {
			if (isOverMdViewport) {
				setIsDesktopNavigationExpanded(newExpanded);
			} else {
				setIsMobileNavigationExpanded(newExpanded);
			}
		},
		[
			isOverMdViewport,
			setIsDesktopNavigationExpanded,
			setIsMobileNavigationExpanded,
		]
	);

	// Header passes back the desired expansion state (post-toggle)
	const handleToggleHeaderMenu = React.useCallback(
		(isExpanded: boolean) => {
			setIsNavigationExpanded(isExpanded);
		},
		[setIsNavigationExpanded]
	);

	// Provides a DOM container for the sidebar (useful for portal-based drawers)
	const layoutRef = React.useRef<HTMLDivElement>(null);

	return (
		<Box
			ref={layoutRef}
			sx={{
				position: "relative",
				display: "flex",
				height: "100vh",
				width: "100%",
			}}
		>
			{/* Top app bar with brand and menu toggle */}
			<DashboardHeader
				logo={<BookLabIcon />}
				title=""
				menuOpen={isNavigationExpanded}
				onToggleMenu={handleToggleHeaderMenu}
			/>
			{/* Left navigation drawer; controlled via responsive expansion state */}
			<DashboardSidebar
				expanded={isNavigationExpanded}
				setExpanded={setIsNavigationExpanded}
				container={layoutRef?.current ?? undefined}
			/>
			{/* Main content column */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					minWidth: 0,
					overflow: "hidden",
				}}
			>
				{/* Spacer to offset the fixed AppBar height */}
				<Toolbar sx={{ displayPrint: "none" }} />
				<Box
					component="main"
					sx={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						minHeight: 0,
					}}
				>
					{/* Routed page content renders here */}
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
