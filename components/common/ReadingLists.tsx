import React, { useState, useEffect } from 'react';
import { getUserReadingLists, createReadingList, addBookToList, removeBookFromList, ReadingListInfo } from '../../api/readingLists';

interface ReadingListsProps {
  userId: string;
  bookId?: string; // If provided, shows "Add to List" functionality
}

const ReadingLists: React.FC<ReadingListsProps> = ({ userId, bookId }) => {
  const [lists, setLists] = useState<ReadingListInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    isPublic: false
  });

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

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const listData = {
        id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...newList,
        bookIds: bookId ? [bookId] : []
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

  const handleAddToList = async (listId: string) => {
    if (!bookId) return;
    try {
      await addBookToList(listId, bookId);
      fetchUserLists(); // Refresh to show updated lists
    } catch (error) {
      console.error('Error adding book to list:', error);
    }
  };

  const handleRemoveFromList = async (listId: string) => {
    if (!bookId) return;
    try {
      await removeBookFromList(listId, bookId);
      fetchUserLists(); // Refresh to show updated lists
    } catch (error) {
      console.error('Error removing book from list:', error);
    }
  };

  const isBookInList = (list: ReadingListInfo) => {
    return bookId && list.bookIds.includes(bookId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {bookId ? 'Add to Reading List' : 'My Reading Lists'}
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create New List'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateList} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              List Name *
            </label>
            <input
              type="text"
              value={newList.name}
              onChange={(e) => setNewList({ ...newList, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Make this list public</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Create List
          </button>
        </form>
      )}

      <div className="space-y-3">
        {lists.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reading lists yet. Create your first list to organize your books!
          </p>
        ) : (
          lists.map((list) => (
            <div key={list.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{list.name}</h4>
                {list.description && (
                  <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{list.bookIds.length} books</span>
                  {list.isPublic && <span className="text-blue-600">Public</span>}
                </div>
              </div>
              
              {bookId && (
                <div className="ml-4">
                  {isBookInList(list) ? (
                    <button
                      onClick={() => handleRemoveFromList(list.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToList(list.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReadingLists;
