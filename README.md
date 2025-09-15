# 📚 TheBookBrief - Frontend

A modern, responsive web application for reading and discovering books. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **📖 Book Reading**: Read books chapter by chapter with a clean, distraction-free interface
- **🔍 Search & Discovery**: Search books by title, author, or category
- **📂 Categories**: Browse books by different categories
- **👤 User Authentication**: Secure login/signup with JWT authentication
- **💖 Favorites**: Like and save favorite books
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations
- **⚡ Fast Performance**: Server-side rendering and optimized loading

## 🛠️ Tech Stack

- **Framework**: [Next.js 13](https://nextjs.org/) - React framework with SSR
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) - Predictable state container
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise-based HTTP client
- **UI Components**: [Headless UI](https://headlessui.com/) - Unstyled, accessible components
- **Icons**: [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) - Smoking hot notifications
- **Carousel**: [Swiper](https://swiperjs.com/) - Modern touch slider

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thebookbrief-webapp-main
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
   NEXT_PUBLIC_API_URL=http://localhost:4000
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

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
thebookbrief-webapp-main/
├── api/                    # API service functions
│   ├── books.ts           # Book-related API calls
│   ├── categories.ts      # Category API calls
│   └── users.ts           # User authentication APIs
├── components/            # React components
│   ├── common/           # Reusable components
│   │   ├── layout/       # Layout components
│   │   ├── BookInfo.tsx  # Book display component
│   │   ├── BookSlider.tsx # Book carousel
│   │   └── ...
│   ├── icons/            # Custom icon components
│   └── pages/            # Page-specific components
│       ├── bookread/     # Book reading interface
│       ├── categories/   # Category pages
│       ├── home/         # Homepage
│       ├── login/        # Authentication
│       └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── pages/                # Next.js pages (routing)
├── public/               # Static assets
│   ├── fonts/           # Custom fonts (Satoshi)
│   └── images/          # Images and icons
├── store/                # Redux store configuration
├── styles/               # Global styles
├── utils/                # Utility functions
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

The frontend communicates with the backend API for:

- **Authentication**: Login, signup, password reset
- **Books**: Fetching book data, chapters, categories
- **User Data**: Profile management, preferences
- **Search**: Book and author search functionality

### API Configuration

Base URL is configured via `NEXT_PUBLIC_API_URL` environment variable.

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

## 📦 Dependencies

### Core Dependencies
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `@reduxjs/toolkit` - State management
- `axios` - HTTP requests

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
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_ENV=production
```

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