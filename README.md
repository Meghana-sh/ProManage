
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

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
Clone/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React Context for state
│       ├── pages/          # Page components
│       ├── utils/          # Helper functions (API client)
│       ├── App.js
│       └── index.js
├── config/                 # Backend configuration
│   └── db.js              # MongoDB connection
├── middleware/            # Express middleware
│   └── auth.js           # JWT authentication
├── models/               # Mongoose models
│   ├── User.js
│   ├── Board.js
│   ├── List.js
│   └── Card.js
├── routes/               # API routes
│   ├── auth.js
│   ├── boards.js
│   ├── lists.js
│   └── cards.js
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── server.js             # Express server entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Boards
- `GET /api/boards` - Get all boards for user (protected)
- `GET /api/boards/:id` - Get single board with lists and cards (protected)
- `POST /api/boards` - Create new board (protected)
- `PUT /api/boards/:id` - Update board (protected)
- `DELETE /api/boards/:id` - Delete board (protected)

### Lists
- `POST /api/lists` - Create new list (protected)
- `PUT /api/lists/:id` - Update list (protected)
- `DELETE /api/lists/:id` - Delete list (protected)

### Cards
- `POST /api/cards` - Create new card (protected)
- `PUT /api/cards/:id` - Update card (protected)
- `PUT /api/cards/:id/move` - Move card (drag-and-drop) (protected)
- `DELETE /api/cards/:id` - Delete card (protected)

## 🎯 Usage Guide

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Board**: Click "Create New Board" from the dashboard
3. **Add Lists**: Within a board, click "Add List" to create columns
4. **Add Cards**: Click "+ Add Card" within any list to create tasks
5. **Drag Cards**: Click and drag cards between lists to update status
6. **Edit/Delete**: Use the × button to delete lists or cards

## 🧪 Testing with Postman

Import the API endpoints into Postman and test with the following workflow:

1. Register a user at `POST /api/auth/register`
2. Copy the returned JWT token
3. Add token to Authorization header: `Bearer <your-token>`
4. Test protected endpoints

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes and API endpoints
- Input validation with express-validator
- CORS enabled for frontend-backend communication

## 🚧 Future Enhancements

- [ ] Add board members/collaboration
- [ ] Card comments and attachments
- [ ] Due dates for cards
- [ ] Labels and tags
- [ ] Search functionality
- [ ] Activity log
- [ ] Email notifications
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

SPARK Team

## 🙏 Acknowledgments

- Inspired by Trello
- Built as a learning project for full-stack development
- Thanks to the MERN stack community

---

**Happy Project Tracking! 🎉**
