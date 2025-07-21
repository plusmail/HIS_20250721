#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 HIS 소스 코드 갱신 및 재시작${NC}"
echo ""

# 1. Maven 빌드
echo -e "${GREEN}🔨 Maven 빌드 중...${NC}"
./mvnw clean compile -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Maven 빌드 성공"
else
    echo -e "${RED}❌ Maven 빌드 실패${NC}"
    exit 1
fi

# 2. HIS 애플리케이션 컨테이너 재시작
echo -e "${GREEN}🔄 HIS 애플리케이션 재시작 중...${NC}"
docker-compose restart his_app

if [ $? -eq 0 ]; then
    echo "✅ HIS 애플리케이션 재시작 성공"
else
    echo -e "${RED}❌ HIS 애플리케이션 재시작 실패${NC}"
    exit 1
fi

# 3. 서비스 상태 확인
echo ""
echo -e "${GREEN}⏳ 서비스 시작 대기 중...${NC}"
sleep 10

echo ""
echo -e "${GREEN}📊 컨테이너 상태 확인:${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}🎉 소스 코드 갱신 완료!${NC}"
echo -e "${BLUE}📱 접속: http://localhost:8092${NC}"
echo ""
echo -e "${YELLOW}💡 로그 확인: docker-compose logs -f his_app${NC}" 