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
RUN update-ca-certificates && \
    keytool -importcert -noprompt \
        -trustcacerts \
        -alias zscaler \
        -file /usr/local/share/ca-certificates/zscaler.crt \
        -keystore $JAVA_HOME/lib/security/cacerts \
        -storepass changeit

# Add JAR and expose port
COPY build/libs/flightsearch-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
