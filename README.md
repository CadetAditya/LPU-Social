# 🎓 LPU Social - Campus Event Discovery & Management Platform

**LPU Social** is a full-stack web application designed for Lovely Professional University (LPU) students and event organizers. It simplifies campus engagement by enabling students to explore, filter, and register for campus activities while allowing organizers to host, manage, and monitor event participation.

---

## 🏗️ Tech Stack

### **Backend**
* **Language & Framework**: Java 17, Spring Boot 4.1.1
* **Data Access**: Spring Data JPA, Hibernate
* **Database**: PostgreSQL (`lpu_social`)
* **Build Tool**: Maven

### **Frontend**
* **Core**: Vanilla HTML5, CSS3, JavaScript (ES6+)
* **Styling**: Modern CSS System with Inter Font, CSS custom variables, and responsive layout
* **Session Management**: Client-side storage (`localStorage`) with dynamic role-based rendering & page route protection

---

## 🗄️ Database Setup

1. Open PostgreSQL CLI or pgAdmin and create the database:
   ```sql
   CREATE DATABASE lpu_social;
   ```
2. Execute the script [`database/schema.sql`](file:///c:/Users/Loq/Desktop/Lpu-Social/LPU-Social/database/schema.sql) to set up tables and initial seed data:
   ```bash
   psql -U postgres -d lpu_social -f database/schema.sql
   ```

---

## 🚀 Running the Project

### 1. Start Spring Boot Backend
Configure your PostgreSQL credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lpu_social
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
server.port=8080
```

Run the backend via Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```

### 2. Launch Frontend
Open `frontend/index.html` directly in your browser or serve it via any static HTTP server (e.g. Live Server).

---

## 🔐 Credentials & Test Accounts

| Role | Registration Number | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Organizer** | `ORG1001` | `123456` | Create events, view created events dashboard, delete hosted events |
| **Student** | `12204567` | `123456` | Browse events, filter by category/search, join events, view joined events |

---

## 📡 API Reference

### **User API (`/api/users`)**
* `POST /api/users` — Register a user (`STUDENT` or `ORGANIZER`)
* `POST /api/users/login` — User authentication
* `GET /api/users/{registrationNumber}` — Retrieve profile details

### **Event API (`/api/events`)**
* `GET /api/events` — Retrieve all campus events
* `GET /api/events/{id}` — Fetch details for a specific event
* `POST /api/events` — Create a new event (organizers)
* `DELETE /api/events/{eventId}/organizer/{userId}` — Delete an event
* `POST /api/events/{eventId}/join/{userId}` — Register a student for an event
* `GET /api/events/user/{userId}` — List events joined by a student
* `GET /api/events/organizer/{userId}` — List events created by an organizer
* `GET /api/events/{eventId}/joined/{userId}` — Check student registration status
