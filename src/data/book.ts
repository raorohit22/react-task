
import type { GridPaginationModel } from '@mui/x-data-grid';

export interface ApiBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: string;
}

const API_BASE = '/api/books';

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
  if (!allRes.ok) throw new Error('Failed to fetch books');
  const allData: ApiBook[] = (await allRes.json()).reverse();

  // Filter on client side for search, genre, and status
  let filteredData = allData;

  // Search filter (title or author)
  if (search && search.trim()) {
    const searchTerm = search.trim().toLowerCase();
    filteredData = filteredData.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  // Genre filter
  if (genreFilter && genreFilter.trim()) {
    filteredData = filteredData.filter(book =>
      book.genre === genreFilter
    );
  }

  // Status filter
  if (statusFilter && statusFilter.trim()) {
    filteredData = filteredData.filter(book =>
      book.status === statusFilter
    );
  }

  // Sort by ID descending (latest first)
  const sortedData = filteredData.sort((a, b) => b.id - a.id);

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedData = sortedData.slice(start, end);

  return {
    items: paginatedData,
    itemCount: filteredData.length
  };
}

export async function getOne(bookId: string | number) {
  const res = await fetch(`${API_BASE}/${bookId}`);
  if (!res.ok) throw new Error('Book not found');
  return (await res.json()) as ApiBook;
}

export async function createOne(data: Omit<ApiBook, 'id'>) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create book');
  return (await res.json()) as ApiBook;
}

export async function updateOne(bookId: string | number, data: Partial<Omit<ApiBook, 'id'>>) {
  const res = await fetch(`${API_BASE}/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update book');
}

export async function deleteOne(bookId: string | number) {
  const res = await fetch(`${API_BASE}/${bookId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete book');
}
