import * as React from "react";
import Divider from "@mui/material/Divider";
import DashboardSidebarContext from "../context/DashboardSidebarContext";
import { getDrawerSxTransitionMixin } from "../mixins";

/**
 * DashboardSidebarDividerItem
 * Thin divider list item for grouping entries in the sidebar.
 * Uses drawer transition mixin so margins animate along with width changes.
 */
export default function DashboardSidebarDividerItem() {
	const sidebarContext = React.useContext(DashboardSidebarContext);
	if (!sidebarContext) {
		throw new Error("Sidebar context was used without a provider.");
	}
	const { fullyExpanded = true, hasDrawerTransitions } = sidebarContext;

	return (
		<li>
			<Divider
				sx={{
					borderBottomWidth: 1,
					my: 1,
					mx: -0.5,
					// Animate spacing when the drawer expands/collapses
					...(hasDrawerTransitions
						? getDrawerSxTransitionMixin(fullyExpanded, "margin")
						: {}),
				}}
			/>
		</li>
	);
}
