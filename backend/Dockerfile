FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src/ src/
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app

RUN groupadd --system galaxy && useradd --system --gid galaxy galaxy

COPY --from=build /app/target/galaxy-0.0.1-SNAPSHOT.jar app.jar

USER galaxy
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]