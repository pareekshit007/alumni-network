# Alumni Network Platform

![Alumni Network Banner](https://via.placeholder.com/1000x300.png?text=Alumni+Network+Platform)

A complete, production-ready Alumni Network Platform built using the **MERN Stack** (MongoDB, Express, React, Node.js) designed explicitly to fulfill comprehensive DevOps lifecycle and continuous integration requirements.

## 🚀 DevOps Lab Requirements Achieved

This project successfully implements the following core competencies:

- **Lab 1 (Version Control):** Fully isolated Git repository architecture ready for branching workflows.
- **Lab 2 (Containerization):** Multi-stage `Dockerfile` deployments for both the frontend (Nginx proxy) and backend (Node runtime), orchestrated seamlessly via `docker-compose`.
- **Lab 3 (Continuous Integration):** Embedded `.github/workflows/ci.yml` matrix runner asserting test-driven development structures.
- **Lab 4 (CI/CD Pipeline):** Declarative `Jenkinsfile` executing dynamic cloud pushes to Docker Hub registries mapping into remote instances.
- **Lab 5 (Full-Stack Deployment):** Nginx-proxied MERN application utilizing Docker bridge networks isolating internal MongoDB traffic securely.
- **Lab 6 (Infrastructure as Code):** `terraform/` directory mapping Hashicorp constructs dynamically building AWS EC2 Virtual Machines complete with customized security group constraints.

## 🛠 Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Socket.IO Client, Vanilla CSS Variables (No Tailwind).
- **Backend:** Node.js 20, Express 5, Mongoose, Socket.IO, Multer, JSONWebToken, BcryptJS.
- **Database:** MongoDB (Containerized via Docker).
- **DevOps:** Docker, Docker Compose, Jenkins, GitHub Actions, Terraform, AWS EC2.

## 📦 Features

- **Authentication & RBAC:** Secure JWT-based Login/Registration mapping user roles (Admin, Alumni, Student).
- **Alumni Directory:** Interactive connection engine resolving connection graphs natively.
- **Real-Time Messaging:** Socket.IO integrated chat engine running asynchronously to standard HTTP traffic.
- **Job Board:** Dynamic employment tracker parsing application statuses securely.
- **Event Planning:** RSVP manager with calendar syncing mechanics.
- **Image Uploads:** `multipart/form-data` natively parsed via Multer targeting isolated Docker volumes.

## 🏗 Getting Started (Local Development)

1. **Clone the Repo:**
   ```bash
   git clone <YOUR_REPO_URL>
   cd alumni-network
   ```

2. **Start the cluster via Docker Compose:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
   ```

3. **Database Seeding (Optional but Recommended):**
   In a new terminal, run the seeder script to populate default users:
   ```bash
   cd scripts
   npm i mongoose bcryptjs dotenv
   node seed.js
   ```
   *This initializes the database with a core Admin user `admin@alumninet.com` (password: `password123`) and sample users.*

4. **Access the Application:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:5000/api

## ☁️ Production Deployment (AWS / Terraform)

1. Provision the hardware using Terraform:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```
   *(Ensure you have your `alumni-prod-key` prepared in AWS)*

2. SSH into your newly created EC2 Instance and pull the repo.
3. Start the production cluster without development overrides using the static proxy mapper:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## 🔐 Database Backups

To execute a live native snapshot of your database securely without downtime using the custom shell script:
```bash
./scripts/backup-db.sh
```
This drops compressed local `.gz` binaries cleanly into `db_backups/` tracking historical snapshots.
