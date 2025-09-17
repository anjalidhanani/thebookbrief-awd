import React, { useState } from 'react';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import ReadingListSidebar from './ReadingListSidebar';

interface AddToListButtonProps {
  bookId: string;
  userId: string;
  bookTitle?: string;
  className?: string;
}

const AddToListButton: React.FC<AddToListButtonProps> = ({ 
  bookId, 
  userId, 
  bookTitle,
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleOpenSidebar}
        className={`group flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
        title="Add to Reading List"
      >
        <BookmarkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Add to List</span>
      </button>

      {/* Sidebar */}
      <ReadingListSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        bookId={bookId}
        userId={userId}
        bookTitle={bookTitle}
      />
    </>
  );
};

export default AddToListButton;
