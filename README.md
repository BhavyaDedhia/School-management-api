# 🏫 School Management API

A simple Node.js + Express API that allows you to:
- Add schools to a MySQL database
- Retrieve a list of schools sorted by proximity to a given user location using the Haversine formula.

---

## 📦 Tech Stack

- Node.js
- Express.js
- MySQL
- Postman (for testing)

---

## 📁 API Endpoints

### ➕ Add School

**Endpoint:** `/addSchool`  
**Method:** `POST`  
**Payload (JSON):**
```json
{
  "name": "ABC International School",
  "address": "123 Marine Drive",
  "latitude": 19.1,
  "longitude": 72.9
}
