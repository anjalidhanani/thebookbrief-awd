import React, { useState, useEffect } from 'react';
import { XMarkIcon, BookmarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getUserReadingLists, createReadingList, addBookToList, removeBookFromList, ReadingListInfo } from '../../api/readingLists';

interface ReadingListSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  userId: string;
  bookTitle?: string;
}

const ReadingListSidebar: React.FC<ReadingListSidebarProps> = ({ 
  isOpen, 
  onClose, 
  bookId, 
  userId, 
  bookTitle 
}) => {
  const [lists, setLists] = useState<ReadingListInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserLists();
    }
  }, [isOpen, userId]);

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

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const listData = {
        id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...newList,
        bookIds: [bookId] // Add current book to new list
      };

      const response = await createReadingList(listData);
      if (response.success) {
        setShowCreateForm(false);
        setNewList({ name: '', description: '', isPublic: false });
        fetchUserLists(); // Refresh lists
      }
    } catch (error) {
      console.error('Error creating reading list:', error);
    }
  };

  const handleToggleBook = async (listId: string, isInList: boolean) => {
    try {
      if (isInList) {
        await removeBookFromList(listId, bookId);
      } else {
        await addBookToList(listId, bookId);
      }
      fetchUserLists(); // Refresh to show updated lists
    } catch (error) {
      console.error('Error toggling book in list:', error);
    }
  };

  const isBookInList = (list: ReadingListInfo) => {
    return list.bookIds.includes(bookId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <BookmarkIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Add to Reading List</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Book Info */}
          {bookTitle && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">Adding to list:</p>
              <p className="font-medium text-gray-900 truncate">{bookTitle}</p>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Create New List Button */}
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors mb-6"
            >
              <PlusIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 font-medium">Create New List</span>
            </button>

            {/* Create Form */}
            {showCreateForm && (
              <form onSubmit={handleCreateList} className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    List Name *
                  </label>
                  <input
                    type="text"
                    value={newList.name}
                    onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Want to Read, Favorites"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newList.description}
                    onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Describe your reading list..."
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newList.isPublic}
                      onChange={(e) => setNewList({ ...newList, isPublic: e.target.checked })}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Make this list public</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create & Add Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Existing Lists */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Reading Lists</h3>
              
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : lists.length === 0 ? (
                <div className="text-center py-8">
                  <BookmarkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No reading lists yet</p>
                  <p className="text-sm text-gray-400">Create your first list above!</p>
                </div>
              ) : (
                lists.map((list) => {
                  const isInList = isBookInList(list);
                  return (
                    <div 
                      key={list.id} 
                      className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                        isInList 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleToggleBook(list.id, isInList)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{list.name}</h4>
                          {list.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{list.description}</p>
                          )}
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                            <span>{list.bookIds.length} books</span>
                            {list.isPublic && <span className="text-blue-600">Public</span>}
                          </div>
                        </div>
                        
                        <div className="ml-3 flex-shrink-0">
                          {isInList ? (
                            <div className="flex items-center space-x-1 text-blue-600">
                              <BookmarkIcon className="w-5 h-5 fill-current" />
                              <span className="text-sm font-medium">Added</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <BookmarkIcon className="w-5 h-5" />
                              <span className="text-sm">Add</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Click on a list to add or remove this book
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadingListSidebar;
