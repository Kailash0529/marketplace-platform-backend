FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/*.jar app.jar
RUN apt-get update && apt-get install -y curl && \
    curl -L https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar -o opentelemetry-javaagent.jar

ENTRYPOINT ["java", "-javaagent:opentelemetry-javaagent.jar", "-jar", "app.jar"]
