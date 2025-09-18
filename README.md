# 📚 Book Management System

A modern, responsive book management application built with React and Material-UI. This application provides a complete CRUD (Create, Read, Update, Delete) interface for managing a library of books with advanced features like search, filtering, and pagination.

## 🚀 Live Demo

The application is available at: `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend Framework & Libraries

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing with browser history

### UI Framework & Styling

- **Material-UI (MUI) v5** - Comprehensive React component library
- **MUI X Data Grid** - Advanced data table with built-in features
- **MUI System** - Styling solution with responsive design utilities
- **CSS-in-JS** - Styled components using MUI's sx prop

### State Management & Data Fetching

- **TanStack React Query** - Server state management and caching
- **React Hook Form** - Performant form handling with validation
- **React Context** - Global state for notifications and dialogs

### Backend & API

- **JSON Server** - Mock REST API for development
- **Vite Proxy** - API request proxying to avoid CORS issues

### Development Tools

- **ESLint** - Code linting and quality assurance
- **TypeScript** - Static type checking
- **Vite Dev Server** - Hot module replacement and fast builds

## ✨ Features

### 📖 Book Management

- **Create Books** - Add new books with comprehensive form validation
- **View Books** - Detailed book information display
- **Edit Books** - Update existing book details
- **Delete Books** - Remove books with confirmation dialogs

### 🔍 Search & Filtering

- **Real-time Search** - Search by title or author with debounced input
- **Genre Filtering** - Filter books by genre with dropdown selection
- **Status Filtering** - Filter by availability status (Available/Issued)
- **Client-side Filtering** - Fast filtering without server requests

### 📊 Data Display

- **Responsive Data Grid** - Mobile-friendly table with responsive columns
- **Pagination** - Server-side pagination with configurable page sizes
- **Serial Numbers** - Continuous numbering across pages
- **Sorting** - Latest books displayed first (by ID descending)

### 📱 Responsive Design

- **Mobile-First** - Optimized for all screen sizes
- **Adaptive Layout** - Sidebar collapses on mobile devices
- **Responsive Forms** - Form fields stack on small screens
- **Touch-Friendly** - Large touch targets for mobile interaction

### 🎨 User Experience

- **Loading States** - Visual feedback during data operations
- **Error Handling** - User-friendly error messages and notifications
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Theme Support** - Light/dark mode toggle
- **Smooth Animations** - Transitions and hover effects

## 🏗️ Project Structure

The project structure for the Book Management System is as follows:

```
react-assignment/
├── db.json
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── booklab.svg
└── src/
    ├── App.tsx
    ├── constants.ts
    ├── CrudDashboard.tsx
    ├── index.css
    ├── main.tsx
    ├── mixins.ts
    ├── vite-env.d.ts
    ├── assets/
    │   └── booklab.svg
    ├── components/
    │   ├── BookCreate.tsx
    │   ├── BookEdit.tsx
    │   ├── BookForm.tsx
    │   ├── BookLabIcon.tsx
    │   ├── BookList.tsx
    │   ├── BookShow.tsx
    │   ├── DashboardHeader.tsx
    │   ├── DashboardLayout.tsx
    │   ├── DashboardSidebar.tsx
    │   ├── DashboardSidebarPageItem.tsx
    │   └── PageContainer.tsx
    ├── context/
    │   └── DashboardSidebarContext.ts
    ├── data/
    │   └── book.ts
    ├── hooks/
    │   ├── useDialogs/
    │   │   ├── DialogsContext.ts
    │   │   ├── DialogsProvider.tsx
    │   │   └── useDialogs.tsx
    │   └── useNotifications/
    │       ├── NotificationsContext.tsx
    │       ├── NotificationsProvider.tsx
    │       └── useNotifications.tsx
    └── schemas/
        └── theme/
            └── customizations/
                ├── button.tsx
                ├── dataGrid.ts
                ├── formInput.tsx
                ├── index.ts
                └── sidebar.tsx
                └── shared-theme/
                    ├── AppTheme.tsx
                    ├── ColorModeIconDropdown.tsx
                    ├── ColorModeSelect.tsx
                    ├── themePrimitives.ts
                    └── customizations/
                        ├── dataDisplay.tsx
                        ├── feedback.tsx
                        ├── inputs.tsx
                        ├── navigation.tsx
                        └── surfaces.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the JSON Server (Backend)**

   ```bash
   npm run api
   ```

   This starts the mock API server on `http://localhost:3000`

4. **Start the development server**

   ```bash
   npm run dev
   ```

   This starts the React application on `http://localhost:5173`

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run api` - Start JSON Server backend
- `npm run lint` - Run ESLint

## 🔧 Configuration

### API Configuration

The application uses a proxy configuration in `vite.config.ts` to forward API requests:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

## 📊 Data Model

### Book Interface

```typescript
interface Book {
	id: number; // Unique identifier
	title: string; // Book title
	author: string; // Author name
	genre: string; // Book genre
	publishedYear: number; // Publication year
	status: string; // Availability status
}
```

### Supported Genres

- Thriller, Memoir, Self-Help, Science Fiction
- Fantasy, Biography, Philosophy, History
- Dystopian, Classic, Romance, Post-Apocalyptic, Horror

### Status Options

- Available - Book is available for borrowing
- Issued - Book is currently borrowed

## 🎯 Key Features Implementation

### Form Validation

- **React Hook Form** for performant form handling
- **Built-in validation rules** for all fields
- **Real-time error display** with user-friendly messages
- **Required field validation** with visual indicators

### Search Implementation

- **Debounced search** to prevent excessive API calls
- **Client-side filtering** for instant results
- **Multi-field search** (title and author)
- **Case-insensitive matching**

### Responsive Design

- **Mobile-first approach** with progressive enhancement
- **Breakpoint-based layouts** using MUI's responsive system
- **Adaptive column visibility** in data grid
- **Touch-optimized interactions** for mobile devices

### Accessibility Features

- **Focus management** for modal dialogs
- **High contrast** support
- **Semantic HTML** structure

## 🔒 Security Considerations

- **Input validation** on both client and server side
- **XSS protection** through React's built-in escaping
- **CSRF protection** via same-origin policy
- **Content Security Policy** headers (production)

## 🚀 Performance Optimizations

- **React Query caching** for API responses
- **Debounced search** to reduce API calls
- **Lazy loading** for route components
- **Memoized components** to prevent unnecessary re-renders
- **Optimized bundle size** with Vite's tree shaking

## 📚 Books Data

```json
{
	"books": [
		{
			"title": "The Silent Patient",
			"author": "Alex Michaelides",
			"genre": "Thriller",
			"publishedYear": 2024,
			"status": "Available",
			"id": "9532"
		},
		{
			"title": "Educated",
			"author": "Tara Westover",
			"genre": "Memoir",
			"publishedYear": 2018,
			"status": "Issued",
			"id": "794b"
		},
		{
			"title": "Atomic Habits",
			"author": "James Clear",
			"genre": "Self-Help",
			"publishedYear": 2018,
			"status": "Available",
			"id": "4159"
		},
		{
			"title": "Project Hail Mary",
			"author": "Andy Weir",
			"genre": "Science Fiction",
			"publishedYear": 2021,
			"status": "Available",
			"id": "49e5"
		},
		{
			"title": "The Midnight Library",
			"author": "Matt Haig",
			"genre": "Fantasy",
			"publishedYear": 2023,
			"status": "Issued",
			"id": "be5c"
		},
		{
			"title": "Dune",
			"author": "Frank Herbert",
			"genre": "Science Fiction",
			"publishedYear": 1965,
			"status": "Available",
			"id": "0e81"
		},
		{
			"title": "Becoming",
			"author": "Michelle Obama",
			"genre": "Biography",
			"publishedYear": 2018,
			"status": "Available",
			"id": "0917"
		},
		{
			"title": "The Alchemist",
			"author": "Paulo Coelho",
			"genre": "Philosophy",
			"publishedYear": 1988,
			"status": "Issued",
			"id": "3e4a"
		},
		{
			"title": "Sapiens",
			"author": "Yuval Noah Harari",
			"genre": "History",
			"publishedYear": 2014,
			"status": "Available",
			"id": "934a"
		},
		{
			"title": "Harry Potter and the Sorcerer's Stone",
			"author": "J.K. Rowling",
			"genre": "Fantasy",
			"publishedYear": 1997,
			"status": "Available",
			"id": "2694"
		},
		{
			"title": "The Hobbit",
			"author": "J.R.R. Tolkien",
			"genre": "Fantasy",
			"publishedYear": 1937,
			"status": "Available",
			"id": "6d64"
		},
		{
			"title": "1984",
			"author": "George Orwell",
			"genre": "Dystopian",
			"publishedYear": 1949,
			"status": "Issued",
			"id": "74b3"
		},
		{
			"title": "To Kill a Mockingbird",
			"author": "Harper Lee",
			"genre": "Classic",
			"publishedYear": 1960,
			"status": "Available",
			"id": "5694"
		},
		{
			"title": "The Catcher in the Rye",
			"author": "J.D. Salinger",
			"genre": "Classic",
			"publishedYear": 1951,
			"status": "Available",
			"id": "cf28"
		},
		{
			"title": "Pride and Prejudice",
			"author": "Jane Austen",
			"genre": "Romance",
			"publishedYear": 1813,
			"status": "Issued",
			"id": "3106"
		},
		{
			"title": "The Great Gatsby",
			"author": "F. Scott Fitzgerald",
			"genre": "Classic",
			"publishedYear": 1925,
			"status": "Available",
			"id": "3b42"
		},
		{
			"title": "The Da Vinci Code",
			"author": "Dan Brown",
			"genre": "Thriller",
			"publishedYear": 2003,
			"status": "Available",
			"id": "43d0"
		},
		{
			"title": "Gone Girl",
			"author": "Gillian Flyn",
			"genre": "Thriller",
			"publishedYear": 2012,
			"status": "Available",
			"id": "342d"
		},
		{
			"title": "The Road",
			"author": "Cormac McCarthy",
			"genre": "Post-Apocalyptic",
			"publishedYear": 2006,
			"status": "Available",
			"id": "204c"
		},
		{
			"title": "The Shining",
			"author": "Stephen King",
			"genre": "Horror",
			"publishedYear": 1978,
			"status": "Available",
			"id": "08f2"
		},
		{
			"id": "d8b1",
			"title": "test29",
			"author": "test2",
			"genre": "test2",
			"publishedYear": 2025,
			"status": "Available"
		},
		{
			"id": "94eb",
			"title": "fguf",
			"author": "srgsdgs",
			"genre": "Science Fiction",
			"publishedYear": 2025,
			"status": "Available"
		}
	]
}
```

**Built with ❤️ using React, TypeScript, and Material-UI**
