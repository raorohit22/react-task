"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container, { type ContainerProps } from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/**
 * PageContainer
 * Shared page shell used across views.
 * - Renders a page title (left) and an actions area (right)
 * - Provides a flex column layout for the page contents
 */
const PageContentHeader = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	gap: theme.spacing(2),
}));

// Right-aligned action toolbar (wrap-safe)
const PageHeaderToolbar = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	gap: theme.spacing(1),
	// Ensure the toolbar is always on the right side, even after wrapping
	marginLeft: "auto",
}));

export interface PageContainerProps extends ContainerProps {
	/** Page body */
	children?: React.ReactNode;
	/** Optional page title rendered on the left */
	title?: string;
	/** Optional actions rendered on the right of the header */
	actions?: React.ReactNode;
}

export default function PageContainer(props: PageContainerProps) {
	const { children, title, actions = null } = props;

	return (
		// Root container with page-level padding and vertical layout
		<Container sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
			<Stack sx={{ flex: 1, my: 2 }} spacing={2}>
				<Stack>
					{/* Title + actions header */}
					<PageContentHeader>
						{title ? <Typography variant="h4">{title}</Typography> : null}
						<PageHeaderToolbar>{actions}</PageHeaderToolbar>
					</PageContentHeader>
				</Stack>
				{/* Page content area */}
				<Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
					{children}
				</Box>
			</Stack>
		</Container>
	);
}
