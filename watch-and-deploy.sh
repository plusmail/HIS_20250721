#!/bin/bash

# 파일 변경 감지 및 자동 배포 스크립트
# 사용법: ./watch-and-deploy.sh

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

# 감시할 디렉토리들
WATCH_DIRS=("src" "pom.xml")
EXCLUDE_PATTERNS=("*.log" "*.tmp" "target/*" ".git/*" "*.swp" "*.swo")

# inotifywait 설치 확인
check_inotify() {
    if ! command -v inotifywait &> /dev/null; then
        log_error "inotifywait가 설치되지 않았습니다."
        log_info "Ubuntu/Debian: sudo apt-get install inotify-tools"
        log_info "CentOS/RHEL: sudo yum install inotify-tools"
        exit 1
    fi
}

# 배포 함수
deploy() {
    log_info "파일 변경 감지됨. 배포 시작..."
    
    # JAR 빌드
    if ./mvnw clean package -DskipTests; then
        log_success "JAR 빌드 완료"
    else
        log_error "JAR 빌드 실패"
        return 1
    fi
    
    # 컨테이너 재시작
    if docker-compose restart webapp; then
        log_success "컨테이너 재시작 완료"
    else
        log_error "컨테이너 재시작 실패"
        return 1
    fi
    
    # 상태 확인
    sleep 5
    if docker ps | grep -q his_server; then
        log_success "배포 완료! http://localhost:8092"
    else
        log_error "배포 실패 - 컨테이너가 실행되지 않음"
        return 1
    fi
}

# 파일 변경 감지
watch_files() {
    log_info "파일 변경 감지 시작... (Ctrl+C로 종료)"
    log_info "감시 중인 디렉토리: ${WATCH_DIRS[*]}"
    
    # inotifywait 명령어 구성
    local watch_cmd="inotifywait -m -r -e modify,create,delete,move"
    
    # 제외 패턴 추가
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        watch_cmd="$watch_cmd --exclude '$pattern'"
    done
    
    # 감시할 디렉토리 추가
    for dir in "${WATCH_DIRS[@]}"; do
        watch_cmd="$watch_cmd $dir"
    done
    
    # 파일 변경 감지 및 배포
    eval $watch_cmd | while read -r directory events filename; do
        log_info "변경 감지: $directory$filename ($events)"
        
        # 중복 실행 방지 (2초 대기)
        sleep 2
        
        # 배포 실행
        deploy
    done
}

# 메인 함수
main() {
    log_info "HIS 자동 배포 감시 시작"
    
    # 의존성 확인
    check_inotify
    
    # 초기 배포
    log_info "초기 배포 실행..."
    deploy
    
    # 파일 감시 시작
    watch_files
}

# 시그널 핸들러
cleanup() {
    log_info "감시 중지..."
    exit 0
}

trap cleanup SIGINT SIGTERM

# 스크립트 실행
main "$@" 