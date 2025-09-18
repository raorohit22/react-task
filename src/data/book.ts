import type { GridPaginationModel } from "@mui/x-data-grid";

/**
 * API representation of a book record.
 */
export interface ApiBook {
	id: number;
	title: string;
	author: string;
	genre: string;
	publishedYear: number;
	status: string;
}

// Base path for the books API.
// Typically proxied in development via Vite to `json-server`.
const API_BASE = "/api/books";

/**
 * Fetch a paginated list of books with optional client-side filtering.
 * Notes:
 * - This implementation fetches all rows first, then filters/sorts/paginates locally.
 * - It fits simple backends like json-server; swap to server-side params when needed.
 */
export async function getMany({
	paginationModel,
	search,
	genreFilter,
	statusFilter,
}: {
	paginationModel: GridPaginationModel;
	search?: string;
	genreFilter?: string;
	statusFilter?: string;
}): Promise<{ items: ApiBook[]; itemCount: number }> {
	// Fetch all data first
	const allRes = await fetch(API_BASE);
	if (!allRes.ok) throw new Error("Failed to fetch books");
	// Reverse so newer entries (by insertion) appear first; later we sort by id desc
	const allData: ApiBook[] = (await allRes.json()).reverse();

	// Filter on client side for search, genre, and status
	let filteredData = allData;

	// Search filter (title or author)
	if (search && search.trim()) {
		const searchTerm = search.trim().toLowerCase();
		filteredData = filteredData.filter(
			(book) =>
				book.title.toLowerCase().includes(searchTerm) ||
				book.author.toLowerCase().includes(searchTerm)
		);
	}

	// Genre filter
	if (genreFilter && genreFilter.trim()) {
		filteredData = filteredData.filter((book) => book.genre === genreFilter);
	}

	// Status filter
	if (statusFilter && statusFilter.trim()) {
		filteredData = filteredData.filter((book) => book.status === statusFilter);
	}

	// Sort by ID descending (latest first)
	const sortedData = filteredData.sort((a, b) => b.id - a.id);

	// Apply pagination (zero-based page index)
	const start = paginationModel.page * paginationModel.pageSize;
	const end = start + paginationModel.pageSize;
	const paginatedData = sortedData.slice(start, end);

	return {
		items: paginatedData,
		itemCount: filteredData.length,
	};
}

/**
 * Fetch a single book by id.
 */
export async function getOne(bookId: string | number) {
	const res = await fetch(`${API_BASE}/${bookId}`);
	if (!res.ok) throw new Error("Book not found");
	return (await res.json()) as ApiBook;
}

/**
 * Create a new book. Returns the created record from the API.
 */
export async function createOne(data: Omit<ApiBook, "id">) {
	const res = await fetch(API_BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to create book");
	return (await res.json()) as ApiBook;
}

/**
 * Update an existing book by id. Partial update excluding id.
 */
export async function updateOne(
	bookId: string | number,
	data: Partial<Omit<ApiBook, "id">>
) {
	const res = await fetch(`${API_BASE}/${bookId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to update book");
}

/**
 * Delete a book by id.
 */
export async function deleteOne(bookId: string | number) {
	const res = await fetch(`${API_BASE}/${bookId}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete book");
}
