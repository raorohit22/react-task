import { type Theme, type Components } from "@mui/material/styles";
import { listSubheaderClasses } from "@mui/material/ListSubheader";
import { listItemButtonClasses } from "@mui/material/ListItemButton";
import { typographyClasses } from "@mui/material/Typography";

/**
 * Sidebar (Drawer + List) customizations
 *
 * Keeps section subheaders and selected items visually consistent with the
 * overall theme. Selected list items inherit the primary text color to improve
 * contrast, especially in dark mode.
 */
/* eslint-disable import/prefer-default-export */
export const sidebarCustomizations: Components<Theme> = {
	MuiDrawer: {
		styleOverrides: {
			root: ({ theme }) => ({
				// Taller subheader line-height for breathing room
				[`& .${listSubheaderClasses.root}`]: {
					lineHeight: 3,
				},
				// Ensure selected items' labels use the primary text color
				[`& .${listItemButtonClasses.root}`]: {
					"&.Mui-selected": {
						[`& .${typographyClasses.root}`]: {
							color: (theme.vars ?? theme).palette.text.primary,
						},
					},
				},
			}),
		},
	},
};
