# 🚑 Rapid Response

> **Team Code Runners** | *Tech Sprint Hackathon 2026*

**Rapid Response** is a centralized accident reporting and emergency dispatch system designed to reduce response times in critical situations in Nepal by enabling real-time reporting, verification, and coordinated emergency response.

---

## 🚩 Problem Statement

Even with Nepal’s growing digital landscape, emergency response systems remain disconnected and slow. Most accidents are still reported via phone calls, leading to several critical issues:

- **Inaccurate Location Sharing**  
  People often struggle to describe the exact accident location, causing delays—especially in crowded urban areas.

- **Disconnected Communication**  
  Emergency services such as police, ambulances, and hospitals operate independently. Contacting each service separately results in poor coordination and delayed response.

- **Lack of Hospital Readiness**  
  Hospitals rarely receive advance notice about incoming emergency patients, leaving them unprepared to deliver immediate, life-saving care.

- **No Verification or Tracking System**  
  Without a centralized platform, it is difficult to verify the authenticity of reports or track response times, leading to resource wastage and false reports.

Without a centralized, real-time emergency reporting and verification platform, response delays will continue to result in preventable loss of life and property damage.

---

## 💡 Our Solution

An integrated application where a citizen can report an accident with **one tap**. The system uses:


- **Real-Time Geolocation** to identify the incident location  
- **Instant Dispatch** to notify the nearest hospitals, police station and available ambulance providers
- **Live Dashboard** for emergency responders to monitor and act immediately
- **AI-Based Verification** to validate accident images (will be added based on time constraints)
---

## 🛠️ Tech Stack (MERN)

### Frontend (Client Side)
- **React.js** — User reporting interface and ambulance/admin dashboard  
- **Tailwind CSS / Material UI** — Responsive UI and rapid prototyping  
- **Google Maps API** — Accident location visualization and route dispatching  

### Backend (Server Side)
- **Node.js & Express.js** — RESTful APIs for reports, uploads, and dispatch logic  
- **Socket.io** — Real-time bi-directional communication for instant updates  

### Database
- **MongoDB** — Stores:
  - Accident reports (image URLs, geolocation, timestamp)
   - Active ambulance locations
  - User/driver civic scores *(future scope)*
 

### Additional Services
- **AI/ML Integration** — Python + TensorFlow model for accident image classification  
- **Cloudinary** — Secure image storage  

---

## ⚙️ Setup Instructions

### 1. Prerequisites
Ensure the following are installed:
- Node.js (v14+)
- npm
- MongoDB (Local instance or MongoDB Atlas)

 ## Contributors
-   **Sandesh Prasai**  
  *Backend Developer*

- **Santu Yadav**  
  *Full Stack Developer*

- **Biyash Shrestha**  
  *Full Stack Developer*

- **Sanjay Mahar**  
  *AI & Machine Learning Engineer*

### 2. Clone the Repository
```bash
git clone https://github.com/sandeshprasai/TechSprint_CodeRunners.git
cd TechSprinthackathon
```

## Note: The repository and markdown will be updated as project advances.