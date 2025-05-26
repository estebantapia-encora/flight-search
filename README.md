# Flight Search Application

This full-stack project allows users to search for flights using the **Amadeus API**, displaying available flights, airline details, and airport suggestions. It is built with **Spring Boot** for the backend and **React + Vite** for the frontend. Both services are containerized with **Docker** and managed via **Docker Compose** for seamless deployment.

---

## Features

### Backend
- Search for flight offers using the Amadeus API.
- Enriched airline and airport dictionary support.
- Clean and well-structured REST API endpoints.
- Environment-specific configuration via `application.yml`.

### Frontend
- Responsive UI to search flights with autocomplete.
- Segment-level flight details with base fares, amenities, and more.
- Clear display of departing and return flight selections.
- Summary page with total cost breakdown.

---

## Tech Stack


### Backend
- Java 17
- Spring Boot
- Gradle (Groovy)
- Docker

### Frontend
- React
- Vite
- TypeScript
- Vitest
- @testing-library/react
- Docker

---

## Folder Structure
FlightSearch/

├── flight-search-be/        # Spring Boot backend

├── flight-search-fe/        # React frontend

├── .env                     # Amadeus API credentials

└── docker-compose.yml       # Container orchestration


---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/flight-search.git
cd flight-search
```

### 2. Create .env file
```env
AMADEUS_KEY=your_amadeus_api_key
AMADEUS_SECRET=your_amadeus_api_secret
```

### 3. Build the backend JAR
```bash
cd flight-search-be
./gradlew clean build
cd ..
```

### 4. Run the application using Docker Compose
```bash
 docker compose up --build
 Frontend: http://localhost:9090
 Backend: http://localhost:8080
```
---

## Zscaler Certificate
If you're on a corporate network using Zscaler, import the root certificate to avoid PKIX SSL errors. 

Add your certificate to:

flight-search-be/zscaler.crt

The Dockerfile will automatically import it into Java’s truststore.

---

## Backend Endpoints
| Method | Endpoint                     | Description                      |
|--------|------------------------------|----------------------------------|
| GET    | `/api/airlines/{iataCode}`   | Get airline info by IATA code    |
| GET    | `/api/airports/{keyword}`    | Search airports by keyword       |
| GET    | `/api/flight-offers`         | Search for available flights     |

---
