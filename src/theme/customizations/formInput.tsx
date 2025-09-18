import { alpha, type Theme, type Components } from "@mui/material/styles";
import { inputBaseClasses } from "@mui/material/InputBase";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { formHelperTextClasses } from "@mui/material/FormHelperText";
import { iconButtonClasses } from "@mui/material/IconButton";
import { brand } from "../shared-theme/themePrimitives";

/**
 * Form input customizations (TextField, OutlinedInput, MUI X Pickers)
 *
 * Aims to make spacing consistent (labels, helper text) and provide a clearer
 * focus outline using our brand color. Also aligns MUI X Pickers inputs with
 * standard text fields (borders, paddings, and focus states).
 */
/* eslint-disable import/prefer-default-export */
export const formInputCustomizations: Components<Theme> = {
	MuiFormControl: {
		styleOverrides: {
			root: ({ theme }) => ({
				// Align MUI InputBase vertical spacing with our layout rhythm
				[`& .${inputBaseClasses.root}`]: {
					marginTop: 6,
				},
				// Start labels slightly smaller/higher so they don't overlap content
				[`& .${inputLabelClasses.root}`]: {
					transform: "translate(4px, -11px) scale(0.75)",
					[`&.${outlinedInputClasses.focused}`]: {
						transform: "translate(4px, -12px) scale(0.75)",
					},
				},
				// Give helper text a bit of left offset to align visually with inputs
				[`& .${formHelperTextClasses.root}`]: {
					marginLeft: 2,
				},
				// MUI X Pickers input alignment with OutlinedInput styling
				"& .MuiPickersInputBase-root": {
					marginTop: 6,
					border: `1px solid ${(theme.vars || theme).palette.divider}`,
					" .MuiPickersInputBase-sectionsContainer": {
						padding: "10px 0",
					},
					" .MuiPickersOutlinedInput-notchedOutline": {
						border: "none",
					},
					// On focus, draw a brand-colored outline ring and keep borders tidy
					[`&.MuiPickersOutlinedInput-root.Mui-focused`]: {
						border: `1px solid ${(theme.vars || theme).palette.divider}`,
						outline: `3px solid ${alpha(brand[500], 0.5)}`,
						borderColor: brand[400],
						" .MuiPickersOutlinedInput-notchedOutline": {
							border: "none",
						},
					},
					// Compact the calendar/clock icon buttons to match input height
					[` .${iconButtonClasses.root}`]: {
						border: "none",
						height: "34px",
						width: "34px",
					},
				},
			}),
		},
	},
};
