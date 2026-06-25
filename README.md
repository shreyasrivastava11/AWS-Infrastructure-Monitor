# AWS Infrastructure Monitor

A full-stack cloud infrastructure monitoring dashboard built with **Spring Boot** (backend) and **ReactJS** (frontend), integrating the **AWS SDK v2** to provide real-time visibility into EC2 instances, S3 buckets, and CloudWatch metrics.

---

## Features

- **EC2 Instance Management** – View all instances, their state (running/stopped/pending), IP addresses, availability zones, and instance types. Start/stop instances directly from the dashboard.
- **S3 Bucket Explorer** – List all S3 buckets, view object counts, and browse bucket contents.
- **CloudWatch Metrics** – Visualize real-time CPU utilization, Network In/Out metrics using interactive line charts (last 1 hour, 5-minute intervals).
- **REST API Backend** – Clean RESTful endpoints built with Spring Boot, ready for integration with other enterprise systems.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, AWS SDK v2 |
| Frontend | ReactJS 18, Recharts, Axios |
| Cloud | AWS EC2, S3, CloudWatch |
| Build | Maven (backend), npm (frontend) |

---

## Project Structure

```
aws-infra-monitor/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/awsmonitor/
│   │   ├── config/                   # AWS SDK & CORS configuration
│   │   ├── controller/               # REST controllers (EC2, S3, Metrics)
│   │   ├── service/                  # Business logic & AWS SDK integration
│   │   └── model/                    # Data models
│   └── src/main/resources/
│       └── application.properties    # App configuration
└── frontend/                         # React application
    └── src/
        ├── components/               # EC2Instances, S3Buckets, MetricsChart
        ├── services/                 # Axios API service layer
        └── App.jsx                   # Main app with tab navigation
```

---

## Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.8+
- AWS Account with IAM credentials (EC2, S3, CloudWatch read access)

---

## Setup & Run

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aws-infra-monitor.git
cd aws-infra-monitor
```

### 2. Configure AWS Credentials

Set environment variables (recommended) or edit `application.properties`:

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

> **Important:** Never hardcode credentials. Use environment variables or AWS IAM roles.

### 3. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### 4. Run the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` and proxies API calls to port 8080.

---

## API Endpoints

### EC2
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ec2/instances` | List all EC2 instances |
| GET | `/api/ec2/instances/{id}` | Get instance by ID |
| POST | `/api/ec2/instances/{id}/start` | Start an instance |
| POST | `/api/ec2/instances/{id}/stop` | Stop an instance |

### S3
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/s3/buckets` | List all S3 buckets |
| GET | `/api/s3/buckets/{name}/objects` | List objects in a bucket |

### CloudWatch Metrics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/metrics/{id}/cpu` | CPU Utilization (last 1hr) |
| GET | `/api/metrics/{id}/network-in` | Network In bytes |
| GET | `/api/metrics/{id}/network-out` | Network Out bytes |
| GET | `/api/metrics/{id}/disk-read` | Disk Read Ops |

---

## IAM Permissions Required

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:StartInstances",
        "ec2:StopInstances",
        "s3:ListAllMyBuckets",
        "s3:ListBucket",
        "cloudwatch:GetMetricStatistics"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## Screenshots

> Dashboard shows EC2 instances with live state badges, S3 bucket explorer with object listing, and CloudWatch metric line charts per instance.

---

## Author

**Shreya Srivastava**  
[GitHub](https://github.com/shreyasrivastava11) | shreyasrivastava2dec@gmail.com
