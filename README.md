# 📚 TheBookBrief - Full Stack Application

A modern, responsive full-stack web application for reading and discovering books. Built with Next.js, TypeScript, and Tailwind CSS with integrated backend API.

## 🔄 Backend Integration

This application now includes a fully integrated backend that was merged from a separate Express.js backend. The backend functionality is now served through Next.js API routes, making this a complete full-stack application.

## ✨ Features

- **📖 Book Reading**: Read books chapter by chapter with a clean, distraction-free interface
- **🔍 Search & Discovery**: Search books by title, author, or category
- **📂 Categories**: Browse books by different categories
- **⭐ Book Reviews**: Rate and review books with public/private visibility options
- **📋 Reading Lists**: Create and manage personal reading lists with book organization
- **👤 User Authentication**: Secure login/signup with JWT authentication
- **💖 Favorites**: Like and save favorite books
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations
- **⚡ Fast Performance**: Server-side rendering and optimized loading

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 13](https://nextjs.org/) - React framework with SSR
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) - Predictable state container
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise-based HTTP client
- **UI Components**: [Headless UI](https://headlessui.com/) - Unstyled, accessible components
- **Icons**: [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) - Smoking hot notifications
- **Carousel**: [Swiper](https://swiperjs.com/) - Modern touch slider

### Backend
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database with Mongoose ODM
- **Authentication**: [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt) - Secure password hashing
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Security**: [Helmet](https://helmetjs.github.io/) - Security headers and CORS protection
- **Logging**: [Morgan](https://www.npmjs.com/package/morgan) - HTTP request logger

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anjalidhanani/thebookbrief-awd.git
   cd thebookbrief-awd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/bookbrief
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   # Application Environment
   NODE_ENV=development
   NEXT_PUBLIC_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

> **Note**: The application now runs as a single full-stack Next.js app. The backend API is served through Next.js API routes, eliminating the need for a separate backend server.

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
thebookbrief-awd/
├── api/                    # Frontend API service functions
│   ├── books.ts           # Book-related API calls
│   ├── categories.ts      # Category API calls
│   ├── readingLists.ts    # Reading list API calls
│   ├── reviews.ts         # Book review API calls
│   └── users.ts           # User authentication APIs
├── components/            # React components
│   ├── common/           # Reusable components
│   │   ├── layout/       # Layout components
│   │   ├── BookInfo.tsx  # Book display component
│   │   ├── BookReviews.tsx # Book review component
│   │   ├── BookSlider.tsx # Book carousel
│   │   ├── ReadingLists.tsx # Reading list management
│   │   └── ...
│   ├── icons/            # Custom icon components
│   └── pages/            # Page-specific components
│       ├── bookread/     # Book reading interface
│       ├── categories/   # Category pages
│       ├── home/         # Homepage
│       ├── login/        # Authentication
│       └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Backend utilities and models
│   ├── middleware/       # API middleware
│   │   ├── apiAuth.ts   # Authentication middleware
│   │   └── auth.ts      # Auth utilities
│   ├── models/          # Mongoose models
│   │   ├── User.ts      # User model
│   │   ├── Book.ts      # Book model
│   │   ├── Category.ts  # Category model
│   │   ├── BookReview.ts # Review model
│   │   └── ReadingList.ts # Reading list model
│   └── utils/           # Backend utilities
│       ├── database.ts  # MongoDB connection
│       └── jwt.ts       # JWT utilities
├── pages/                # Next.js pages and API routes
│   ├── api/             # Backend API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── books/       # Book endpoints
│   │   ├── categories/  # Category endpoints
│   │   ├── reviews/     # Review endpoints
│   │   ├── reading-lists/ # Reading list endpoints
│   │   └── search/      # Search endpoints
│   ├── book/            # Book pages
│   ├── categories/      # Category pages
│   └── ...              # Other pages
├── public/               # Static assets
│   ├── fonts/           # Custom fonts (Satoshi)
│   └── images/          # Images and icons
├── store/                # Redux store configuration
├── styles/               # Global styles
├── utils/                # Frontend utility functions
└── ...config files
```

## 🎨 Styling & Design

### Color Palette
- **Primary**: Sky blue (`sky-500`, `sky-600`)
- **Text**: Dark gray (`#2d3748`), Medium gray (`#4a5568`), Light gray (`#718096`)
- **Background**: White with subtle gradients

### Typography
- **Font Family**: Satoshi (custom font)
- **Responsive**: Scales appropriately across devices

### Responsive Breakpoints
- **Mobile**: `max-width: 599px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `min-width: 1025px`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Integration

The application includes a fully integrated backend with the following API endpoints:

- **Authentication**: `/api/auth/*` - Login, signup, password reset, profile management
- **Books**: `/api/books/*` - Fetching book data, chapters, categories, daily reads
- **Reviews**: `/api/reviews/*` - Creating, reading, updating, and deleting book reviews
- **Reading Lists**: `/api/reading-lists/*` - Managing personal and public reading lists
- **Categories**: `/api/categories/*` - Category management and book filtering
- **Search**: `/api/search/` - Book and author search functionality

### API Architecture

- **Internal API**: All backend functionality is now served through Next.js API routes
- **Database**: MongoDB with Mongoose ODM for data persistence
- **Authentication**: JWT-based authentication with secure token handling
- **Validation**: Zod schemas for request/response validation
- **Security**: Helmet middleware for security headers and CORS protection

## 📱 Key Pages

- **`/`** - Homepage with featured books
- **`/login`** - User authentication
- **`/signup`** - User registration
- **`/categories`** - Browse book categories
- **`/categories/[categoryName]`** - Books by category
- **`/book/[bookId]/[chapter]`** - Book reading interface
- **`/explore`** - Discover new books
- **`/settings`** - User account settings

## 🔒 Authentication

- JWT-based authentication
- Secure token storage
- Protected routes for authenticated users
- Password reset functionality

## ⭐ Book Reviews

- **Star Rating System**: 1-5 star ratings for books
- **Review Comments**: Optional text reviews with user feedback
- **Public/Private Reviews**: Control visibility of reviews
- **Review Management**: Create, update, and delete reviews
- **Review Display**: View all reviews for a book with ratings

## 📋 Reading Lists

- **Personal Lists**: Create custom reading lists for organization
- **List Management**: Add/remove books from lists
- **Public Sharing**: Option to make lists public for discovery
- **List Categories**: Organize books by themes, genres, or reading status
- **Quick Actions**: Easy add-to-list functionality from book pages

## 📦 Dependencies

### Frontend Dependencies
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `@reduxjs/toolkit` - State management
- `axios` - HTTP requests

### Backend Dependencies
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `zod` - Schema validation
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logging

### UI & UX
- `@headlessui/react` - Accessible components
- `@heroicons/react` - Icons
- `react-hot-toast` - Notifications
- `swiper` - Carousels
- `html-entities` - HTML entity decoding

## 🚀 Deployment

The application can be deployed on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** containers

### Environment Variables for Production

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookbrief

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application Environment
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

## 🔄 Backend Migration Notes

This application was originally a frontend-only Next.js app that communicated with a separate Express.js backend. The backend has been successfully merged into this Next.js application as API routes.

### What Was Migrated

1. **Models**: All Mongoose models moved to `lib/models/`
2. **API Routes**: Express routes converted to Next.js API routes in `pages/api/`
3. **Utilities**: Database connection, JWT utilities, and middleware moved to `lib/`
4. **Dependencies**: All backend dependencies added to `package.json`
5. **Client Updates**: Frontend API clients updated to use internal routes

### Benefits of the Merge

- **Simplified Deployment**: Single application instead of separate frontend/backend
- **Better Performance**: Internal API calls eliminate network latency
- **Easier Development**: Single codebase for full-stack development
- **Reduced Complexity**: No need to manage separate servers and deployments

> **Note**: The separate `thebookbrief-backend` directory can now be safely removed as all functionality has been integrated.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript