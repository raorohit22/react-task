import { useContext, type ReactNode } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import type {} from "@mui/material/themeCssVarsAugmentation";
import DashboardSidebarContext from "../context/DashboardSidebarContext";
import { DRAWER_WIDTH } from "../constants";
import { getDrawerSxTransitionMixin } from "../mixins";

export interface DashboardSidebarHeaderItemProps {
	children?: ReactNode;
}

/**
 * DashboardSidebarHeaderItem
 * Section label inside the sidebar list. Collapses to 0 height in mini mode
 * and animates height during drawer transitions.
 */
export default function DashboardSidebarHeaderItem({
	children,
}: DashboardSidebarHeaderItemProps) {
	const sidebarContext = useContext(DashboardSidebarContext);
	if (!sidebarContext) {
		throw new Error("Sidebar context was used without a provider.");
	}
	const {
		mini = false,
		fullyExpanded = true,
		hasDrawerTransitions,
	} = sidebarContext;

	return (
		<ListSubheader
			sx={{
				fontSize: 12,
				fontWeight: "600",
				// Hide header in mini mode
				height: mini ? 0 : 36,
				// Smoothly animate height when expanding/collapsing the drawer
				...(hasDrawerTransitions
					? getDrawerSxTransitionMixin(fullyExpanded, "height")
					: {}),
				px: 1.5,
				py: 0,
				minWidth: DRAWER_WIDTH,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
				zIndex: 2,
			}}
		>
			{children}
		</ListSubheader>
	);
}
