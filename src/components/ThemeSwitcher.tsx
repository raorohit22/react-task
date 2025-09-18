import * as React from "react";
import { useTheme, useColorScheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

/**
 * ThemeSwitcher
 * Small toggle that switches between light and dark modes.
 * Respects system preference when mode is 'system'.
 */
export default function ThemeSwitcher() {
	const theme = useTheme();

	// Resolve the system-preferred mode as a fallback for 'system'
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const preferredMode = prefersDarkMode ? "dark" : "light";

	const { mode, setMode } = useColorScheme();

	// Actual palette mode currently in effect
	const paletteMode = !mode || mode === "system" ? preferredMode : mode;

	// Toggle to the opposite palette mode
	const toggleMode = React.useCallback(() => {
		setMode(paletteMode === "dark" ? "light" : "dark");
	}, [setMode, paletteMode]);

	return (
		<Tooltip
			title={`${paletteMode === "dark" ? "Light" : "Dark"} mode`}
			enterDelay={1000}
		>
			<div>
				<IconButton
					size="small"
					aria-label={`Switch to ${
						paletteMode === "dark" ? "light" : "dark"
					} mode`}
					onClick={toggleMode}
				>
					{/* Swap icons via color scheme selector to avoid re-render jumps */}
					{theme.getColorSchemeSelector ? (
						<React.Fragment>
							<LightModeIcon
								sx={{
									display: "inline",
									[theme.getColorSchemeSelector("dark")]: {
										display: "none",
									},
								}}
							/>
							<DarkModeIcon
								sx={{
									display: "none",
									[theme.getColorSchemeSelector("dark")]: {
										display: "inline",
									},
								}}
							/>
						</React.Fragment>
					) : null}
				</IconButton>
			</div>
		</Tooltip>
	);
}
