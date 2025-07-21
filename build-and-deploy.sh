#!/bin/bash

# HIS 애플리케이션 빌드 및 배포 스크립트
# 사용법: ./build-and-deploy.sh [옵션]
# 옵션: --rebuild (전체 이미지 재빌드), --restart-only (재시작만)

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 변수 설정
JAR_FILE="target/his-0.0.1-SNAPSHOT.jar"
CONTAINER_NAME="his_server"
SERVICE_NAME="webapp"

# 함수: JAR 파일 빌드
build_jar() {
    log_info "Maven JAR 파일 빌드 중..."
    
    if ./mvnw clean package -DskipTests; then
        log_success "JAR 파일 빌드 완료: $JAR_FILE"
    else
        log_error "JAR 파일 빌드 실패"
        exit 1
    fi
}

# 함수: JAR 파일 존재 확인
check_jar_exists() {
    if [ ! -f "$JAR_FILE" ]; then
        log_error "JAR 파일을 찾을 수 없습니다: $JAR_FILE"
        log_info "JAR 파일을 먼저 빌드해주세요."
        exit 1
    fi
}

# 함수: Docker 컨테이너 재시작
restart_container() {
    log_info "Docker 컨테이너 재시작 중..."
    
    if docker-compose restart $SERVICE_NAME; then
        log_success "컨테이너 재시작 완료"
    else
        log_error "컨테이너 재시작 실패"
        exit 1
    fi
}

# 함수: 전체 Docker 이미지 재빌드
rebuild_image() {
    log_info "Docker 이미지 재빌드 중..."
    
    if docker-compose build --no-cache $SERVICE_NAME; then
        log_success "Docker 이미지 재빌드 완료"
    else
        log_error "Docker 이미지 재빌드 실패"
        exit 1
    fi
}

# 함수: 컨테이너 상태 확인
check_container_status() {
    log_info "컨테이너 상태 확인 중..."
    
    if docker ps | grep -q $CONTAINER_NAME; then
        log_success "컨테이너가 정상적으로 실행 중입니다"
        
        # 애플리케이션 로그 확인
        log_info "최근 애플리케이션 로그:"
        docker logs --tail=10 $CONTAINER_NAME
    else
        log_error "컨테이너가 실행되지 않았습니다"
        exit 1
    fi
}

# 함수: 전체 서비스 시작
start_services() {
    log_info "전체 서비스 시작 중..."
    
    if docker-compose up -d; then
        log_success "전체 서비스 시작 완료"
    else
        log_error "서비스 시작 실패"
        exit 1
    fi
}

# 메인 로직
main() {
    log_info "HIS 애플리케이션 배포 시작"
    
    case "${1:-}" in
        "--rebuild")
            log_info "전체 이미지 재빌드 모드"
            build_jar
            rebuild_image
            start_services
            ;;
        "--restart-only")
            log_info "재시작만 모드"
            check_jar_exists
            restart_container
            ;;
        "--start")
            log_info "전체 서비스 시작 모드"
            start_services
            ;;
        *)
            log_info "기본 모드: JAR 빌드 후 재시작"
            build_jar
            restart_container
            ;;
    esac
    
    # 잠시 대기 후 상태 확인
    sleep 5
    check_container_status
    
    log_success "배포 완료! 애플리케이션에 접속하세요: http://localhost:8092"
}

# 스크립트 실행
main "$@" 