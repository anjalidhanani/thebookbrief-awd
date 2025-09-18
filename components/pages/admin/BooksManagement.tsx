import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import authRequest from '../../../utils/authRequest';

interface Book {
  _id: string;
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  imageUrl?: string;
  aboutTheBook?: string;
  author?: string;
  category?: string;
  rating?: number;
  chapterCount?: number;
  language?: string;
  readingTime?: number;
  totalReads: number;
  isPublished: boolean;
  isFree: boolean;
  isDaily?: boolean;
  publishedDate?: string;
  isArchived: boolean;
  createdAt: string;
}

interface BookFormData {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  author: string;
  category: string;
  aboutTheBook: string;
  imageUrl: string;
  language: string;
  readingTime: number;
  rating: number;
  chapterCount: number;
  isPublished: boolean;
  isFree: boolean;
  isDaily: boolean;
  isArchived: boolean;
  publishedDate: string;
}

const BooksManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [formData, setFormData] = useState<BookFormData>({
    id: '',
    title: '',
    slug: '',
    subtitle: '',
    author: '',
    category: '',
    aboutTheBook: '',
    imageUrl: '',
    language: 'English',
    readingTime: 0,
    rating: 0,
    chapterCount: 0,
    isPublished: false,
    isFree: true,
    isDaily: false,
    isArchived: false,
    publishedDate: '',
  });

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await authRequest({
        url: '/api/admin/books',
        method: 'GET',
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
      });
      setBooks(response.data.books);
      setTotalPages(response.data.pagination.pages);
    } catch (error: any) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await authRequest({
          url: `/api/admin/books?bookId=${editingBook.id}`,
          method: 'PUT',
          data: formData,
        });
        toast.success('Book updated successfully');
      } else {
        await authRequest({
          url: '/api/admin/books',
          method: 'POST',
          data: formData,
        });
        toast.success('Book created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (bookId: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await authRequest({
          url: `/api/admin/books?bookId=${bookId}`,
          method: 'DELETE',
        });
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error: any) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      id: book.id,
      title: book.title,
      slug: book.slug || '',
      subtitle: book.subtitle || '',
      author: book.author || '',
      category: book.category || '',
      aboutTheBook: book.aboutTheBook || '',
      imageUrl: book.imageUrl || '',
      language: book.language || 'English',
      readingTime: book.readingTime || 0,
      rating: book.rating || 0,
      chapterCount: book.chapterCount || 0,
      isPublished: book.isPublished,
      isFree: book.isFree,
      isDaily: book.isDaily || false,
      isArchived: book.isArchived || false,
      publishedDate: book.publishedDate ? book.publishedDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      slug: '',
      subtitle: '',
      author: '',
      category: '',
      aboutTheBook: '',
      imageUrl: '',
      language: 'English',
      readingTime: 0,
      rating: 0,
      chapterCount: 0,
      isPublished: false,
      isFree: true,
      isDaily: false,
      isArchived: false,
      publishedDate: '',
    });
    setEditingBook(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectBook = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(books.map(book => book.id));
    }
  };

  const handleBulkPublish = async () => {
    if (selectedBooks.length === 0) return;
    
    try {
      await Promise.all(selectedBooks.map(bookId => 
        authRequest({
          url: `/api/admin/books?bookId=${bookId}`,
          method: 'PUT',
          data: { isPublished: true },
        })
      ));
      toast.success(`${selectedBooks.length} books published successfully`);
      setSelectedBooks([]);
      fetchBooks();
    } catch (error: any) {
      toast.error('Failed to publish books');
    }
  };

  const handleBulkUnpublish = async () => {
    if (selectedBooks.length === 0) return;
    
    try {
      await Promise.all(selectedBooks.map(bookId => 
        authRequest({
          url: `/api/admin/books?bookId=${bookId}`,
          method: 'PUT',
          data: { isPublished: false },
        })
      ));
      toast.success(`${selectedBooks.length} books unpublished successfully`);
      setSelectedBooks([]);
      fetchBooks();
    } catch (error: any) {
      toast.error('Failed to unpublish books');
    }
  };

  const handleBulkArchive = async () => {
    if (selectedBooks.length === 0) return;
    
    try {
      await Promise.all(selectedBooks.map(bookId => 
        authRequest({
          url: `/api/admin/books?bookId=${bookId}`,
          method: 'PUT',
          data: { isArchived: true },
        })
      ));
      toast.success(`${selectedBooks.length} books archived successfully`);
      setSelectedBooks([]);
      fetchBooks();
    } catch (error: any) {
      toast.error('Failed to archive books');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedBooks.length} books?`)) {
      try {
        await Promise.all(selectedBooks.map(bookId => 
          authRequest({
            url: `/api/admin/books?bookId=${bookId}`,
            method: 'DELETE',
          })
        ));
        toast.success(`${selectedBooks.length} books deleted successfully`);
        setSelectedBooks([]);
        fetchBooks();
      } catch (error: any) {
        toast.error('Failed to delete books');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Books Management</h2>
          {selectedBooks.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {selectedBooks.length} book{selectedBooks.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {selectedBooks.length > 0 && (
            <>
              <button
                onClick={handleBulkPublish}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Publish Selected
              </button>
              <button
                onClick={handleBulkUnpublish}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Unpublish Selected
              </button>
              <button
                onClick={handleBulkArchive}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Archive Selected
              </button>
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Delete Selected
              </button>
            </>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add New Book
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>

      {/* Books Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedBooks.length === books.length && books.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id} className={selectedBooks.includes(book.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => handleSelectBook(book.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        {book.subtitle && (
                          <div className="text-sm text-gray-500">{book.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.author || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        {book.rating?.toFixed(1) || '0.0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          book.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {book.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          book.isFree 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {book.isFree ? 'Free' : 'Premium'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.totalReads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-sky-600 hover:text-sky-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg disabled:opacity-50 hover:bg-sky-600 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg disabled:opacity-50 hover:bg-sky-600 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book ID *
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      disabled={!!editingBook}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="unique-book-id"
                      required
                    />
                    {editingBook && (
                      <p className="text-xs text-gray-500 mt-1">Book ID cannot be changed after creation</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter book title"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Content Details</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="URL-friendly version of title"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About the Book
                  </label>
                  <textarea
                    name="aboutTheBook"
                    value={formData.aboutTheBook}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Brief description of the book..."
                  />
                </div>
              </div>

              {/* Media & Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Media & Metadata</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reading Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="readingTime"
                      value={formData.readingTime}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chapter Count
                    </label>
                    <input
                      type="number"
                      name="chapterCount"
                      value={formData.chapterCount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Published Date
                    </label>
                    <input
                      type="date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Status & Settings</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFree"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Free</span>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDaily"
                        checked={formData.isDaily}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Daily Read</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isArchived"
                        checked={formData.isArchived}
                        onChange={handleInputChange}
                        className="mr-3 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Archived</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium transition-colors"
                >
                  {editingBook ? 'Update Book' : 'Create Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksManagement;
