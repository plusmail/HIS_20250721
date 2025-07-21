#!/bin/bash

# MySQL 문제 해결 스크립트
# 사용법: ./mysql-troubleshoot.sh

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

echo "🔍 MySQL 문제 해결 시작"
echo "================================"

# 1단계: 현재 상태 확인
log_info "1단계: 현재 상태 확인"
docker-compose ps database

# 2단계: 로그 확인
log_info "2단계: MySQL 로그 확인"
docker logs --tail=10 his_db

# 3단계: 권한 문제 해결
log_info "3단계: 권한 문제 해결"
if [ -d "db/data" ]; then
    log_info "데이터 디렉토리 권한 수정 중..."
    sudo chown -R 999:999 db/data 2>/dev/null || {
        log_warning "sudo 권한이 없습니다. 수동으로 실행해주세요:"
        log_info "sudo chown -R 999:999 db/data"
    }
    sudo chmod -R 755 db/data 2>/dev/null || {
        log_warning "권한 수정 실패"
    }
    log_success "권한 수정 완료"
else
    log_warning "데이터 디렉토리가 없습니다"
fi

# 4단계: 컨테이너 재시작
log_info "4단계: MySQL 컨테이너 재시작"
docker-compose restart database

# 5단계: 시작 대기
log_info "5단계: MySQL 시작 대기 (30초)"
sleep 30

# 6단계: 상태 재확인
log_info "6단계: 상태 재확인"
docker-compose ps database

# 7단계: 연결 테스트
log_info "7단계: 연결 테스트"
if docker-compose exec -T database mysqladmin ping -h localhost --silent 2>/dev/null; then
    log_success "MySQL 연결 성공!"
else
    log_error "MySQL 연결 실패"
    log_info "추가 로그 확인:"
    docker logs --tail=20 his_db
fi

echo "================================"
log_info "문제 해결 완료" 