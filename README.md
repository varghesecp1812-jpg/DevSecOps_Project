<div align="center">

# 🍔 FoodApp

### A Secure, Scalable Cloud-Based Food Ordering Platform

[![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white)](https://www.jenkins.io/)

<p>A full-stack food ordering and delivery application built with modern cloud infrastructure, DevOps best practices, and enterprise-grade security.</p>

</div>

---

## 📌 Overview

**FoodApp** allows customers to browse restaurants, view menus, place orders, and track delivery status in real time. Administrators manage restaurants, menus, and orders through protected APIs — all deployed on AWS with a fully automated CI/CD pipeline.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👤 Customer
- User registration & authentication
- Browse restaurants & menus
- Add items to cart
- Place & track orders
- View order history

</td>
<td width="50%">

### 🛠 Admin
- Manage restaurants & menu items
- Update order status
- Monitor active orders
- Admin dashboard

</td>
</tr>
</table>

---

## 🏗 System Architecture

```
User Browser
     │
     ▼
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Nginx Reverse Proxy│  ← SSL/TLS Termination
└────────┬────────────┘
         │
         ▼
┌──────────────────────────┐
│  Node.js + Express API   │  ← JWT Auth · Rate Limiting · Helmet
└────────┬─────────────────┘
         │
         ▼
┌──────────────────┐
│  AWS RDS MariaDB │  ← Parameterized Queries · Security Groups
└────────┬─────────┘
         │
         ▼
┌─────────────────────┐
│  AWS CloudWatch     │  ← Metrics · Logs · Alerts
└─────────────────────┘
```

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MariaDB (AWS RDS) |
| **Cloud** | AWS EC2, AWS RDS, AWS CloudWatch |
| **DevOps** | Docker, Jenkins, GitHub |
| **Web Server** | Nginx (Reverse Proxy + SSL) |
| **Auth** | JWT (JSON Web Tokens) |

---

## 🔐 Security

| Category | Implementation |
|---|---|
| Authentication | JWT-based auth + role-based authorization |
| Passwords | bcrypt hashing |
| Headers | Helmet security headers + XSS protection |
| Rate Limiting | Express rate limiting middleware |
| HTTP Pollution | HPP (HTTP Parameter Pollution) protection |
| Database | Parameterized queries — SQL injection prevention |
| Network | HTTPS via Nginx SSL/TLS + AWS Security Groups |
| Secrets | Secure environment variables via `.env` |

---

## 📂 Project Structure

```
foodapp/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── config/
│   ├── schema.sql
│   └── package.json
│
├── docs/
├── screenshots/
└── README.md
```

---

## ⚙ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/foodapp.git
cd foodapp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
NODE_ENV=production
PORT=3000

DB_HOST=your-rds-endpoint
DB_USER=foodapp
DB_PASSWORD=your_password
DB_NAME=foodapp_db

JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
```

Start the server:

```bash
node src/server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run build      # Production build
npm run dev        # Development server
```

---

## 🐳 Docker Deployment

```bash
# Build the image
docker build -t foodapp .

# Run the container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  foodapp
```

---

## 🔄 CI/CD Pipeline

Automated with **Jenkins**, triggered on every GitHub push:

```
GitHub Push → Jenkins Pipeline → Build → Test → Docker Build → Deploy to EC2 → Health Check
```

```
[GitHub] ──push──▶ [Jenkins]
                       │
              ┌────────▼────────┐
              │  Build & Test   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Docker Build   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ Deploy to EC2   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Health Check   │
              └─────────────────┘
```

---

## 📊 Monitoring

**AWS CloudWatch** tracks:

- EC2 & RDS performance metrics
- CPU utilization & memory usage
- Network throughput
- Centralized log collection
- Alert notifications

---

## 🧪 Test Results

| Feature | Status |
|---|:---:|
| User Registration | ✅ Pass |
| User Login | ✅ Pass |
| Restaurant Listing | ✅ Pass |
| Menu Retrieval | ✅ Pass |
| Cart Operations | ✅ Pass |
| Order Placement | ✅ Pass |
| Order Tracking | ✅ Pass |
| Admin Management | ✅ Pass |
| Database Connectivity | ✅ Pass |
| Docker Deployment | ✅ Pass |

---

## ☁ AWS Services

- **Amazon EC2** — Application hosting
- **Amazon RDS (MariaDB)** — Managed relational database
- **Amazon CloudWatch** — Monitoring, logging & alerts
- **AWS Security Groups** — Network access control

---

## 📄 License

This project was developed for educational and academic purposes.

---
VARGHESE C P
<div align="center">

**Made with ❤️ · Cloud Computing & DevOps Project · 2026**

</div>
