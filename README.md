# SmartScribe: AI-Powered Blog Platform

## Project Overview

SmartScribe is a full-stack blogging platform designed to streamline content creation and enhance user engagement through the integration of AI capabilities. It features a user-friendly interface for readers and a robust administrative panel for content management. The platform leverages modern web technologies to deliver a responsive and efficient experience.

## Key Features

*   **AI-Powered Content Generation**: Utilize the integrated Google Gemini API to automatically generate blog post descriptions based on titles, significantly accelerating content creation.
*   **Interactive AI Chat Assistant**: Engage readers with an AI chatbot on each blog post, allowing them to ask questions and get instant answers directly from the blog content.
*   **Comprehensive Admin Dashboard**: Securely manage blog posts (add, list, delete, publish/unpublish) and moderate comments through a dedicated administrative panel with JWT authentication.
*   **Optimized Image Management**: Efficiently handle blog post thumbnails using ImageKit, with automatic image optimization (quality adjustment, WebP conversion, resizing) for faster page load times.
*   **Rich Text Editor**: Create and edit blog content using a Quill-based rich text editor, supporting various formatting options.
*   **Dynamic Content Filtering**: Users can filter blog posts by category and search for specific content, improving content discoverability.
*   **Responsive Design**: A modern and responsive user interface built with React.js and Tailwind CSS ensures a seamless experience across all devices.
*   **Comment Management**: Readers can add comments to blog posts, which can be approved or deleted by administrators.

## Technologies Used

**Frontend:**
*   **React.js**: A JavaScript library for building user interfaces.
*   **Vite**: A fast build tool for modern web projects.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Axios**: Promise-based HTTP client for making API requests.
*   **React Router DOM**: For declarative routing in React applications.
*   **Quill**: A powerful rich text editor.
*   **Moment.js**: For parsing, validating, manipulating, and formatting dates.
*   **React Hot Toast**: For displaying notifications.
*   **Motion**: A production-ready animation library for React.

**Backend:**
*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB**: A NoSQL database for storing blog posts and comments.
*   **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **Google Gemini API**: For AI content generation and chat functionalities.
*   **ImageKit**: For image storage, optimization, and delivery.
*   **JSON Web Token (JWT)**: For secure authentication.
*   **Multer**: A Node.js middleware for handling `multipart/form-data`, primarily used for uploading files.
*   **Dotenv**: For loading environment variables from a `.env` file.
*   **CORS**: Node.js middleware for enabling Cross-Origin Resource Sharing.

## Setup Instructions

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   MongoDB (local instance or cloud-hosted like MongoDB Atlas)
*   Google Cloud Project with Gemini API enabled and an API Key
*   ImageKit.io account with Public Key, Private Key, and URL Endpoint

### 1. Clone the Repository

```bash
git clone <repository_url>
cd BlogApp
```

### 2. Backend Setup

Navigate to the `server` directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server` directory and add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword
GEMINI_API_KEY=your_google_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

*   Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., `mongodb://localhost:27017/SmartScribe` or your MongoDB Atlas URI).
*   Replace `your_jwt_secret_key` with a strong, random string.
*   Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` for your admin login.
*   Replace `your_google_gemini_api_key` with your actual Gemini API Key.
*   Replace ImageKit keys and URL endpoint with your actual ImageKit credentials.

Start the backend server:

```bash
npm run server
```
The server will run on the port specified in your `.env` file (default: 5000).

### 3. Frontend Setup

Open a new terminal, navigate to the `client` directory:

```bash
cd ../client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `client` directory and add the following environment variable:

```env
VITE_BASE_URL=http://localhost:5000
```

*   Ensure `VITE_BASE_URL` matches the port your backend server is running on.

Start the frontend development server:

```bash
npm run dev
```

The frontend application will typically open in your browser at `http://localhost:5173` (or another available port).

## Usage

### Public Access
*   Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
*   Browse blog posts, filter by category, and use the search functionality.
*   Click on a blog post to read the full content and interact with the AI chat assistant.
*   Add comments to blog posts.

### Admin Panel
*   Navigate to the admin login page (e.g., `http://localhost:5173/admin`).
*   Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in the backend `.env` file to log in.
*   From the dashboard, you can:
    *   Add new blog posts (with AI content generation).
    *   View and manage all blog posts (publish/unpublish, delete).
    *   Review and approve/delete user comments.

## Admin Credentials (for testing)

*   **Email**: `admin@example.com` (or whatever you set in `ADMIN_EMAIL`)
*   **Password**: `adminpassword` (or whatever you set in `ADMIN_PASSWORD`)

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License.
