# 🚀 Marketplace Microservices Platform (Dockerized – In Progress)

A **cloud-native, microservices-based backend platform** built using **Spring Boot** and **API Gateway**, with a focus on **Docker-based deployment, service reliability, and production readiness**.

> ⚠️ **Current Status:**
> - All microservices are built and packaged as executable JARs
> - **API Gateway is fully containerized and running on Docker**
> - Other services will be containerized incrementally

This repository reflects a **real-world, step-by-step microservices deployment journey**, not a toy setup.

---

## 🧩 Architecture Overview

The system follows a **microservices architecture** with centralized routing via an API Gateway.


---

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Cloud Gateway
- Spring Data JPA
- Spring Security (JWT)

### Databases
- PostgreSQL
- MongoDB
- Redis
- Apache Solr

### Messaging & Communication
- Apache Kafka
- Feign Client

### DevOps & Infrastructure
- Docker
- Docker Compose
- Spring Boot Actuator (health checks)

---

## 📦 Services (Current State)

| Service Name | Status | Port |
|-------------|-------|------|
| API Gateway | ✅ Dockerized & Running | 8090 |
| Cart Service | JAR Built | 8089 |
| Product Service | JAR Built | 8086 |
| Order Service | JAR Built | 8092 |
| Search Service | JAR Built | 8091 |
| Member Service | JAR Built | 8085 |

---

## 🐳 Dockerized Components (Current)

### ✅ API Gateway
- Packaged as Spring Boot executable JAR
- Deployed using Docker
- Exposes routing and authentication layer
- Integrated with PostgreSQL running in Docker

### ✅ PostgreSQL
- Running as a Docker container
- Used by API Gateway for refresh token persistence

---

## ▶️ How to Run (Current Setup)

### 1️⃣ Build all services
```bash
mvn clean package -DskipTests
docker compose up --build
http://localhost:8090/actuator/health
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" }
  }
}
