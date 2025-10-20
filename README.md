<!-- # 🌍 PostCrossing Replica — MongoDB + API + Firefox Extension

# What is PostCrossing?
PostCrossing is a real-world website where:

Users register and create profiles with their addresses
Users request to "send a card" and receive a random recipient's address
Users physically mail postcards to the recipient
Once the recipient receives and registers the postcard, the sender becomes eligible to receive a postcard from another random user
This creates a continuous cycle of postcard exchange worldwide

# 🎯 Project Overview
This project is a comprehensive mock implementation of PostCrossing.com, a platform where users can send and receive postcards from random strangers around the world. The core concept is simple yet elegant: for every postcard you send, you receive one back from someone else.

# It includes:
- A **MongoDB mock database** for managing users and postcards.
- A **Node.js + Express API** for CRUD operations and reciprocal postcard sending.
- A **Firefox Extension** for sorting and hybrid searching PostCrossing URLs open in browser tabs.

This project was built for academic purposes to demonstrate API design, database modeling, and browser extension development.

## 🖥️ Tech Stack

| **Component**           | **Technology / Tool**                         |
|--------------------------|----------------------------------------------|
| **Backend**              | Node.js + Express                            |
| **Database**             | MongoDB (Compass + Mongoose)                 |
| **API Testing**          | Postman                                      |
| **Browser Extension**    | Firefox (Manifest v3)                        |
| **Programming Language** | JavaScript (ES6)                             |
| **Version Control**      | Git & GitHub                                 |
| **Environment Variables**| `.env` file with MongoDB connection URL      |

---

# ⚙️ Features Implemented
## 🔁 Reciprocal Postcard Logic
  ### How It Works
    The reciprocal matching system is the core feature of PostCrossing. Here's the detailed workflow:

  ### Scenario 1: Successful Pairing
    1.User A sends request → System checks PendingSends collection
    2.User B found in queue → System pairs them together
    3.Two postcards created:
      Postcard 1: User A → User B
      Postcard 2: User B → User A
    4.Both users receive addresses and can mail physical postcards
    5.User B removed from queue

  ### Scenario 2: No Match Available
    1.User A sends request → System checks PendingSends collection
    2.No users in queue → Cannot pair
    3.User A added to queue → Waits for next user
    4.Next user will be paired with User A

## 🦊 Firefox Extension
### Overview
  The Firefox Extension adds powerful tab management capabilities specifically for PostCrossing postcard pages.

### Features Implemented
  1. Tab Sorting
    Sort postcard tabs in ascending or descending order
    Sorts by card number (e.g., CL-34269 < CN-4087990 < US-11797804)
    Handles country codes and numbers separately for accurate sorting

  2. Hybrid Search ⭐ (Bonus Feature)
    Combines two criteria:
      URL-based search: Matches postcard code (e.g., CN-4087990)
      Title-based search: Matches words in page title (e.g., “Postcard CN”)

      Two search modes:
        AND Mode: Match both title AND code
        OR Mode: Match either title OR code


# 📦 Installation & Setup
## ⚙️ Prerequisites
- **Node.js:** v14 or higher  
- **MongoDB:** v4.4 or higher  
- **Firefox Browser:** Required for testing the extension  
- **Postman:** For API testing  
- **MongoDB Compass:** For viewing and managing database


### Step 1: Clone Repository
git clone <your-repository-url>
cd postcrossing-mock-project

### Step 2: Install Dependencies
npm install

### Step 3: Setup environment
MONGO_URL=mongodb://localhost:27017
MONGO_DB=postcrossing
PORT=3000


### Step 4: Start the Server
  ### Development mode
    npm start
  ### Or with nodemon (auto-restart)
    npm run dev
  
  ### Once connected, you’ll see:
    ✅ MongoDB connected
    🚀 Server running on http://localhost:3000

### Step 5: Testing with Postman
  1. Start the backend server
  2. Open Postman
  3. Use the above endpoints (base URL: [http://localhost:3000](http://localhost:3000))
  4. Send requests using POST / GET methods
  5. Verify results in MongoDB Compass

## FireFox Extension
### Step 6: Load Firefox Extension
  1. Open Firefox
  2. Navigate to about:debugging#/runtime/this-firefox
  3. Click "Load Temporary Add-on..."
  4. Select manifest.json from extension folder
  5. Extension icon appears in toolbar

---

# 🧠 Optional Future Improvements

- Add React frontend for visualizing users and postcards.
- Implement WebSocket for real-time card updates.
- Add authentication (JWT / OAuth).
- Store postcard images using Cloudinary or Firebase.

---

# 🏁 Conclusion

This project fulfills all requirements of the given assignment:

✅ **Schema Design** — Completed  
✅ **API Design** — Multiple routes implemented  
✅ **Implementation Correctness** — Reciprocal sending working  
✅ **Documentation** — Provided  
✅ **Firefox Extension** — Sorting + Hybrid Search implemented  

---

# 👨‍💻 Author Information
**Name:** Abdullah Khalid  
**Roll No:** FA23-BCS-019  
**Section:** C  
**Institution:** COMSATS University Islamabad (Lahore Campus)  
**Program:** BS Computer Science -->


# PostCrossing Replica — MongoDB, API, and Firefox Extension

## Overview

This project is a simplified replica of the original PostCrossing concept, where users send and receive postcards from random people around the world. The idea is that for every postcard a user sends, they will receive one back from another participant.

The project demonstrates backend development, database integration, and browser extension functionality. It includes:

* A **MongoDB database** for storing users and postcard data
* A **Node.js and Express API** for handling postcard exchange and user pairing
* A **Firefox Extension** for managing and searching PostCrossing tabs

This project was developed for academic purposes to practice full-stack development and API design concepts.

---

## Tech Stack

| Component         | Technology            |
| ----------------- | --------------------- |
| Backend           | Node.js and Express   |
| Database          | MongoDB with Mongoose |
| API Testing       | Postman               |
| Browser Extension | Firefox (Manifest v2) |
| Language          | JavaScript (ES6)      |
| Version Control   | Git and GitHub        |

---

## Core Functionality

### Reciprocal Postcard Exchange

1. When a user requests to send a postcard, the system checks for any waiting users.
2. If a match is found, both users are paired, and postcards are generated for each direction.
3. If no match is found, the user is added to a waiting queue until another user joins.
4. This ensures a balanced and continuous postcard exchange cycle.

---

## Firefox Extension Features

* **Tab Sorting:** Sort open PostCrossing tabs in ascending or descending order based on postcard codes.
* **Hybrid Search:** Search for postcards by code or title using either AND or OR logic modes for more accurate filtering.

---

## Installation and Setup

1. Clone the repository

   ```bash
   git clone https://github.com/abdullah-abdk/postcrossing-mock
   cd postcrossing-replica
   ```
2. Install dependencies

   ```bash
   npm install
   ```
3. Create an `.env` file

   ```
   MONGO_URL=mongodb://localhost:27017
   MONGO_DB=postcrossing
   PORT=3000
   ```
4. Start the server

   ```bash
   npm start
   ```

   or, for development mode:

   ```bash
   npm run dev
   ```
5. Test API endpoints using Postman.
6. Load the Firefox extension through `about:debugging#/runtime/this-firefox`.

---
