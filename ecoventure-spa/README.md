# EcoVenture Tours - Complete Web Solution

A comprehensive web application for EcoVenture Tours, featuring a React SPA, Progressive Web App, and REST API with MySQL database integration for eco-friendly tour management.

## 📋 Project Overview

This project consists of three main components:
- **Task 1**: React SPA for tour promotion and management
- **Task 2**: Progressive Web Application (PWA) for mobile users
- **Task 3**: REST API with MySQL database integration

## 🏗️ Project Structure

```
ecoventure-tours/
├── frontend/                 # Task 1: React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── data/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── pwa/                      # Task 2: Progressive Web App
│   ├── src/
│   ├── public/
│   │   ├── manifest.json
│   │   └── sw.js
│   └── package.json
├── backend/                  # Task 3: REST API
│   ├── routes/
│   ├── models/
│   ├── config/
│   ├── middleware/
│   └── server.js
├── database/
│   └── schema.sql
├── presentation/             # Task 2: PWA Presentation
│   └── pwa-presentation.pptx
└── README.md
```

## 🛠️ Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 📊 Database Setup

### 1. Install MySQL
```bash
# Windows: Download from https://dev.mysql.com/downloads/mysql/
# macOS: brew install mysql
# Ubuntu: sudo apt install mysql-server
```

### 2. Create Database and User
```sql
-- Login to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE ecoventure_tours;

-- Create user and grant privileges
CREATE USER 'ecoventure_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecoventure_tours.* TO 'ecoventure_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE ecoventure_tours;
```

### 3. Create Tables
```sql
-- Run the schema file
source database/schema.sql;

-- Or manually create tables:
CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('hiking', 'cycling', 'nature_walks') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available_slots INT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(255),
    duration VARCHAR(100),
    difficulty_level ENUM('easy', 'moderate', 'hard') DEFAULT 'moderate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO tours (name, description, category, price, available_slots, image_url, location, duration, difficulty_level) VALUES
('Lake District Hiking Adventure', 'Explore the beautiful Lake District with guided hiking trails through scenic landscapes.', 'hiking', 89.99, 15, '/images/lake-district.jpg', 'Lake District, England', '8 hours', 'moderate'),
('Cotswolds Cycling Tour', 'Cycle through picturesque Cotswolds villages on eco-friendly electric bikes.', 'cycling', 75.50, 12, '/images/cotswolds-cycling.jpg', 'Cotswolds, England', '6 hours', 'easy'),
('Peak District Nature Walk', 'Gentle nature walks focusing on local wildlife and conservation efforts.', 'nature_walks', 45.00, 20, '/images/peak-district.jpg', 'Peak District, England', '4 hours', 'easy');
```

## 🚀 Installation & Setup

### Task 1: React SPA Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install required packages
npm install react react-dom react-router-dom axios
npm install -D @vitejs/plugin-react vite tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p

# Start development server
npm run dev

# Build for production
npm run build
```

### Task 2: Progressive Web App

```bash
# Navigate to PWA directory
cd pwa

# Install dependencies
npm install

# Install PWA-specific packages
npm install workbox-webpack-plugin workbox-precaching

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase (optional)
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Task 3: Backend REST API

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install required packages
npm install express mysql2 cors dotenv body-parser helmet express-validator multer

# Install development dependencies
npm install -D nodemon

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_USER=ecoventure_user
DB_PASSWORD=your_password
DB_NAME=ecoventure_tours
PORT=3000

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Configuration Files

### Frontend - tailwind.config.js
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'eco-green': '#22c55e', // Custom color for EcoVenture
      },
      fontFamily: {
        'custom': ['Poppins', 'sans-serif'], // Custom font
      }
    },
  },
  plugins: [],
}
```

### Backend - .env
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=ecoventure_user
DB_PASSWORD=your_password
DB_NAME=ecoventure_tours
JWT_SECRET=your_jwt_secret_key
```

## 🧪 Testing the Application

### Test REST API Endpoints

#### GET All Tours
```bash
curl -X GET http://localhost:3000/api/tours
```

#### GET Tour by ID
```bash
curl -X GET http://localhost:3000/api/tours/1
```

#### POST New Tour
```bash
curl -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yorkshire Dales Hike",
    "description": "Scenic hiking in Yorkshire Dales National Park",
    "category": "hiking",
    "price": 95.00,
    "available_slots": 10,
    "location": "Yorkshire Dales",
    "duration": "7 hours",
    "difficulty_level": "moderate"
  }'
```

### Test Frontend Integration
1. Start backend server: `npm run dev` (in backend directory)
2. Start frontend server: `npm run dev` (in frontend directory)
3. Visit `http://localhost:5173`
4. Test tour browsing, filtering, and booking features

### Test PWA Features
1. Build PWA: `npm run build` (in pwa directory)
2. Serve built files with HTTPS
3. Use Chrome DevTools > Application > Service Workers
4. Test offline functionality
5. Run Lighthouse audit for PWA score

## 📱 PWA Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Deploy
firebase deploy
```

### Alternative: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## 🔍 Features Implemented

### Task 1 - React SPA (35 marks)
- ✅ React with Vite setup
- ✅ Component-based architecture
- ✅ React Router for navigation
- ✅ JSON data integration
- ✅ External API integration
- ✅ Master-detail views
- ✅ Tailwind CSS styling
- ✅ Custom colors and fonts

### Task 2 - PWA (35 marks)
- ✅ Service Worker implementation
- ✅ Manifest file
- ✅ Offline caching strategies
- ✅ Mobile-first responsive design
- ✅ Lighthouse PWA score optimization
- ✅ Light/Dark mode toggle
- ✅ Geolocation integration
- ✅ Push notifications

### Task 3 - REST API (30 marks)
- ✅ Express.js REST API
- ✅ MySQL database integration
- ✅ GET /tours endpoint
- ✅ POST /tours endpoint
- ✅ Input validation and error handling
- ✅ Frontend API integration
- ✅ Search and filter functionality

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running and credentials are correct in `.env` file.

#### CORS Issues
**Solution**: Ensure CORS is properly configured in backend server.

#### PWA Not Installing
**Solution**: Check manifest.json, ensure HTTPS, and verify service worker registration.

#### Tailwind Styles Not Loading
**Solution**: Check tailwind.config.js paths and ensure CSS imports are correct.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/tours` | Get all tours | `?category=hiking&search=lake` |
| GET | `/tours/:id` | Get tour by ID | - |
| POST | `/tours` | Create new tour | Body: tour object |
| PUT | `/tours/:id` | Update tour | Body: updated fields |
| DELETE | `/tours/:id` | Delete tour | - |

### Response Format
```json
{
  "success": true,
  "data": [...],
  "message": "Success"
}
```

- **Student Name**: Amar Bazlin 
- **Student ID**: CB014660
- **Course**: Web Development


## 📄 License

This project is developed for educational purposes as part of a web development assignment.

---

**Note**: Ensure all passwords and sensitive information are kept secure and not committed to version control.