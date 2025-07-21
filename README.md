# HIS 병원정보시스템

## 🏥 프로젝트 개요
HIS(Hospital Information System)는 병원 업무를 효율적으로 관리할 수 있는 웹 기반 시스템입니다.

## 🚀 빠른 시작

### 1. Docker Compose를 이용한 실행 (권장)

#### 전체 서비스 시작
```bash
./start-his.sh
```

#### 소스 코드만 갱신하고 재시작
```bash
./update-source.sh
```

### 2. 수동 실행

#### 1) Maven 빌드
```bash
./mvnw clean package -DskipTests
```

#### 2) Docker Compose 실행
```bash
docker-compose up -d
```

## 📋 서비스 구성

| 서비스 | 포트 | 설명 |
|--------|------|------|
| HIS 애플리케이션 | 8092 | Spring Boot 웹 애플리케이션 |
| MySQL | 53306 | 데이터베이스 |
| Redis | 6379 | 캐시 및 세션 저장소 |

## 🔐 테스트 계정

| 계정 | 비밀번호 | 권한 | 설명 |
|------|----------|------|------|
| user1 | 1111 | ADMIN | 관리자 (사용자관리 기능 포함) |
| user2 | 1111 | DOCTOR | 의사 (진료접수 기능) |

## 🛠️ 개발 환경

### 필수 요구사항
- Docker & Docker Compose
- Java 21
- Maven 3.6+

### 주요 기술 스택
- **Backend**: Spring Boot 3.x, Spring Security, JPA/Hibernate
- **Frontend**: Thymeleaf, Bootstrap, jQuery
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Build Tool**: Maven

## 📁 프로젝트 구조

```
HIS_20250721/
├── src/                    # 소스 코드
│   ├── main/
│   │   ├── java/          # Java 소스
│   │   └── resources/     # 설정 파일 및 템플릿
├── db/                     # 데이터베이스 관련
│   ├── data/              # MySQL 데이터
│   └── init/              # 초기화 SQL
├── docker-compose.yml     # Docker Compose 설정
├── Dockerfile             # Docker 이미지 설정
├── start-his.sh          # 전체 서비스 시작 스크립트
├── update-source.sh      # 소스 코드 갱신 스크립트
└── README.md             # 프로젝트 문서
```

## 🔧 유용한 명령어

### 컨테이너 관리
```bash
# 전체 서비스 시작
docker-compose up -d

# 특정 서비스만 재시작
docker-compose restart his_app

# 서비스 중지
docker-compose down

# 로그 확인
docker-compose logs -f his_app
```

### 개발 도구
```bash
# Maven 빌드
./mvnw clean package

# 테스트 실행
./mvnw test

# 애플리케이션 실행 (로컬)
./mvnw spring-boot:run
```

## 🐛 문제 해결

### 로그인 문제
1. 데이터베이스 연결 확인
2. Redis 연결 확인
3. 애플리케이션 로그 확인: `docker-compose logs his_app`

### 포트 충돌
- 8092, 53306, 6379 포트가 사용 중인지 확인
- 다른 포트 사용 시 `docker-compose.yml` 수정

### 데이터베이스 초기화
```bash
# 데이터베이스 컨테이너 재시작
docker-compose restart his_mysql

# 초기화 SQL 실행 확인
docker-compose logs his_mysql
```

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. Docker 및 Docker Compose 버전
2. 시스템 리소스 (메모리, 디스크 공간)
3. 방화벽 설정
4. 애플리케이션 로그

## 📄 라이선스

이 프로젝트는 내부 개발용으로 제작되었습니다.
