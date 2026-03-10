# EdTech Learning Platform – Backend

This project is the **backend system of an EdTech learning platform** where users can register, login, and manage courses. The backend handles user authentication, course management, and secure APIs for accessing learning content.

The goal of this project was to build a **scalable and secure backend using Node.js and Express** while working with MongoDB as the database.

---

## Features

* User registration and login system
* JWT based authentication
* Role based access for **students and instructors**
* Course creation and management
* Secure REST APIs
* Middleware based authentication and request validation

---

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB Atlas**
* **MongoDB Compass**
* **JWT (JSON Web Token)**
* **REST APIs**
* **Git & GitHub**

---

## Project Structure

```
edtech-backend
│
├── controllers      # Business logic
├── models           # MongoDB schemas
├── routes           # API routes
├── middleware       # Authentication middleware
├── config           # Database configuration
├── server.js        # Main server file
└── package.json
```

---

## Installation and Setup

### 1. Clone the repository

```
git clone https://github.com/praful-verma/edtech-backend.git
```

### 2. Go to the project folder

```
cd edtech-backend
```

### 3. Install dependencies

```
npm install
```

### 4. Create a `.env` file

Add the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Run the server

```
npm start
```

The server will run on:

```
http://localhost:5000
```

---

## Authentication

This project uses **JWT authentication**.

After login, the server generates a **token** which is required to access protected routes. Middleware is used to verify the token before allowing access to APIs.

---

## User Roles

### Student

* View courses
* Access learning materials

### Instructor

* Create courses
* Update course content
* Manage learning materials

---

## Future Improvements

* Add video lectures
* Assignment and quiz system
* Course progress tracking
* Admin panel
* Payment integration

---

## Author

**Praful Verma**

GitHub: https://github.com/praful-verma
Email: [vpraful007@gmail.com](mailto:vpraful007@gmail.com)
