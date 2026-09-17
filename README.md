"#multi-task-mern" 

# Multi Task Management System – MERN

A **MERN Stack Task Management System** with JWT authentication and role-based access for **Admin, Manager, and User**.

## 🚀 Features

* JWT Authentication
* Role-based access control
* Create, edit and delete tasks
* Assign tasks to users
* Task status: Pending, In Progress, Completed
* Priority: Low, Medium, High
* Search, filter and pagination
* Due date management

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, Axios
**Backend:** Node.js, Express.js, JWT
**Database:** MongoDB, Mongoose
**Deployment:** Vercel + Render

## ⚙️ Setup

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Run:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

## 📡 API Documentation

### Authentication

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | `/api/users/register` | Register user |
| POST   | `/api/users/login`    | Login user    |

### Tasks

| Method | Endpoint         | Description |
| ------ | ---------------- | ----------- |
| GET    | `/api/tasks`     | Get tasks   |
| POST   | `/api/tasks`     | Create task |
| GET    | `/api/tasks/:id` | Get task    |
| PUT    | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Task Filters

```text
GET /api/tasks?search=website
GET /api/tasks?status=pending
GET /api/tasks?priority=high
GET /api/tasks?page=1&limit=10
```

Protected APIs require:

```http
Authorization: Bearer <JWT_TOKEN>
```

## 👨‍💻 Author

**Joel Mathew Eby**

GitHub: https://github.com/JOELMATHEWEBY2000
