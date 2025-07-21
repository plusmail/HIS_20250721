FROM ubuntu
RUN apt-get update && apt-get -y install sudo
RUN apt install -y openjdk-21-jdk

# 필수 패키지 업데이트 및 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    tcl \
    wget

# Redis 설치
RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    make install

# Redis 설정 파일 복사 (옵션)
COPY redis.conf /etc/redis/redis.conf
# Redis 실행 포트 노출
EXPOSE 6379

ENV APP_HOME=/apps
ARG JAR_FILE_PATH=target/his-0.0.1-SNAPSHOT.jar
WORKDIR $APP_HOME
COPY $JAR_FILE_PATH app.jar
COPY ./src/main/resources/application.properties /apps
EXPOSE 8092
ENTRYPOINT ["java", "-jar", "/apps/app.jar"]
