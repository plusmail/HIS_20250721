FROM openjdk:21-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# Maven Wrapper와 pom.xml 복사
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Maven Wrapper에 실행 권한 부여
RUN chmod +x mvnw

# 소스 코드 복사
COPY src ./src

# 애플리케이션 빌드
RUN ./mvnw clean package -DskipTests

# JAR 파일을 실행용 디렉토리로 복사
RUN cp target/his-0.0.1-SNAPSHOT.jar app.jar

# 포트 노출
EXPOSE 8092

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
