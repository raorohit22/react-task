import * as React from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Grow from "@mui/material/Grow";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type {} from "@mui/material/themeCssVarsAugmentation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router";
import DashboardSidebarContext from "../context/DashboardSidebarContext";
import { MINI_DRAWER_WIDTH } from "../constants";

export interface DashboardSidebarPageItemProps {
	id: string;
	title: string;
	icon?: React.ReactNode;
	href: string;
	action?: React.ReactNode;
	defaultExpanded?: boolean;
	expanded?: boolean;
	selected?: boolean;
	disabled?: boolean;
	nestedNavigation?: React.ReactNode;
}

/**
 * DashboardSidebarPageItem
 * Single navigable item in the sidebar with optional nested navigation.
 * - In mini mode: shows icon + tiny caption; nested items appear on hover in a floating panel.
 * - In full mode: shows text, optional action, and an expand/collapse chevron.
 * - Supports external links via `href` beginning with http/https.
 */
export default function DashboardSidebarPageItem({
	id,
	title,
	icon,
	href,
	action,
	defaultExpanded = false,
	expanded = defaultExpanded,
	selected = false,
	disabled = false,
	nestedNavigation,
}: DashboardSidebarPageItemProps) {
	const sidebarContext = React.useContext(DashboardSidebarContext);
	if (!sidebarContext) {
		throw new Error("Sidebar context was used without a provider.");
	}
	const {
		onPageItemClick,
		mini = false,
		fullyExpanded = true,
		fullyCollapsed = false,
	} = sidebarContext;

	const [isHovered, setIsHovered] = React.useState(false);

	const handleClick = React.useCallback(() => {
		if (onPageItemClick) {
			onPageItemClick(id, !!nestedNavigation);
		}
	}, [onPageItemClick, id, nestedNavigation]);

	let nestedNavigationCollapseSx: SxProps<Theme> = { display: "none" };
	if (mini && fullyCollapsed) {
		nestedNavigationCollapseSx = {
			fontSize: 18,
			position: "absolute",
			top: "41.5%",
			right: "2px",
			transform: "translateY(-50%) rotate(-90deg)",
		};
	} else if (!mini && fullyExpanded) {
		nestedNavigationCollapseSx = {
			ml: 0.5,
			fontSize: 20,
			transform: `rotate(${expanded ? 0 : -90}deg)`,
			transition: (theme: Theme) =>
				theme.transitions.create("transform", {
					easing: theme.transitions.easing.sharp,
					duration: 100,
				}),
		};
	}

	const hasExternalHref = href
		? href.startsWith("http://") || href.startsWith("https://")
		: false;

	// Use anchor for external URLs; client-side Link for internal routes
	const LinkComponent = hasExternalHref ? "a" : Link;

	// Provide "full" sidebar context for nested content displayed in mini hover panel
	const miniNestedNavigationSidebarContextValue = React.useMemo(() => {
		return {
			onPageItemClick: onPageItemClick ?? (() => {}),
			mini: false,
			fullyExpanded: true,
			fullyCollapsed: false,
			hasDrawerTransitions: false,
		};
	}, [onPageItemClick]);

	return (
		<React.Fragment>
			<ListItem
				disablePadding
				{...(nestedNavigation && mini
					? {
							// For mini mode with children: toggle hover to show floating submenu
							onMouseEnter: () => {
								setIsHovered(true);
							},
							onMouseLeave: () => {
								setIsHovered(false);
							},
					  }
					: {})}
				sx={{
					display: "block",
					py: 0,
					px: 1,
					overflowX: "hidden",
				}}
			>
				<ListItemButton
					selected={selected}
					disabled={disabled}
					sx={{
						height: mini ? 50 : "auto",
					}}
					{...(nestedNavigation && !mini
						? {
								// Expand/collapse nested items in full mode
								onClick: handleClick,
						  }
						: {})}
					{...(!nestedNavigation
						? {
								LinkComponent,
								...(hasExternalHref
									? {
											// Security best practices for external links
											target: "_blank",
											rel: "noopener noreferrer",
									  }
									: {}),
								to: href,
								onClick: handleClick,
						  }
						: {})}
				>
					{icon || mini ? (
						<Box
							sx={
								mini
									? {
											// Center icon in the mini rail and add caption underneath
											position: "absolute",
											left: "50%",
											top: "calc(50% - 6px)",
											transform: "translate(-50%, -50%)",
									  }
									: {}
							}
						>
							<ListItemIcon
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: mini ? "center" : "auto",
								}}
							>
								{icon ?? null}
								{!icon && mini ? (
									<Avatar
										sx={{
											fontSize: 10,
											height: 16,
											width: 16,
										}}
									>
										{title
											.split(" ")
											.slice(0, 2)
											.map((titleWord) => titleWord.charAt(0).toUpperCase())}
									</Avatar>
								) : null}
							</ListItemIcon>
							{mini ? (
								<Typography
									variant="caption"
									sx={{
										position: "absolute",
										bottom: -18,
										left: "50%",
										transform: "translateX(-50%)",
										fontSize: 10,
										fontWeight: 500,
										textAlign: "center",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										maxWidth: MINI_DRAWER_WIDTH - 28,
									}}
								>
									{title}
								</Typography>
							) : null}
						</Box>
					) : null}
					{!mini ? (
						<ListItemText
							primary={title}
							sx={{
								whiteSpace: "nowrap",
								zIndex: 1,
							}}
						/>
					) : null}
					{/* Optional trailing action for the row (e.g., pin, settings) */}
					{action && !mini && fullyExpanded ? action : null}
					{/* Chevron rotates/positions based on mini/full state */}
					{nestedNavigation ? (
						<ExpandMoreIcon sx={nestedNavigationCollapseSx} />
					) : null}
				</ListItemButton>
				{/* Mini mode: floating submenu next to the rail on hover */}
				{nestedNavigation && mini ? (
					<Grow in={isHovered}>
						<Box
							sx={{
								position: "fixed",
								left: MINI_DRAWER_WIDTH - 2,
								pl: "6px",
							}}
						>
							<Paper
								elevation={8}
								sx={{
									pt: 0.2,
									pb: 0.2,
									transform: "translateY(-50px)",
								}}
							>
								<DashboardSidebarContext.Provider
									value={miniNestedNavigationSidebarContextValue}
								>
									{nestedNavigation}
								</DashboardSidebarContext.Provider>
							</Paper>
						</Box>
					</Grow>
				) : null}
				{/* Full mode: nested content collapses below the row */}
			</ListItem>
			{nestedNavigation && !mini ? (
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					{nestedNavigation}
				</Collapse>
			) : null}
		</React.Fragment>
	);
}
