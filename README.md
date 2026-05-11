# Gender Management System

A full-stack application for managing gender codes and selections with CRUD operations.

## Project Structure

- **backend/**: Node.js + Express API server with PostgreSQL
- **frontend/**: HTML/CSS/JavaScript client for gender management
- **database.sql**: PostgreSQL schema and sample data

## Features

### Two Tables

1. **genders** - Main gender definitions
   - code (1 = Male, 2 = Female)
   - gender_label (e.g., "Male - ذكر")
   - description

2. **gender_selections** - Tracks gender assignments to users
   - user_id
   - gender_id (foreign key to genders)
   - selected_at (timestamp)

### CRUD Operations

**Genders Endpoints:**
- `GET /api/genders` - List all genders
- `GET /api/genders/:id` - Get single gender
- `POST /api/genders` - Create new gender
- `PUT /api/genders/:id` - Update gender
- `DELETE /api/genders/:id` - Delete gender

**Gender Selections Endpoints:**
- `GET /api/gender-selections` - List all selections
- `POST /api/gender-selections` - Add selection
- `DELETE /api/gender-selections/:id` - Remove selection

## Setup

### 1. Database Setup

Create a PostgreSQL database and run the schema:

```bash
psql -U postgres -d genders_db -f database.sql
```

Or manually create the database first:

```bash
createdb genders_db
psql -U postgres -d genders_db -f database.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm start
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
# Open index.html in a browser or serve with a local server
npx http-server
```

Access the app at `http://localhost:8080`

## Technologies

- **Backend**: Node.js, Express, PostgreSQL (pg driver)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: PostgreSQL with relational schema

## Note

The frontend is set to connect to `http://localhost:5000/api` by default. Make sure both frontend and backend are running for full functionality.
