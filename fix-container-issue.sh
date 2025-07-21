#!/bin/bash

# 컨테이너 내부 충돌 문제 해결 스크립트
# 사용법: ./fix-container-issue.sh

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🔧 컨테이너 내부 충돌 문제 해결 시작"
echo "================================"

# 1단계: 모든 컨테이너 중지
log_info "1단계: 모든 컨테이너 중지"
docker-compose down

# 2단계: 기존 이미지 삭제
log_info "2단계: 기존 이미지 삭제"
docker rmi his-webapp 2>/dev/null || log_warning "이미지가 없습니다"

# 3단계: Docker 시스템 정리
log_info "3단계: Docker 시스템 정리"
docker system prune -f

# 4단계: JAR 파일 확인 및 빌드
log_info "4단계: JAR 파일 확인"
if [ ! -f "target/his-0.0.1-SNAPSHOT.jar" ]; then
    log_info "JAR 파일 빌드 중..."
    ./mvnw clean package -DskipTests
fi

if [ -f "target/his-0.0.1-SNAPSHOT.jar" ]; then
    log_success "JAR 파일 확인됨: $(ls -la target/his-0.0.1-SNAPSHOT.jar)"
else
    log_error "JAR 파일을 찾을 수 없습니다"
    exit 1
fi

# 5단계: 이미지 재빌드
log_info "5단계: Docker 이미지 재빌드"
docker-compose build --no-cache webapp

# 6단계: 컨테이너 시작
log_info "6단계: 컨테이너 시작"
docker-compose up -d

# 7단계: 상태 확인
log_info "7단계: 상태 확인 (15초 대기)"
sleep 15
docker-compose ps

# 8단계: 로그 확인
log_info "8단계: 로그 확인"
docker-compose logs --tail=10

echo "================================"
log_success "컨테이너 내부 충돌 문제 해결 완료" 