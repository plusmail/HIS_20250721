#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 메뉴 표시 함수
show_menu() {
    echo ""
    echo -e "${BLUE}🏥 HIS 병원정보시스템 Docker Compose 시작${NC}"
    echo ""
    echo -e "${YELLOW}실행 옵션을 선택하세요:${NC}"
    echo "1) 전체 서비스 시작 (MySQL + Redis + HIS)"
    echo "2) HIS 애플리케이션만 재시작"
    echo "3) 데이터베이스만 재시작"
    echo "4) Redis만 재시작"
    echo "5) 모든 서비스 중지"
    echo "6) 로그 확인"
    echo "7) 종료"
    echo ""
    read -p "선택 (1-7): " choice
}

# 전체 서비스 시작 함수
start_all_services() {
    echo -e "${GREEN}🚀 전체 서비스 시작 중...${NC}"
    
    # 필요한 디렉토리 생성
    echo "📁 필요한 디렉토리 생성 중..."
    mkdir -p db/data
    mkdir -p redis/data

    # 기존 컨테이너 정리
    echo "🧹 기존 컨테이너 정리 중..."
    docker-compose down

    # 컨테이너 시작
    echo "🚀 컨테이너 시작 중..."
    docker-compose up -d

    # 서비스 상태 확인
    echo "⏳ 서비스 시작 대기 중..."
    sleep 10
}

# HIS 애플리케이션만 재시작 함수
restart_his_app() {
    echo -e "${GREEN}🔄 HIS 애플리케이션 재시작 중...${NC}"
    
    # HIS 컨테이너만 재시작
    echo "🔄 HIS 애플리케이션 컨테이너 재시작 중..."
    docker-compose restart his_app
    
    echo "⏳ 애플리케이션 시작 대기 중..."
    sleep 5
}

# 데이터베이스만 재시작 함수
restart_database() {
    echo -e "${GREEN}🔄 데이터베이스 재시작 중...${NC}"
    
    # MySQL 컨테이너만 재시작
    echo "🔄 MySQL 컨테이너 재시작 중..."
    docker-compose restart his_mysql
    
    echo "⏳ 데이터베이스 시작 대기 중..."
    sleep 10
}

# Redis만 재시작 함수
restart_redis() {
    echo -e "${GREEN}🔄 Redis 재시작 중...${NC}"
    
    # Redis 컨테이너만 재시작
    echo "🔄 Redis 컨테이너 재시작 중..."
    docker-compose restart his_redis
    
    echo "⏳ Redis 시작 대기 중..."
    sleep 3
}

# 모든 서비스 중지 함수
stop_all_services() {
    echo -e "${YELLOW}🛑 모든 서비스 중지 중...${NC}"
    docker-compose down
    echo "✅ 모든 서비스가 중지되었습니다."
}

# 로그 확인 함수
show_logs() {
    echo ""
    echo -e "${BLUE}📋 로그 확인 옵션:${NC}"
    echo "1) HIS 애플리케이션 로그"
    echo "2) MySQL 로그"
    echo "3) Redis 로그"
    echo "4) 모든 서비스 로그"
    echo "5) 실시간 로그 모니터링"
    echo "6) 이전 메뉴로 돌아가기"
    echo ""
    read -p "선택 (1-6): " log_choice
    
    case $log_choice in
        1)
            echo -e "${GREEN}📋 HIS 애플리케이션 로그:${NC}"
            docker-compose logs his_app
            ;;
        2)
            echo -e "${GREEN}📋 MySQL 로그:${NC}"
            docker-compose logs his_mysql
            ;;
        3)
            echo -e "${GREEN}📋 Redis 로그:${NC}"
            docker-compose logs his_redis
            ;;
        4)
            echo -e "${GREEN}📋 모든 서비스 로그:${NC}"
            docker-compose logs
            ;;
        5)
            echo -e "${GREEN}📋 실시간 로그 모니터링 (Ctrl+C로 종료):${NC}"
            docker-compose logs -f
            ;;
        6)
            return
            ;;
        *)
            echo -e "${RED}❌ 잘못된 선택입니다.${NC}"
            ;;
    esac
}

# 상태 확인 및 정보 표시 함수
show_status() {
    echo ""
    echo -e "${GREEN}📊 컨테이너 상태 확인 중...${NC}"
    docker-compose ps

    echo ""
    echo -e "${GREEN}🎉 HIS 병원정보시스템이 성공적으로 시작되었습니다!${NC}"
    echo ""
    echo -e "${BLUE}📱 접속 정보:${NC}"
    echo "   - HIS 웹 애플리케이션: http://docs.yi.or.kr:8092"
    echo "   - MySQL 데이터베이스: docs.yi.or.kr:53306"
    echo "   - Redis: localhost:6379"
    echo ""
    echo -e "${BLUE}🔐 테스트 계정:${NC}"
    echo "   - 관리자 계정: user1 / 1111 (ADMIN 권한)"
    echo "   - 의사 계정: user2 / 1111 (DOCTOR 권한)"
    echo ""
    echo -e "${BLUE}📋 유용한 명령어:${NC}"
    echo "   - 로그 확인: docker-compose logs -f [서비스명]"
    echo "   - 컨테이너 중지: docker-compose down"
    echo "   - 컨테이너 재시작: docker-compose restart"
    echo ""
}

# 메인 실행 로직
main() {
    while true; do
        show_menu
        
        case $choice in
            1)
                start_all_services
                show_status
                break
                ;;
            2)
                restart_his_app
                show_status
                break
                ;;
            3)
                restart_database
                show_status
                break
                ;;
            4)
                restart_redis
                show_status
                break
                ;;
            5)
                stop_all_services
                break
                ;;
            6)
                show_logs
                ;;
            7)
                echo -e "${YELLOW}👋 종료합니다.${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 잘못된 선택입니다. 1-7 중에서 선택해주세요.${NC}"
                ;;
        esac
    done
}

# 스크립트 실행
main 