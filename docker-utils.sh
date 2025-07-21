#!/bin/bash

# Docker 유틸리티 스크립트
# 사용법: source docker-utils.sh

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 로그 함수
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 컨테이너 상태 확인
check_status() {
    log_info "컨테이너 상태 확인:"
    docker-compose ps
}

# 로그 확인
show_logs() {
    local service=${1:-webapp}
    local lines=${2:-20}
    log_info "$service 서비스 로그 (최근 $lines줄):"
    docker-compose logs --tail=$lines $service
}

# 컨테이너 재시작
restart_service() {
    local service=${1:-webapp}
    log_info "$service 서비스 재시작 중..."
    docker-compose restart $service
    log_success "$service 서비스 재시작 완료"
}

# 전체 서비스 중지
stop_all() {
    log_info "전체 서비스 중지 중..."
    docker-compose down
    log_success "전체 서비스 중지 완료"
}

# 전체 서비스 시작
start_all() {
    log_info "전체 서비스 시작 중..."
    docker-compose up -d
    log_success "전체 서비스 시작 완료"
}

# 컨테이너 내부 접속
exec_bash() {
    local service=${1:-webapp}
    log_info "$service 컨테이너에 접속 중..."
    docker-compose exec $service bash
}

# 볼륨 정리
clean_volumes() {
    log_warning "모든 볼륨을 삭제합니다. 데이터가 손실됩니다!"
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        log_success "볼륨 정리 완료"
    else
        log_info "볼륨 정리 취소됨"
    fi
}

# 이미지 정리
clean_images() {
    log_warning "사용하지 않는 Docker 이미지를 삭제합니다!"
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker image prune -f
        log_success "이미지 정리 완료"
    else
        log_info "이미지 정리 취소됨"
    fi
}

# 시스템 정보
system_info() {
    log_info "Docker 시스템 정보:"
    echo "Docker 버전: $(docker --version)"
    echo "Docker Compose 버전: $(docker-compose --version)"
    echo "사용 가능한 디스크 공간:"
    df -h .
    echo "메모리 사용량:"
    free -h
}

# 도움말
show_help() {
    echo "사용 가능한 함수들:"
    echo "  check_status     - 컨테이너 상태 확인"
    echo "  show_logs [service] [lines] - 로그 확인"
    echo "  restart_service [service] - 서비스 재시작"
    echo "  stop_all        - 전체 서비스 중지"
    echo "  start_all       - 전체 서비스 시작"
    echo "  exec_bash [service] - 컨테이너 내부 접속"
    echo "  clean_volumes   - 볼륨 정리"
    echo "  clean_images    - 이미지 정리"
    echo "  system_info     - 시스템 정보"
    echo "  show_help       - 도움말"
}

# 스크립트 로드 시 도움말 표시
echo "Docker 유틸리티 로드됨. 'show_help'를 입력하여 사용법을 확인하세요." 