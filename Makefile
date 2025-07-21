# HIS 병원업무관리시스템 Makefile

.PHONY: help build deploy quick-deploy watch clean logs status restart stop start rebuild

# 기본 타겟
help:
	@echo "HIS 병원업무관리시스템 - 사용 가능한 명령어:"
	@echo ""
	@echo "  build        - JAR 파일 빌드"
	@echo "  deploy       - 전체 배포 (빌드 + 재시작)"
	@echo "  quick-deploy - 빠른 배포 (권장)"
	@echo "  watch        - 파일 변경 감지 자동 배포"
	@echo "  rebuild      - 전체 Docker 이미지 재빌드"
	@echo ""
	@echo "  start        - 전체 서비스 시작"
	@echo "  stop         - 전체 서비스 중지"
	@echo "  restart      - 애플리케이션 재시작"
	@echo ""
	@echo "  logs         - 애플리케이션 로그 확인"
	@echo "  status       - 컨테이너 상태 확인"
	@echo "  clean        - 정리 (컨테이너, 이미지, 볼륨)"
	@echo ""
	@echo "  help         - 이 도움말 표시"

# JAR 파일 빌드
build:
	@echo "📦 JAR 파일 빌드 중..."
	./mvnw clean package -DskipTests
	@echo "✅ 빌드 완료"

# 전체 배포
deploy: build restart
	@echo "✅ 배포 완료"

# 빠른 배포
quick-deploy:
	@echo "🚀 빠른 배포 시작..."
	./quick-deploy.sh

# 자동 배포 (파일 변경 감지)
watch:
	@echo "👀 파일 변경 감지 시작..."
	./watch-and-deploy.sh

# 전체 재빌드
rebuild:
	@echo "🔨 전체 재빌드 시작..."
	./build-and-deploy.sh --rebuild

# 서비스 시작
start:
	@echo "🚀 서비스 시작..."
	./build-and-deploy.sh --start

# 서비스 중지
stop:
	@echo "🛑 서비스 중지..."
	docker-compose down

# 애플리케이션 재시작
restart:
	@echo "🔄 애플리케이션 재시작..."
	docker-compose restart webapp

# 로그 확인
logs:
	@echo "📋 애플리케이션 로그:"
	docker-compose logs --tail=20 webapp

# 실시간 로그
logs-f:
	@echo "📋 실시간 로그 (Ctrl+C로 종료):"
	docker-compose logs -f webapp

# 상태 확인
status:
	@echo "📊 컨테이너 상태:"
	docker-compose ps

# 정리
clean:
	@echo "🧹 정리 중..."
	@echo "⚠️  모든 컨테이너, 이미지, 볼륨이 삭제됩니다!"
	@read -p "계속하시겠습니까? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	docker-compose down -v --rmi all
	docker system prune -f
	@echo "✅ 정리 완료"

# 개발 모드 (자동 배포)
dev: watch

# 프로덕션 배포
prod: build rebuild

# 디버그 모드
debug:
	@echo "🐛 디버그 정보:"
	@echo "Docker 버전: $(shell docker --version)"
	@echo "Docker Compose 버전: $(shell docker-compose --version)"
	@echo "Java 버전: $(shell java -version 2>&1 | head -n 1)"
	@echo "Maven 버전: $(shell ./mvnw --version 2>/dev/null | head -n 1 || echo 'Maven not found')"
	@echo ""
	@echo "시스템 정보:"
	@echo "메모리: $(shell free -h | grep Mem | awk '{print $$2}')"
	@echo "디스크: $(shell df -h . | tail -1 | awk '{print $$4}') 사용 가능" 