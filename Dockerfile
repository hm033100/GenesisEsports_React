FROM openjdk:11
COPY target/MyPortfolioBackend-0.0.1-SNAPSHOT.jar hollandaucoin-backend.jar
ENTRYPOINT ["java", "-jar","/hollandaucoin-backend.jar"]