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

# 3. Maven으로 JAR 파일 빌드
log_info "Maven으로 JAR 파일 빌드 중..."
if ./mvnw clean package -DskipTests; then
    log_success "JAR 파일 빌드 완료"
else
    log_error "JAR 파일 빌드 실패"
    exit 1
fi

# 4. 빌드된 JAR 파일 찾기
JAR_FILE=$(find target -name "*.jar" -type f | head -n 1)
if [ -z "$JAR_FILE" ]; then
    log_error "빌드된 JAR 파일을 찾을 수 없습니다"
    exit 1
fi
log_info "빌드된 JAR 파일: $JAR_FILE"

# 5. 컨테이너가 실행 중이면 stop
if sudo docker ps | grep -q "$CONTAINER_NAME"; then
    log_info "컨테이너가 실행 중입니다. 중지합니다."
    sudo docker stop "$CONTAINER_NAME"
fi

# 6. 컨테이너가 존재하지 않으면 up -d webapp
if ! sudo docker ps -a | grep "$CONTAINER_NAME" > /dev/null; then
    log_warning "컨테이너($CONTAINER_NAME)가 존재하지 않습니다. 자동으로 실행합니다."
    sudo docker-compose up -d webapp
    sleep 5
fi

# 7. JAR 파일을 컨테이너에 복사
log_info "JAR 파일을 컨테이너에 복사 중..."
if sudo docker cp "$JAR_FILE" "$CONTAINER_NAME":/apps/app.jar; then
    log_success "JAR 파일 복사 완료"
else
    log_error "JAR 파일 복사 실패"
    exit 1
fi

# 8. 컨테이너 시작
log_info "컨테이너 시작 중..."
sudo docker start "$CONTAINER_NAME"
sleep 5

# 9. 컨테이너 상태 확인
log_info "컨테이너 상태 확인 중..."
if sudo docker ps | grep -q "$CONTAINER_NAME"; then
    log_success "배포 완료! 서비스가 정상적으로 실행 중입니다."
else
    log_error "배포 실패! 컨테이너가 정상적으로 실행되지 않았습니다."
    log_info "로그를 확인하려면: sudo docker logs $CONTAINER_NAME"
    exit 1
fi

# 10. 로그 확인 (선택사항)
read -p "최근 로그를 확인하시겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "최근 로그 출력:"
    sudo docker logs --tail 20 "$CONTAINER_NAME"
fi 