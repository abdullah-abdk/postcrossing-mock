# PostCrossing Replica — MongoDB, API, and Firefox Extension

## Overview

This project is a simplified replica of the original PostCrossing concept, where users send and receive postcards from random people around the world. The idea is that for every postcard a user sends, they will receive one back from another participant.

The project demonstrates backend development, database integration, and browser extension functionality. It includes:

* A **MongoDB database** for storing users and postcard data
* A **Node.js and Express API** for handling postcard exchange and user pairing
* A **Firefox Extension** for sorting PostCrossing tabs

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
