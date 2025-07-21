FROM openjdk:21-jdk-slim

# 애플리케이션 디렉토리 생성
ENV APP_HOME=/apps
WORKDIR $APP_HOME

# JAR 파일 복사
ARG JAR_FILE=target/his-0.0.1-SNAPSHOT.jar
COPY $JAR_FILE app.jar

# 애플리케이션 포트 노출
EXPOSE 8092

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
