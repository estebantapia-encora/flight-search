<<<<<<< HEAD
FROM openjdk:17-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    openssl \
    gnupg \
    --no-install-recommends

WORKDIR /my-project

COPY zscaler.crt /usr/local/share/ca-certificates/zscaler.crt

=======
FROM eclipse-temurin:17-jdk-jammy

# Install cert utilities
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    --no-install-recommends

# Create app dir
WORKDIR /app

# Add Zscaler certificate
COPY zscaler.crt /usr/local/share/ca-certificates/zscaler.crt

# Trust the cert system-wide and inside the JVM
>>>>>>> 78355b32547f3aef887243609dd1dd005e6f2a8f
RUN update-ca-certificates && \
    keytool -importcert -noprompt \
        -trustcacerts \
        -alias zscaler \
        -file /usr/local/share/ca-certificates/zscaler.crt \
        -keystore $JAVA_HOME/lib/security/cacerts \
        -storepass changeit

<<<<<<< HEAD

=======
# Add JAR and expose port
>>>>>>> 78355b32547f3aef887243609dd1dd005e6f2a8f
COPY build/libs/flightsearch-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

<<<<<<< HEAD
=======
# Run the app
>>>>>>> 78355b32547f3aef887243609dd1dd005e6f2a8f
ENTRYPOINT ["java", "-jar", "app.jar"]
