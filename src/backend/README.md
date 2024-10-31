# Gin Rummy Backend

This is a backend project for the Gin Rummy game built with Java 21 and Spring Boot 3.2.11, utilizing PostgreSQL for database management. It includes Docker auto-run configurations for PostgreSQL, so ensure your Docker daemon is running before starting the application.

## Prerequisites
- Java 21 installed on your system.
- Maven for dependency management and running the project.
- Docker (make sure Docker Desktop or the Docker daemon is running).

## Getting Started
To start the project, run the following command in your terminal:
```bash
mvn spring-boot:run
```

## Maven Packages
This project includes the following packages:

- spring-boot-starter-actuator: Actuator support for application monitoring.
- spring-boot-starter-data-jpa: JPA support for data persistence.
- spring-boot-starter-web: Web starter for creating RESTful APIs.
- flyway-core: Database migration management.
- spring-boot-starter-thymeleaf: Template rendering with Thymeleaf.
- spring-session-core: Session management.
- spring-boot-docker-compose: Auto-run Docker configurations at runtime.
- postgresql: PostgreSQL driver for database connection.
- lombok: For reducing boilerplate code (optional).
- spring-boot-starter-test: Testing framework for Spring Boot.
- spring-security-test: Security testing utilities.