import { useCallback, useRef, type ReactNode } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Stack from "@mui/material/Stack";
import { Link } from "react-router";
import ThemeSwitcher from "./ThemeSwitcher";

/**
 * DashboardHeader
 * Top application bar for the dashboard.
 * - Left: navigation menu toggle + brand (logo/title)
 * - Right: quick actions (currently theme switcher)
 * Controls the left navigation state via `menuOpen` and `onToggleMenu`.
 * Implements light focus management for accessibility when collapsing.
 */

// App bar styled to be flat with a subtle bottom border and stay above the drawer
const AppBar = styled(MuiAppBar)(({ theme }) => ({
	borderWidth: 0,
	borderBottomWidth: 1,
	borderStyle: "solid",
	borderColor: (theme.vars ?? theme).palette.divider,
	boxShadow: "none",
	zIndex: theme.zIndex.drawer + 1,
}));

// Wrapper to keep the logo aligned and constrained in height
const LogoContainer = styled("div")({
	position: "relative",
	height: 40,
	display: "flex",
	alignItems: "center",
	"& img": {
		maxHeight: 40,
	},
});

export interface DashboardHeaderProps {
	/** Optional brand mark shown left of the title (e.g. <img /> or an icon). */
	logo?: ReactNode;
	/** Optional product/app name shown next to the logo and linked to home. */
	title?: string;
	/** Whether the left navigation menu is currently expanded. */
	menuOpen: boolean;
	/** Callback invoked when toggling the left navigation menu. */
	onToggleMenu: (open: boolean) => void;
}

export default function DashboardHeader({
	logo,
	title,
	menuOpen,
	onToggleMenu,
}: DashboardHeaderProps) {
	const theme = useTheme();
	const appBarRef = useRef<HTMLDivElement>(null);

	// Toggle the sidebar; when collapsing, return focus to the toggle for a11y
	const handleMenuOpen = () => {
		onToggleMenu(!menuOpen);

		if (menuOpen) {
			requestAnimationFrame(() => {
				const toggleButton =
					appBarRef.current?.querySelector<HTMLButtonElement>(
						'button[aria-label*="navigation menu"]'
					);
				toggleButton?.focus();
			});
		}
	};

	/**
	 * Returns the menu toggle button with proper tooltip and ARIA label.
	 * Shows a different icon depending on the expanded/collapsed state.
	 */
	const getMenuIcon = useCallback(
		(isExpanded: boolean) => {
			return (
				<Tooltip
					title={`${isExpanded ? "Collapse" : "Expand"} menu`}
					enterDelay={1000}
				>
					<IconButton
						size="small"
						aria-label={`${isExpanded ? "Collapse" : "Expand"} navigation menu`}
						onClick={handleMenuOpen}
					>
						{isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
					</IconButton>
				</Tooltip>
			);
		},
		[handleMenuOpen]
	);

	return (
		<AppBar
			ref={appBarRef}
			color="inherit"
			position="absolute"
			sx={{
				displayPrint: "none",
			}}
		>
			<Toolbar sx={{ backgroundColor: "inherit", mx: { xs: -0.75, sm: -1 } }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					sx={{
						flexWrap: "wrap",
						width: "100%",
					}}
				>
					{/* Left section: menu toggle + brand (logo/title) */}
					<Stack direction="row" alignItems="center">
						<Box sx={{ mr: 1 }}>{getMenuIcon(menuOpen)}</Box>
						<Link to="/" style={{ textDecoration: "none" }}>
							<Stack direction="row" alignItems="center">
								{logo ? <LogoContainer>{logo}</LogoContainer> : null}
								{title ? (
									<Typography
										variant="h6"
										sx={{
											color: (theme.vars ?? theme).palette.primary.main,
											fontWeight: "700",
											ml: 1,
											whiteSpace: "nowrap",
											lineHeight: 1,
										}}
									>
										{title}
									</Typography>
								) : null}
							</Stack>
						</Link>
					</Stack>
					{/* Right section: quick actions (Theme switcher, add more later) */}
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						sx={{ marginLeft: "auto" }}
					>
						<Stack direction="row" alignItems="center">
							<ThemeSwitcher />
						</Stack>
					</Stack>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}
