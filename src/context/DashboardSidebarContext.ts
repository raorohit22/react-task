import * as React from "react";

/**
 * DashboardSidebarContext
 * Shared state/handlers for the sidebar components.
 * - `onPageItemClick`: invoked when an item is clicked; receives the id and whether it has nested items
 * - `mini`: true when the drawer is in compact rail mode
 * - `fullyExpanded` / `fullyCollapsed`: transition-completion flags to coordinate animations
 * - `hasDrawerTransitions`: whether to animate style changes (padding, height, margins)
 */
const DashboardSidebarContext = React.createContext<{
	onPageItemClick: (id: string, hasNestedNavigation: boolean) => void;
	mini: boolean;
	fullyExpanded: boolean;
	fullyCollapsed: boolean;
	hasDrawerTransitions: boolean;
} | null>(null);

export default DashboardSidebarContext;
