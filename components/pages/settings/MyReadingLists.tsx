import React, { useState, useEffect } from 'react';
import { getUserReadingLists, deleteReadingList, ReadingListInfo } from '../../../api/readingLists';
import { getBookById } from '../../../api/books';
import ReadingLists from '../../common/ReadingLists';

interface MyReadingListsProps {
  userId: string;
}

const MyReadingLists: React.FC<MyReadingListsProps> = ({ userId }) => {
  const [lists, setLists] = useState<ReadingListInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedList, setExpandedList] = useState<string | null>(null);
  const [bookDetails, setBookDetails] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetchUserLists();
  }, [userId]);

  const fetchUserLists = async () => {
    try {
      setLoading(true);
      const response = await getUserReadingLists(userId);
      if (response.success) {
        setLists(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching reading lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async (bookIds: string[]) => {
    const newBookDetails: { [key: string]: any } = {};
    
    for (const bookId of bookIds) {
      if (!bookDetails[bookId]) {
        try {
          const response = await getBookById(bookId);
          if (response.success) {
            newBookDetails[bookId] = response.data;
          }
        } catch (error) {
          console.error(`Error fetching book ${bookId}:`, error);
        }
      }
    }
    
    setBookDetails(prev => ({ ...prev, ...newBookDetails }));
  };

  const handleExpandList = (listId: string, bookIds: string[]) => {
    if (expandedList === listId) {
      setExpandedList(null);
    } else {
      setExpandedList(listId);
      fetchBookDetails(bookIds);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (window.confirm('Are you sure you want to delete this reading list?')) {
      try {
        await deleteReadingList(listId);
        fetchUserLists(); // Refresh lists
      } catch (error) {
        console.error('Error deleting reading list:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New List Component */}
      <ReadingLists userId={userId} />

      {/* Existing Lists with Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          My Reading Lists ({lists.length})
        </h3>

        {lists.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reading lists yet. Create your first list above!
          </p>
        ) : (
          <div className="space-y-4">
            {lists.map((list) => (
              <div key={list.id} className="border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{list.name}</h4>
                      {list.description && (
                        <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{list.bookIds.length} books</span>
                        {list.isPublic && <span className="text-blue-600">Public</span>}
                        <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExpandList(list.id, list.bookIds)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        {expandedList === list.id ? 'Hide Books' : 'View Books'}
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Book List */}
                {expandedList === list.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {list.bookIds.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No books in this list yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {list.bookIds.map((bookId) => {
                          const book = bookDetails[bookId];
                          return (
                            <div key={bookId} className="flex items-center space-x-3 p-3 bg-white rounded border">
                              {book ? (
                                <>
                                  <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="w-12 h-16 object-cover rounded"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 truncate">{book.title}</h5>
                                    <p className="text-sm text-gray-600 truncate">{book.author}</p>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-16 bg-gray-200 rounded animate-pulse"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReadingLists;
