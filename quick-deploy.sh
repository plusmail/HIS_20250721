#!/bin/bash

# 빠른 배포 스크립트 - JAR 파일만 교체하여 재시작
# 사용법: ./quick-deploy.sh

set -e

echo "🚀 HIS 애플리케이션 빠른 배포 시작..."

# 1. JAR 파일 빌드
echo "📦 JAR 파일 빌드 중..."
./mvnw clean package -DskipTests

# 2. 컨테이너 재시작
echo "🔄 컨테이너 재시작 중..."
docker-compose restart webapp

# 3. 상태 확인
echo "⏳ 애플리케이션 시작 대기 중..."
sleep 10

# 4. 로그 확인
echo "📋 최근 로그:"
docker logs --tail=5 his_server

echo "✅ 배포 완료! http://localhost:8092" 