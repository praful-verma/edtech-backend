# 📚 EdTech Learning Platform – Backend System

A scalable backend system for an **EdTech Learning Platform** designed to manage users, courses, and learning content efficiently. The system provides secure authentication, role-based authorization, and RESTful APIs to support a modern online learning environment.

---

## 🚀 Features

* User registration and login system
* JWT-based authentication for secure access
* Role-based authorization for **students and instructors**
* Course creation and management
* Learning content management
* Secure RESTful API architecture
* Middleware-based request validation
* Scalable backend structure

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Database Tool:** MongoDB Compass
* **Authentication:** JSON Web Tokens (JWT)
* **API Architecture:** REST APIs
* **Version Control:** Git, GitHub

---

## 📂 Project Structure

```
edtech-backend
│
├── controllers/        # Application logic
├── models/             # Database schemas
├── routes/             # API routes
├── middleware/         # Authentication and validation middleware
├── config/             # Database configuration
├── utils/              # Utility functions
├── server.js           # Entry point of the application
└── package.json
```

---

## ⚙️ Installation and Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/praful-verma/edtech-backend.git
```

### 2️⃣ Navigate to the project directory

```bash
cd edtech-backend
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Configure Environment Variables

Create a `.env` file and add the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5️⃣ Run the server

```bash
npm start
```

The server will start on:

```
http://localhost:5000
```

---

## 🔐 Authentication System

The platform uses **JWT (JSON Web Tokens)** to secure API endpoints.

* Users receive an **access token** after successful login.
* Protected routes require a valid token.
* Middleware verifies the token before allowing access.

---

## 👥 User Roles

The system supports **role-based authorization**:

* **Student**

  * View courses
  * Access learning content

* **Instructor**

  * Create courses
  * Manage learning materials
  * Update course content

---

## 📡 API Endpoints (Example)

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | User login        |
| GET    | `/api/courses`       | Get all courses   |
| POST   | `/api/courses`       | Create new course |
| GET    | `/api/users`         | Get user details  |

---

## 📈 Future Improvements

* Video lecture upload support
* Assignment and quiz modules
* Course progress tracking
* Notification system
* Admin dashboard
* Payment gateway integration

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

---

## 📧 Contact

**Praful Verma**

* GitHub: https://github.com/praful-verma
* Email: [vpraful007@gmail.com](mailto:vpraful007@gmail.com)

---

⭐ If you find this project helpful, please give it a **star** on GitHub.
