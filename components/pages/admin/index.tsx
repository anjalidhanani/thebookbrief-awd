import { useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { GlobalState } from '../../../store/reducers';
import { UserInfo } from '../../../api/users';
import { clearAllCookie } from '../../../utils/auth';
import { initMain } from '../../../store/main/actions';
import { useDispatch } from 'react-redux';
import BooksManagement from './BooksManagement';
import UsersManagement from './UsersManagement';
import CategoriesManagement from './CategoriesManagement';

interface AdminDashboardProps {
  userInfo: UserInfo;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState('books');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    clearAllCookie();
    dispatch(initMain());
    router.push('/admin-login');
  };

  const tabs = [
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'categories', label: 'Categories', icon: '📂' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {userInfo?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'books' && <BooksManagement />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'categories' && <CategoriesManagement />}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo,
  };
};

export default connect(mapStateToProps)(AdminDashboard);
