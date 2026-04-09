# Checky : Advanced Task Management Ecosystem

Checky is a comprehensive, enterprise-grade task management system featuring a modern admin dashboard, real-time analytics, and efficient user/task coordination.

This repository contains:

1.  **[Dashboard](./dashboard)**: A premium Next.js frontend for admins and users.
2.  **[Server](./server)**: A robust NestJS backend with Prisma and PostgreSQL.

---

## 🚀 Quick Start (Docker)

The fastest way to get the entire ecosystem running is using Docker Compose.

### 1. Run everything

```bash
docker compose up --build
```

### 2. Initialize Database & Seed

Once the containers are running, you need to push the database schema and seed the initial data:

```bash
# Push schema
docker exec -it checky-server npx prisma db push

# Seed demo data
docker exec -it checky-server npx prisma db seed
```

Access the dashboard at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Demo Credentials

Use these accounts to test the system features:

### **Admin Account**

- **Email**: `admin@tasksystem.com`
- **Password**: `admin123`
- **Capabilities**: Full access to analytics, user management, and all tasks.

### **User Account**

- **Email**: `user@tasksystem.com`
- **Password**: `user123`
- **Capabilities**: Personalized task management and profile access.

---

## 🏗️ Manual Setup

If you prefer to run services manually, please refer to the individual README files:

- [Dashboard README](./dashboard/README.md)
- [Server README](./server/README.md)

---

## 👨‍💻 Author

**Md Shakil Hossain**  
Software Engineer & Architect
[Website](https://shakil-tawny.vercel.app)
[GitHub](https://github.com/Shakilofficial)

---

## 📄 License

This project is part of the Checky ecosystem.
