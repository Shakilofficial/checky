# Checky : Enterprise Task Server

A robust, high-performance backend for the Checky Task Management System. Built with **NestJS**, **Prisma**, and **PostgreSQL**, it provides a secure and scalable API for task orchestration, user management, and compliance auditing.

Developed by **Md Shakil Hossain**.

---

## 🔑 Core Features

- **Advanced RBAC**: Granular Role-Based Access Control ensuring strict security between Admins and Users.
- **Audit Intelligence**: Automated tracking of all critical system actions (Tasks, Users, Status changes).
- **Security**: JWT-based authentication with refresh token rotation and salted bcrypt hashing.
- **Performance**: Optimized database queries with Prisma and comprehensive pagination/filtering.
- **Standardized API**: Consistent response formats and global exception handling for elite developer experience.

---

## 🏗️ Quick Start (Docker Preferred)

The entire ecosystem (App, DB, Adminer) can be spun up with a single command:

```bash
docker compose up --build
```

### Database Initialization
On the first run, initialize the schema and seed the default accounts:

```bash
docker exec -it task-server-app npx prisma db push
docker exec -it task-server-app npx prisma db seed
```

---

## 📡 Essential Endpoints

- `POST /api/v1/auth/login` - Secure authentication.
- `GET /api/v1/analytics/dashboard` - Integrated system stats.
- `GET /api/v1/tasks` - Advanced task registry.
- `GET /api/v1/audit-logs` - System compliance logs.

---

## 👨‍💻 Author

**Md Shakil Hossain**  
Software Engineer & Architect

---

## 📄 License

This project is part of the Checky ecosystem.
