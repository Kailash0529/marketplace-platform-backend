# 🚀 Marketplace Microservices Platform (Dockerized)

This project is a fully containerized microservices platform built with **Spring Boot**, **Kafka**, **MongoDB**, **PostgreSQL**, **Redis**, **Elasticsearch**, and **SigNoz** for full-stack observability.

## 🏗️ Architecture

| Service | Port | Description |
| :--- | :--- | :--- |
| **API Gateway** | `8090` | Unified entry point. Routes to Order and Cart services. |
| **Product Service** | `8086` | Manages products (MongoDB, Elasticsearch, Redis). |
| **Cart Service** | `8089` | Manages user carts (MongoDB, Feign to Product). |
| **Order Service** | `8092` | Manages orders (PostgreSQL, Feign to Cart/Product). |
| **Member Service** | `8085` | User management & Auth (PostgreSQL). |
| **Search Service** | `8091` | Search indexing (Kafka Consumer -> Elasticsearch). |
| **SigNoz (Unified)** | `8080` | Observability Dashboard (APM, Traces, Metrics). |
| **OTel Collector** | `4317` | Receives telemetry data from all microservices. |

## 🛠️ Prerequisites

- Docker Desktop
- Java 21+
- Maven

## 📈 Observability & Monitoring

All microservices are automatically instrumented with **OpenTelemetry**. Traces, metrics, and logs are sent to SigNoz.

1.  **Access SigNoz**: [http://localhost:8080](http://localhost:8080)
2.  **First Run**: Create an admin account on the first visit.
3.  **Dashboards**: View real-time APM metrics and distributed traces for all services.

## 🐳 How to Run

The entire stack is configured in `docker-compose.yml`.

### 1️⃣ Automatic Run (Recommended)
Use the provided script to build JARs and start Docker:
```bash
./build_and_run.sh
```

### 2️⃣ Manual Run
Build the application:
```bash
mvn clean package -DskipTests
```
Start Docker services:
```bash
docker-compose up --build -d
```

### 🧹 Clean Restart (Reset Monitoring Data)
To reset the entire stack including ClickHouse data:
```bash
docker-compose down -v && docker-compose up -d --build
```

## 🔍 Infrastructure
The `docker-compose.yml` orchestrates the following optimized infrastructure:
- **PostgreSQL**: `postgres:5432`
- **MongoDB**: `mongo:27017`
- **Redis**: `redis:6379`
- **Elasticsearch**: `elasticsearch:9200`
- **Kafka + Zookeeper**: `kafka:9092`, `zookeeper:2181` (Shared Zookeeper for Kafka & ClickHouse)
- **ClickHouse**: `clickhouse:8123` (SigNoz Storage)

## ✅ Verification
Check if all services are running:
```bash
docker-compose ps
```
Access the API Gateway: [http://localhost:8090](http://localhost:8090)

### ⚠️ Note
`API Gateway` is configured with routes:
- `/cart/**` -> `Cart Service`
- `/order/**` -> `Order Service`

All services are auto-instrumented via the `opentelemetry-javaagent.jar` included in their respective Docker images.
