# 🎉 Event Management API

A Node.js + Express-based REST API for managing events, user registrations, and role-based access with caching support using `node-cache`.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**  
  JWT-based auth with middleware protection.
  - `organizer` role: can create, update, delete events.
  - `registrant` role: can view and register for events.

- 🧾 **Event Management APIs**
  - Create, update, delete events (organizers only).
  - View all events or a single event (cached).
  - Register for an event.
  - View registered events.

- ⚡ **Caching**  
  - Caches:
    - All events
    - Individual event
  - Cache is invalidated when:
    - A new event is created
    - An event is updated
    - An event is deleted

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- `node-cache` for in-memory caching
- Role-based middleware

---

## 📦 API Endpoints

### 🡩‍🏫 Auth

| Method | Endpoint           | Access     | Description            |
|--------|--------------------|------------|------------------------|
| POST   | `/users/register`  | Public     | Register a new user    |
| POST   | `/users/login`     | Public     | Login and get JWT      |

---

### 🗕️ Events

| Method | Endpoint                | Access        |Description                                  |
|--------|-------------------------|---------------|----------------------------------------------|
| POST   | `/events`               | Organizer     | Create a new event                           |
| GET    | `/events`               | Registrant    | Get all events (cached)                      |
| GET    | `/events/:id`           | Registrant    | Get a single event by ID (cached)            |
| PUT    | `/events/:id`           | Organizer     | Update event by ID and refresh cache         |
| DELETE | `/events/:id`           | Organizer     | Delete event by ID and invalidate cache      |
| POST   | `/events/:id/register`  | Registrant    | Register for an event                        |
| GET    | `/users/events`         | Registrant    | Get events the user has registered for       |

---

## 🧹 Middleware

### `authController.js`
- Validates JWT
- Attaches `user` object to request
- Check for organizer/registrant role
---

## 🧠 Caching Strategy

- Using `node-cache`:
  - Cache key: `allEvents` → caches list of all events
  - Cache key: `{eventId}` → caches a specific event by ID
- Cache invalidation:
  - `POST /events` → clears `allEvents`
  - `PUT /events/:id` → clears `{eventId}` and `allEvents`
  - `DELETE /events/:id` → clears `{eventId}` and `allEvents`

---

## ✅ Getting Started

1. Clone the repo  
   `git clone https://github.com/Ishan-phys/Event-Management-Platform.git`

2. Install dependencies  
   `npm install`

3. Set up environment variables in `.env`
   ```env
   PORT=3000
   DB_PASS=your_mongo_admin_password
   DB_URI='mongodb+srv://admin:<db_password>@<db_identifier>'
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server  
   `npm run debug`

---

## 📢 Sample Roles
```json
{
  "email": "john@example.com",
  "password": "123456",
  "role": ["organizer"]
}
```
```json
{
  "email": "jane@example.com",
  "password": "abcdef",
  "role": ["registrant"]
}
```

---

