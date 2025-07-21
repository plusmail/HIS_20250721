#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# 1. 백엔드 디렉토리로 이동 (필요시 수정)
BACKEND_DIR="."
log_info "백엔드 디렉토리로 이동: $BACKEND_DIR"
cd "$BACKEND_DIR" || { log_error "디렉토리 이동 실패: $BACKEND_DIR"; exit 1; }

# 2. docker-compose.yml에서 webapp의 container_name 추출
CONTAINER_NAME=$(awk '/webapp:/, /container_name:/ {if ($1=="container_name:") print $2}' docker-compose.yml | head -n1)
if [ -z "$CONTAINER_NAME" ]; then
    log_error "docker-compose.yml에서 webapp의 container_name을 찾을 수 없습니다."
    exit 1
fi
log_info "webapp 컨테이너 이름: $CONTAINER_NAME"

# 3. target 디렉토리 완전 삭제 및 재생성 (JAR 파일/디렉토리 꼬임 방지)
log_info "target 디렉토리 완전 삭제 및 재생성 중..."
rm -rf target/
mkdir -p target

# 4. Maven으로 JAR 파일 빌드
log_info "Maven으로 JAR 파일 빌드 중..."
if ./mvnw clean package -DskipTests; then
    log_success "JAR 파일 빌드 완료"
else
    log_error "JAR 파일 빌드 실패"
    exit 1
fi

# 5. 빌드된 JAR 파일 찾기
JAR_FILE=$(find target -name "*.jar" -type f | head -n 1)
if [ -z "$JAR_FILE" ]; then
    log_error "빌드된 JAR 파일을 찾을 수 없습니다"
    exit 1
fi
log_info "빌드된 JAR 파일: $JAR_FILE"

# 6. 컨테이너가 존재하면 stop 후 완전 삭제
if sudo docker ps -a | grep "$CONTAINER_NAME" > /dev/null; then
    if sudo docker ps | grep -q "$CONTAINER_NAME"; then
        log_info "컨테이너가 실행 중입니다. 중지합니다."
        sudo docker stop "$CONTAINER_NAME"
        for i in {1..20}; do
            if ! sudo docker ps | grep -q "$CONTAINER_NAME"; then
                log_info "컨테이너가 완전히 중지됨. (대기 ${i}s)"
                break
            fi
            log_info "컨테이너 종료 대기 중... (${i}/20)"
            sleep 1
        done
    fi
    log_info "컨테이너 완전 삭제 중..."
    sudo docker rm "$CONTAINER_NAME"
fi

# 7. JAR 파일을 임시로 복사 (docker-compose build context에 포함되도록)
log_info "JAR 파일을 임시 디렉토리로 복사..."
cp "$JAR_FILE" ./app.jar

# 8. 컨테이너 재생성 (up -d webapp)
log_info "컨테이너 재생성 중..."
sudo docker-compose up -d webapp
sleep 5

# 9. 임시 JAR 파일 삭제
rm -f ./app.jar

# 10. 컨테이너 상태 확인
log_info "컨테이너 상태 확인 중..."
if sudo docker ps | grep -q "$CONTAINER_NAME"; then
    log_success "배포 완료! 서비스가 정상적으로 실행 중입니다."
else
    log_error "배포 실패! 컨테이너가 정상적으로 실행되지 않았습니다."
    log_info "로그를 확인하려면: sudo docker logs $CONTAINER_NAME"
    exit 1
fi

# 11. 로그 확인 (선택사항)
read -p "최근 로그를 확인하시겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "최근 로그 출력:"
    sudo docker logs --tail 20 "$CONTAINER_NAME"
fi 