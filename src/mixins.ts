import { type Theme } from "@mui/material/styles";

/**
 * Drawer transition helpers
 *
 * Reusable mixins to apply consistent MUI transition curves and durations
 * when expanding/collapsing the sidebar drawer. Keeps width and property
 * transitions in sync with the theme's motion settings.
 */
export function getDrawerSxTransitionMixin(
	isExpanded: boolean,
	property: string
) {
	/**
	 * Returns an `sx`-ready transition style for the given CSS property.
	 * - `isExpanded` controls whether to use entering or leaving durations.
	 * - `property` is the CSS property to animate (e.g., 'width').
	 */
	return {
		transition: (theme: Theme) =>
			theme.transitions.create(property, {
				easing: theme.transitions.easing.sharp,
				duration: isExpanded
					? theme.transitions.duration.enteringScreen
					: theme.transitions.duration.leavingScreen,
			}),
	};
}

export function getDrawerWidthTransitionMixin(isExpanded: boolean) {
	// Convenience wrapper for width transitions with overflow hidden
	return {
		...getDrawerSxTransitionMixin(isExpanded, "width"),
		overflowX: "hidden",
	};
}
