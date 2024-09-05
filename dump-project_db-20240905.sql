-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: project_db
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '이름',
  `first_resident` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '주민등록번호 앞자리',
  `last_resident` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '주민등록번호 뒷자리',
  `division` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '구분(의사/간호사/어드민 등)',
  `EmployeeID` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '사번',
  `hire_date` date NOT NULL COMMENT '입사일',
  `addr` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '주소',
  `birth_date` date NOT NULL COMMENT '생년월일',
  `license_num` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '면허번호',
  `leave_date` date DEFAULT NULL COMMENT '퇴사일',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '연락처',
  `gender` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '성별',
  `emp_status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '재직여부(재직/휴직/퇴사 등)',
  PRIMARY KEY (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_chart`
--

DROP TABLE IF EXISTS `medical_chart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_chart` (
  `pa_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '환자명',
  `chart_num` int NOT NULL COMMENT '차트번호',
  `md_time` date NOT NULL COMMENT '진료일',
  `medical_division` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '진료구분',
  `teeth_num` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '치식선택',
  `medical_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '진료내용',
  PRIMARY KEY (`chart_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_chart`
--

LOCK TABLES `medical_chart` WRITE;
/*!40000 ALTER TABLE `medical_chart` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_chart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_admissions`
--

DROP TABLE IF EXISTS `patient_admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_admissions` (
  `chart_num` int NOT NULL COMMENT '차트번호',
  `pa_name` varchar(20) NOT NULL COMMENT '환자이름',
  `main_doc` varchar(20) DEFAULT NULL COMMENT '담당의',
  `rv_time` date DEFAULT NULL COMMENT '예약시간',
  `vi_time` date DEFAULT NULL COMMENT '접수시간',
  `treat_status` varchar(100) DEFAULT NULL COMMENT '방문사유(충치검진/충치치료 등)',
  PRIMARY KEY (`chart_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_admissions`
--

LOCK TABLES `patient_admissions` WRITE;
/*!40000 ALTER TABLE `patient_admissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_appointments`
--

DROP TABLE IF EXISTS `patient_appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_appointments` (
  `reservation_date` date DEFAULT NULL COMMENT '예약일자',
  `rv_type` varchar(20) DEFAULT NULL COMMENT '예약종류',
  `pa_name` varchar(20) NOT NULL COMMENT '환자명',
  `chart_num` int NOT NULL AUTO_INCREMENT COMMENT '차트번호',
  `main_doc` varchar(20) DEFAULT NULL COMMENT '전담의',
  `dental_hygienist` varchar(20) DEFAULT NULL COMMENT '치위생사',
  `rv_time` date DEFAULT NULL COMMENT '예약시간',
  `md_time` date DEFAULT NULL COMMENT '진료시간',
  `medical_type` varchar(100) DEFAULT NULL COMMENT '진료종류',
  `pa_info` text COMMENT '노트',
  `notice` text COMMENT '참고사항',
  `rv_non` varchar(20) DEFAULT NULL COMMENT '예약미이행(없음/취소/잠수)',
  `rv_info` varchar(100) DEFAULT NULL COMMENT '추후 함수 사용하여 필요한 데이터 가공 및 도출할것',
  `last_reserv` date DEFAULT NULL COMMENT '최종예약일',
  `first_visit` date DEFAULT NULL COMMENT '최초내원일',
  `last_visit` date DEFAULT NULL COMMENT '최종내원일',
  PRIMARY KEY (`chart_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_appointments`
--

LOCK TABLES `patient_appointments` WRITE;
/*!40000 ALTER TABLE `patient_appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `pa_photo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '사진저장경로',
  `pa_foreign_check` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '내외국인',
  `pa_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '환자명',
  `first_pa_resident_num` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '환자 주민등록번호 앞자리',
  `last_pa_resident_num` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '환자 주민등록번호 뒷자리',
  `chart_num` int NOT NULL AUTO_INCREMENT COMMENT '차트번호(자동생성)',
  `pa_gender` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '성별',
  `pa_phone_num` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '휴대폰번호',
  `pa_email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '이메일',
  `main_doc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '주치의(신환 미등록)',
  `visit_path` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '내원유형(소개,인터넷 등)',
  `pa_category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '고객분류',
  `pa_tendency` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '성향',
  `first_visit` date DEFAULT NULL COMMENT '최초방문일',
  `last_visit` date DEFAULT NULL COMMENT '최종방문일(금일)',
  PRIMARY KEY (`chart_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'project_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-05 18:00:45
