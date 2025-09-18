import { paperClasses } from "@mui/material/Paper";
import { alpha, type Theme } from "@mui/material/styles";
import { menuItemClasses } from "@mui/material/MenuItem";
import { listItemIconClasses } from "@mui/material/ListItemIcon";
import { iconButtonClasses } from "@mui/material/IconButton";
import { inputBaseClasses } from "@mui/material/InputBase";
import { checkboxClasses } from "@mui/material/Checkbox";
import { listClasses } from "@mui/material/List";
import { gridClasses } from "@mui/x-data-grid";
import { tablePaginationClasses } from "@mui/material/TablePagination";
import { gray } from "../shared-theme/themePrimitives";

/**
 * MUI X DataGrid theme customizations
 *
 * Centralizes look-and-feel tweaks for the DataGrid used across the app.
 * These overrides keep table visuals consistent with our surfaces (paper/background),
 * reduce visual noise (smaller checkboxes and icons), and improve affordances
 * for hover/selection, quick filters, and context menus.
 *
 * How to use:
 * - Imported into the theme and spread into `components` so that all DataGrid
 *   instances share the same baseline styles.
 * - Color values are derived from the theme palette to automatically adapt to
 *   light/dark modes.
 */
/* eslint-disable import/prefer-default-export */
export const dataGridCustomizations = {
	MuiDataGrid: {
		styleOverrides: {
			// Root grid container (outer frame, header/footer backgrounds, sizing tokens)
			root: ({ theme }: { theme: Theme }) => ({
				"--DataGrid-overlayHeight": "300px",
				overflow: "clip",
				borderColor: (theme.vars || theme).palette.divider,
				backgroundColor: (theme.vars || theme).palette.background.default,
				[`& .${gridClasses.columnHeader}`]: {
					backgroundColor: (theme.vars || theme).palette.background.paper,
				},
				[`& .${gridClasses.footerContainer}`]: {
					backgroundColor: (theme.vars || theme).palette.background.paper,
				},
				// Compact the selection checkbox footprint
				[`& .${checkboxClasses.root}`]: {
					padding: theme.spacing(0.5),
					"& > svg": {
						fontSize: "1rem",
					},
				},
				// Pagination controls: enforce compact square icon buttons
				[`& .${tablePaginationClasses.root}`]: {
					marginRight: theme.spacing(1),
					"& .MuiIconButton-root": {
						maxHeight: 32,
						maxWidth: 32,
						"& > svg": {
							fontSize: "1rem",
						},
					},
				},
			}),
			// Cell top borders use divider color to subtly delineate rows
			cell: ({ theme }: { theme: Theme }) => ({
				borderTopColor: (theme.vars || theme).palette.divider,
			}),
			// Context and column menus styling (paper border, paddings, icon spacing)
			menu: ({ theme }: { theme: Theme }) => ({
				borderRadius: theme.shape.borderRadius,
				backgroundImage: "none",
				[`& .${paperClasses.root}`]: {
					border: `1px solid ${(theme.vars || theme).palette.divider}`,
				},

				[`& .${menuItemClasses.root}`]: {
					margin: "0 4px",
				},
				[`& .${listItemIconClasses.root}`]: {
					marginRight: 0,
				},
				[`& .${listClasses.root}`]: {
					paddingLeft: 0,
					paddingRight: 0,
				},
			}),

			// Row hover and selection backgrounds aligned with theme.action tokens
			row: ({ theme }: { theme: Theme }) => ({
				"&:last-of-type": {
					borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
				},
				"&:hover": {
					backgroundColor: (theme.vars || theme).palette.action.hover,
				},
				"&.Mui-selected": {
					background: (theme.vars || theme).palette.action.selected,
					"&:hover": {
						backgroundColor: (theme.vars || theme).palette.action.hover,
					},
				},
			}),
			// Action icon buttons (e.g., column menu trigger) with clear hover/active states
			iconButtonContainer: ({ theme }: { theme: Theme }) => ({
				[`& .${iconButtonClasses.root}`]: {
					border: "none",
					backgroundColor: "transparent",
					"&:hover": {
						backgroundColor: alpha(theme.palette.action.selected, 0.3),
					},
					"&:active": {
						backgroundColor: gray[200],
					},
					// Dark mode adjustments using theme.applyStyles helper
					...theme.applyStyles("dark", {
						color: gray[50],
						"&:hover": {
							backgroundColor: gray[800],
						},
						"&:active": {
							backgroundColor: gray[900],
						},
					}),
				},
			}),
			// Column menu icon button (in header) hover/active palette
			menuIconButton: ({ theme }: { theme: Theme }) => ({
				border: "none",
				backgroundColor: "transparent",
				"&:hover": {
					backgroundColor: gray[100],
				},
				"&:active": {
					backgroundColor: gray[200],
				},
				...theme.applyStyles("dark", {
					color: gray[50],
					"&:hover": {
						backgroundColor: gray[800],
					},
					"&:active": {
						backgroundColor: gray[900],
					},
				}),
			}),
			// Filter panel layout spacing
			filterForm: ({ theme }: { theme: Theme }) => ({
				gap: theme.spacing(1),
				alignItems: "flex-end",
			}),
			// Columns panel paddings
			columnsManagementHeader: ({ theme }: { theme: Theme }) => ({
				paddingRight: theme.spacing(3),
				paddingLeft: theme.spacing(3),
			}),
			// Ensure header title container stretches so actions align right
			columnHeaderTitleContainer: {
				flexGrow: 1,
				justifyContent: "space-between",
			},
			// Room for drag handle without overlapping actions
			columnHeaderDraggableContainer: { paddingRight: 2 },
			// Align toolbar background to paper surface
			toolbar: ({ theme }: { theme: Theme }) => ({
				backgroundColor: (theme.vars || theme).palette.background.paper,
			}),
			// Quick filter: compact input and icons
			toolbarQuickFilter: {
				[`& .${inputBaseClasses.root}`]: {
					marginLeft: 6,
					marginRight: 6,
				},
				[`& .${iconButtonClasses.root}`]: {
					height: "36px",
					width: "36px",
				},
				[`& .${iconButtonClasses.edgeEnd}`]: {
					border: "none",
					height: "28px",
					width: "28px",
				},
			},
		},
	},
};
