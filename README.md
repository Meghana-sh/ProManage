
# ProManage 🚀

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). This Trello-inspired project tracker allows teams to manage projects with boards, lists, and draggable cards.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Board Management**: Create, view, update, and delete project boards
- **List Organization**: Add multiple lists to boards (e.g., To Do, In Progress, Done)
- **Card System**: Create task cards within lists with titles and descriptions
- **Drag-and-Drop**: Intuitive drag-and-drop functionality to move cards between lists
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **React Router** - Client-side routing
- **React Beautiful DnD** - Drag-and-drop functionality
- **Axios** - HTTP client for API requests
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt.js** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (running locally or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Clone
```

### 2. Setup Backend

#### Install backend dependencies:
```bash
npm install
```

#### Create environment file:
Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/spark-tracker
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

**Important**: 
- If using MongoDB locally, make sure MongoDB is running
- For MongoDB Atlas, replace `MONGODB_URI` with your connection string
- Change `JWT_SECRET` to a secure random string

### 3. Setup Frontend

#### Navigate to client directory and install dependencies:
```bash
cd client
npm install
```

### 4. Run the Application

#### Option 1: Run Both (Backend + Frontend) Concurrently

From the root directory:
```bash
npm run dev:full
```

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
