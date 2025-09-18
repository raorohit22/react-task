import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
	DataGrid,
	GridActionsCellItem,
	type GridColDef,
	type GridFilterModel,
	type GridPaginationModel,
	type GridSortModel,
	type GridEventListener,
	gridClasses,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router";
import { useDialogs } from "../hooks/useDialogs/useDialogs";
import useNotifications from "../hooks/useNotifications/useNotifications";
import {
	deleteOne as deleteBook,
	getMany as getBooks,
	type ApiBook,
} from "../data/book";
import PageContainer from "./PageContainer";
import {
	useQuery,
	useQueryClient,
	keepPreviousData,
} from "@tanstack/react-query";

const INITIAL_PAGE_SIZE = 10;

/**
 * BookList
 * Paginated, server-driven list of books using MUI DataGrid and React Query.
 * Features:
 * - Search (debounced), genre and status filters
 * - Server pagination and preserved placeholder data during refetch
 * - Responsive columns and compact actions for mobile/tablet
 * - Row click navigates to details; inline actions for edit/delete
 */
export default function BookList() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.down("md"));

	// Local UI state: search + filter chips and their menus
	const [search, setSearch] = React.useState<string>("");
	const [genreFilter, setGenreFilter] = React.useState<string>("");
	const [statusFilter, setStatusFilter] = React.useState<string>("");
	const [genreMenuAnchor, setGenreMenuAnchor] =
		React.useState<null | HTMLElement>(null);
	const [statusMenuAnchor, setStatusMenuAnchor] =
		React.useState<null | HTMLElement>(null);
	// Defer search input value to reduce query churn while typing
	const debouncedSearch = React.useDeferredValue(search);
	const navigate = useNavigate();

	const dialogs = useDialogs();
	const notifications = useNotifications();

	// DataGrid models managed locally; sent to server-side query
	const [paginationModel, setPaginationModel] =
		React.useState<GridPaginationModel>({
			page: 0,
			pageSize: INITIAL_PAGE_SIZE,
		});
	const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
		items: [],
	});
	const [sortModel, setSortModel] = React.useState<GridSortModel>([]);

	const queryClient = useQueryClient();

	// Fetch books with server pagination and filters; keepPreviousData for smooth paging
	const { data, isLoading, error } = useQuery({
		queryKey: [
			"books",
			paginationModel,
			debouncedSearch,
			genreFilter,
			statusFilter,
		],
		queryFn: () =>
			getBooks({
				paginationModel,
				search: debouncedSearch,
				genreFilter,
				statusFilter,
			}),
		staleTime: 30_000,
		placeholderData: keepPreviousData,
	});

	React.useEffect(() => {
		// Ensure we always jump back to first page when search or filters change
		setPaginationModel((prev) => ({ ...prev, page: 0 }));
	}, [debouncedSearch, genreFilter, statusFilter]);

	// Handlers for DataGrid models
	const handlePaginationModelChange = React.useCallback(
		(model: GridPaginationModel) => {
			setPaginationModel(model);
		},
		[]
	);

	const handleFilterModelChange = React.useCallback(
		(model: GridFilterModel) => {
			setFilterModel(model);
		},
		[]
	);

	const handleSortModelChange = React.useCallback((model: GridSortModel) => {
		setSortModel(model);
	}, []);

	const handleRowClick = React.useCallback<GridEventListener<"rowClick">>(
		({ row }: { row: ApiBook }) => {
			navigate(`/books/${row.id}`);
		},
		[navigate]
	);

	// Top-level action buttons
	const handleCreateClick = React.useCallback(() => {
		navigate("/books/new");
	}, [navigate]);

	// Row actions
	const handleRowEdit = React.useCallback(
		(book: ApiBook) => () => {
			navigate(`/books/${book.id}/edit`);
		},
		[navigate]
	);

	const handleRowDelete = React.useCallback(
		(book: ApiBook) => async () => {
			const confirmed = await dialogs.confirm(
				`Do you wish to delete ${book.title}?`,
				{
					title: `Delete book?`,
					severity: "error",
					okText: "Delete",
					cancelText: "Cancel",
				}
			);

			if (confirmed) {
				try {
					await deleteBook(String(book.id));

					notifications.show("Book deleted successfully.", {
						severity: "success",
						autoHideDuration: 3000,
					});
					queryClient.invalidateQueries({ queryKey: ["books"] });
				} catch (deleteError) {
					notifications.show(
						`Failed to delete book. Reason:' ${(deleteError as Error).message}`,
						{
							severity: "error",
							autoHideDuration: 3000,
						}
					);
				}
			}
		},
		[dialogs, notifications, queryClient]
	);

	const initialState = React.useMemo(
		() => ({
			pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
			columns: {
				columnVisibilityModel: {
					// Hide less important columns on mobile
					genre: !isMobile,
					publishedYear: !isMobile,
				},
			},
		}),
		[isMobile]
	);

	// DataGrid column config; serial number computed from page/pageSize
	const columns = React.useMemo<GridColDef[]>(
		() => [
			{
				field: "serialNo",
				headerName: "S.No",
				width: isMobile ? 60 : 80,
				sortable: false,
				filterable: false,
				renderCell: (params) => {
					const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
						params.id
					);
					const currentPage = paginationModel.page;
					const pageSize = paginationModel.pageSize;
					return currentPage * pageSize + rowIndex + 1;
				},
			},
			{
				field: "title",
				headerName: "Title",
				flex: isMobile ? 2 : 1,
				minWidth: isMobile ? 120 : 160,
				sortable: false,
				filterable: false,
			},
			{
				field: "author",
				headerName: "Author",
				flex: isMobile ? 1 : 1,
				minWidth: isMobile ? 100 : 140,
				sortable: false,
				filterable: false,
			},
			{
				field: "genre",
				headerName: "Genre",
				width: isTablet ? 120 : 140,
				sortable: false,
				filterable: false,
			},
			{
				field: "publishedYear",
				headerName: "Published Year",
				type: "custom",
				width: isTablet ? 100 : 120,
				sortable: false,
				filterable: false,
			},
			{
				field: "status",
				headerName: "Status",
				width: isMobile ? 80 : 100,
				sortable: false,
				filterable: false,
			},
			{
				field: "actions",
				type: "actions",
				headerName: "Actions",
				width: isMobile ? 100 : 120,
				align: "center",
				getActions: ({ row }: { row: ApiBook }) => [
					<GridActionsCellItem
						key="edit-item"
						icon={<EditIcon />}
						label="Edit"
						onClick={handleRowEdit(row)}
						size="small"
					/>,
					<GridActionsCellItem
						key="delete-item"
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleRowDelete(row)}
						size="small"
					/>,
				],
			},
		],
		[handleRowEdit, handleRowDelete, paginationModel, isMobile, isTablet]
	);

	const pageTitle = "Books";

	const handleGenreClick = (event: React.MouseEvent<HTMLElement>) => {
		setGenreMenuAnchor(event.currentTarget);
	};

	const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
		setStatusMenuAnchor(event.currentTarget);
	};

	const handleGenreClose = () => {
		setGenreMenuAnchor(null);
	};

	const handleStatusClose = () => {
		setStatusMenuAnchor(null);
	};

	const handleGenreSelect = (value: string) => {
		setGenreFilter(value);
		handleGenreClose();
	};

	const handleStatusSelect = (value: string) => {
		setStatusFilter(value);
		handleStatusClose();
	};

	const handleSearchClear = () => {
		setSearch("");
	};

	return (
		<PageContainer
			title={pageTitle}
			actions={
				<Box sx={{ width: "100%" }}>
					{/* Search Input Box */}
					<Box sx={{ width: "100%", mb: 2 }}>
						<TextField
							value={search}
							onChange={(e) => {
								const value = e.target.value;
								setSearch(value);
							}}
							placeholder="Search title or author"
							size="small"
							fullWidth
							variant="outlined"
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon color="action" />
										</InputAdornment>
									),
									endAdornment: search && (
										<InputAdornment position="end">
											<IconButton
												aria-label="clear search"
												onClick={handleSearchClear}
												edge="end"
												size="small"
												sx={{
													minWidth: "auto",
													width: "30px",
													height: "30px",
												}}
											>
												<ClearIcon />
											</IconButton>
										</InputAdornment>
									),
								},
							}}
							sx={{
								"& .MuiOutlinedInput-root": {
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "primary.main",
									},
								},
							}}
						/>
					</Box>

					{/* Filter and Create Buttons Box */}
					<Box sx={{ width: "100%" }}>
						<Stack
							direction="row"
							spacing={1}
							sx={{
								width: "100%",
								justifyContent: { xs: "space-between", sm: "flex-end" },
							}}
						>
							{/* Genre Filter Button */}
							<Button
								variant={genreFilter ? "contained" : "outlined"}
								onClick={handleGenreClick}
								size="small"
								sx={{
									minWidth: { xs: "80px", sm: "100px", md: "120px" },
									flex: { xs: 1, sm: "none" },
									px: { xs: 1, sm: 2 },
								}}
							>
								{genreFilter ? (
									<Chip
										label={
											genreFilter.length > 8
												? `${genreFilter.substring(0, 8)}...`
												: genreFilter
										}
										size="small"
										onDelete={() => handleGenreSelect("")}
										sx={{
											height: 20,
											fontSize: "0.75rem",
											maxWidth: "100%",
											"& .MuiChip-label": {
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											},
										}}
									/>
								) : (
									"Genre"
								)}
							</Button>

							{/* Status Filter Button */}
							<Button
								variant={statusFilter ? "contained" : "outlined"}
								onClick={handleStatusClick}
								size="small"
								sx={{
									minWidth: { xs: "80px", sm: "100px", md: "120px" },
									flex: { xs: 1, sm: "none" },
									px: { xs: 1, sm: 2 },
								}}
							>
								{statusFilter ? (
									<Chip
										label={statusFilter}
										size="small"
										onDelete={() => handleStatusSelect("")}
										sx={{
											height: 20,
											fontSize: "0.75rem",
											maxWidth: "100%",
											"& .MuiChip-label": {
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											},
										}}
									/>
								) : (
									"Status"
								)}
							</Button>

							{/* Create Button */}
							<Button
								variant="contained"
								onClick={handleCreateClick}
								startIcon={<AddIcon />}
								size="small"
								sx={{
									minWidth: { xs: "80px", sm: "100px" },
									flex: { xs: 1, sm: "none" },
									px: { xs: 1, sm: 2 },
								}}
							>
								Create
							</Button>
						</Stack>
					</Box>
				</Box>
			}
		>
			{/* Genre Menu */}
			<Menu
				anchorEl={genreMenuAnchor}
				open={Boolean(genreMenuAnchor)}
				onClose={handleGenreClose}
				slotProps={{
					paper: {
						style: {
							maxHeight: 300,
							width: "200px",
						},
					},
				}}
			>
				<MenuItem onClick={() => handleGenreSelect("")}>
					<em>All Genres</em>
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Thriller")}>
					Thriller
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Memoir")}>Memoir</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Self-Help")}>
					Self-Help
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Science Fiction")}>
					Science Fiction
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Fantasy")}>
					Fantasy
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Biography")}>
					Biography
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Philosophy")}>
					Philosophy
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("History")}>
					History
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Dystopian")}>
					Dystopian
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Classic")}>
					Classic
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Romance")}>
					Romance
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Post-Apocalyptic")}>
					Post-Apocalyptic
				</MenuItem>
				<MenuItem onClick={() => handleGenreSelect("Horror")}>Horror</MenuItem>
			</Menu>

			{/* Status Menu */}
			<Menu
				anchorEl={statusMenuAnchor}
				open={Boolean(statusMenuAnchor)}
				onClose={handleStatusClose}
				slotProps={{
					paper: {
						style: {
							maxHeight: 300,
							width: "150px",
						},
					},
				}}
			>
				<MenuItem onClick={() => handleStatusSelect("")}>
					<em>All Status</em>
				</MenuItem>
				<MenuItem onClick={() => handleStatusSelect("Available")}>
					Available
				</MenuItem>
				<MenuItem onClick={() => handleStatusSelect("Issued")}>Issued</MenuItem>
			</Menu>

			<Box sx={{ flex: 1, width: "100%" }}>
				{error ? (
					<Box sx={{ flexGrow: 1 }}>
						<Alert severity="error">{error.message}</Alert>
					</Box>
				) : (
					<DataGrid
						rows={(data as any)?.items ?? []}
						rowCount={(data as any)?.itemCount ?? 0}
						columns={columns}
						pagination
						paginationMode="server"
						paginationModel={paginationModel}
						onPaginationModelChange={handlePaginationModelChange}
						sortModel={sortModel}
						onSortModelChange={handleSortModelChange}
						filterModel={filterModel}
						onFilterModelChange={handleFilterModelChange}
						disableRowSelectionOnClick
						onRowClick={handleRowClick}
						loading={isLoading}
						initialState={initialState}
						showToolbar={false}
						pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
						getRowId={(row) => (row as ApiBook).id}
						disableColumnFilter
						disableColumnMenu
						disableColumnSelector
						disableDensitySelector
						sortingOrder={[]}
						sx={{
							height: { xs: "calc(100vh - 250px)", sm: "calc(100vh - 200px)" },
							[`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
								outline: "transparent",
							},
							[`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
								{
									outline: "none",
								},
							[`& .${gridClasses.row}:hover`]: {
								cursor: "pointer",
							},
							"& .MuiDataGrid-cell": {
								fontSize: { xs: "0.875rem", sm: "0.9rem" },
							},
							"& .MuiDataGrid-columnHeader": {
								fontSize: { xs: "0.875rem", sm: "0.9rem" },
								fontWeight: 600,
							},
						}}
						slotProps={{
							loadingOverlay: {
								variant: "circular-progress",
								noRowsVariant: "circular-progress",
							},
							baseIconButton: {
								size: "small",
							},
						}}
					/>
				)}
			</Box>
		</PageContainer>
	);
}
