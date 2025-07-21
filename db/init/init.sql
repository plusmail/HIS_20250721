-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: docs.yi.or.kr    Database: his
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

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
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `bno` bigint NOT NULL AUTO_INCREMENT,
  `moddate` datetime(6) DEFAULT NULL,
  `regdate` datetime(6) DEFAULT NULL,
  `content` varchar(2000) NOT NULL,
  `title` varchar(200) NOT NULL,
  `writer` varchar(50) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`bno`)
) ENGINE=InnoDB AUTO_INCREMENT=409 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES (387,'2024-11-14 00:29:15.883162','2024-11-14 00:29:15.883162','징검다리 연휴에 연차 사용은 가급적 자제 바랍니다.','연차 사용 관련 공지입니다.','이재준',NULL,NULL),(388,'2024-11-14 00:32:42.960325','2024-11-14 00:32:08.907606','11월은 휴진 없이 진료합니다.\r\n\r\n진료 및 내원에 참고하시어 착오 없으시길 바랍니다.','11월 진료안내','이재준',NULL,NULL),(389,'2024-11-14 00:33:44.210824','2024-11-14 00:33:31.659527','치과 원장 김관호 원장님을 모시게 되었습니다.\r\n\r\n많은 관심과 성원 부탁드립니다. ','김관호 새 원장님 초빙 안내문','이재준',NULL,NULL),(390,'2024-11-14 00:40:49.935576','2024-11-14 00:40:49.935576','안녕하세요. \r\n\r\n리뉴얼 홈페이지 오픈 하였습니다.','홈페이지 리뉴얼 안내','백지영',NULL,NULL),(391,'2024-11-14 00:42:57.888468','2024-11-14 00:42:43.136207','11월 26일에 세미나 일정이 있으니 진료예약시 참고바랍니다.','김관호 원장님 세미나 일정 안내','백지영',NULL,NULL),(392,'2024-11-14 00:43:39.619446','2024-11-14 00:43:39.619446','금요일 9:00~17:30에서 9:30~16:00으로 변경되었습니다. 참고바랍니다.','최선아 원장님 진료시간 변경','백지영',NULL,NULL),(393,'2024-11-14 00:43:54.157113','2024-11-14 00:43:54.157113','다들 확인 바랍니다.','환자 응대 메뉴얼','백지영',NULL,NULL),(394,'2024-11-14 00:44:49.696979','2024-11-14 00:44:49.696979','접수시 꼭 확인바랍니다.','11월부터 환자 접수시 신분증 필수 지참입니다.','백지영',NULL,NULL),(395,'2024-11-14 11:13:38.077865','2024-11-14 00:45:38.552119','최소보관수량 미달품목은 진료에 차질이 없도록 사전에 주문 바랍니다.','재료충당관련','백지영',NULL,NULL),(396,'2024-11-14 00:46:31.470469','2024-11-14 00:46:31.470469','요근래 보험청구 오류가 늘고 있습니다. 다들 청구전 꼼꼼한 확인 바랍니다.','보험 청구 관련 오류','이재준',NULL,NULL),(397,'2024-11-14 00:47:13.818653','2024-11-14 00:47:13.818653','18일부터 기본 진료비 수가가 인상되니 참고바랍니다.','진료 수가 인상','이재준',NULL,NULL),(398,'2024-11-14 00:48:47.659451','2024-11-14 00:48:47.659451','보호자분이 오실 경우 반드시 환자 동의서가 필요합니다.\r\n보호자의 신분증과 대리 발급 서류 확인해주세요','치과 서류 발급 관련 안내','이재준',NULL,NULL);
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chart_memo`
--

DROP TABLE IF EXISTS `chart_memo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chart_memo` (
  `memo` varchar(255) NOT NULL,
  `doc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`memo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chart_memo`
--

LOCK TABLES `chart_memo` WRITE;
/*!40000 ALTER TABLE `chart_memo` DISABLE KEYS */;
INSERT INTO `chart_memo` VALUES ('','의사'),('1','의사'),('1₩23123123','의사'),('111111121','의사'),('123123','의사'),('asdfafd','의사'),('bbbb','의사'),('메모2','닥터'),('메모3','닥터'),('메모4','닥터'),('메모추가','의사'),('메모추가1','의사'),('메모추가123123','의사'),('메모추가확인','닥터');
/*!40000 ALTER TABLE `chart_memo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `message_id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `chat_room_id` bigint DEFAULT NULL,
  `recipient_id` varchar(255) DEFAULT NULL,
  `sender_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `FKj52yap2xrm9u0721dct0tjor9` (`chat_room_id`),
  KEY `FKjlmv2e301q45pnax6anhduane` (`recipient_id`),
  KEY `FKboji3uvm7ajilw93odmaau88q` (`sender_id`),
  CONSTRAINT `FKboji3uvm7ajilw93odmaau88q` FOREIGN KEY (`sender_id`) REFERENCES `member` (`mid`),
  CONSTRAINT `FKj52yap2xrm9u0721dct0tjor9` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room` (`id`),
  CONSTRAINT `FKjlmv2e301q45pnax6anhduane` FOREIGN KEY (`recipient_id`) REFERENCES `member` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=234 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room`
--

DROP TABLE IF EXISTS `chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_message` varchar(255) DEFAULT NULL,
  `last_message_timestamp` datetime(6) DEFAULT NULL,
  `room_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room`
--

LOCK TABLES `chat_room` WRITE;
/*!40000 ALTER TABLE `chat_room` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_member_mids`
--

DROP TABLE IF EXISTS `chat_room_member_mids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_member_mids` (
  `chat_room_id` bigint NOT NULL,
  `member_mids` varchar(255) DEFAULT NULL,
  KEY `FKgwed1mtjk98hs30ae7ila7ry4` (`chat_room_id`),
  CONSTRAINT `FKgwed1mtjk98hs30ae7ila7ry4` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_member_mids`
--

LOCK TABLES `chat_room_member_mids` WRITE;
/*!40000 ALTER TABLE `chat_room_member_mids` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room_member_mids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_members`
--

DROP TABLE IF EXISTS `chat_room_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_members` (
  `chat_room_id` bigint NOT NULL,
  `member_mid` varchar(255) NOT NULL,
  PRIMARY KEY (`chat_room_id`,`member_mid`),
  KEY `FKnx7b3nh8pm51e2rf0usflgjyo` (`member_mid`),
  CONSTRAINT `FK4yp21jl4obii8479tewtkd122` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room` (`id`),
  CONSTRAINT `FKnx7b3nh8pm51e2rf0usflgjyo` FOREIGN KEY (`member_mid`) REFERENCES `member` (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_members`
--

LOCK TABLES `chat_room_members` WRITE;
/*!40000 ALTER TABLE `chat_room_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room_recipient_ids`
--

DROP TABLE IF EXISTS `chat_room_recipient_ids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_recipient_ids` (
  `chat_room_id` bigint NOT NULL,
  `recipient_ids` varchar(255) DEFAULT NULL,
  KEY `FKeg86ap40wxwefsejprvtd74f3` (`chat_room_id`),
  CONSTRAINT `FKeg86ap40wxwefsejprvtd74f3` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_recipient_ids`
--

LOCK TABLES `chat_room_recipient_ids` WRITE;
/*!40000 ALTER TABLE `chat_room_recipient_ids` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_room_recipient_ids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `company_code` varchar(30) NOT NULL,
  `business_number` varchar(20) NOT NULL,
  `company_memo` varchar(100) DEFAULT NULL,
  `company_name` varchar(20) NOT NULL,
  `company_number` varchar(20) DEFAULT NULL,
  `manager_name` varchar(10) DEFAULT NULL,
  `manager_number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`company_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES ('','','','','','',''),('jd115','134-64-81233','봉합사, 니들, 러버댐','조은이덴탈','053-474-2275','서진규','010-4722-2275'),('sw223','125-84-84651','신원덴탈입니다','신원덴탈','1577-1234 ','최선아','010-8465-1523'),('yiorkr','053-55-51333','임플란트, 어버트먼트','영남인재교육원','053-555-1333','최영민','010-0555-1333');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hashtags`
--

DROP TABLE IF EXISTS `hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hashtags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtags`
--

LOCK TABLES `hashtags` WRITE;
/*!40000 ALTER TABLE `hashtags` DISABLE KEYS */;
INSERT INTO `hashtags` VALUES (2,'2024-10-31 14:21:23.112544','aaa'),(3,'2024-10-31 14:21:26.199263','aaa'),(4,'2024-10-31 14:21:47.671133','aaa'),(5,'2024-10-31 14:21:50.142855','bbbb'),(6,'2024-10-31 14:21:52.133782','cccc');
/*!40000 ALTER TABLE `hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_stock_out`
--

DROP TABLE IF EXISTS `material_stock_out`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_stock_out` (
  `stock_out_id` bigint NOT NULL AUTO_INCREMENT,
  `stock_out` bigint NOT NULL,
  `stock_out_date` date NOT NULL,
  `material_code` varchar(30) NOT NULL,
  PRIMARY KEY (`stock_out_id`),
  KEY `FKg6nsian6im124mdb0p02n40lr` (`material_code`),
  CONSTRAINT `FKg6nsian6im124mdb0p02n40lr` FOREIGN KEY (`material_code`) REFERENCES `materials` (`material_code`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_stock_out`
--

LOCK TABLES `material_stock_out` WRITE;
/*!40000 ALTER TABLE `material_stock_out` DISABLE KEYS */;
INSERT INTO `material_stock_out` VALUES (113,2,'2024-11-13','nid456'),(121,2,'2024-11-13','imp123'),(140,6,'2024-11-15','nid456'),(141,1,'2024-11-18','nid456'),(145,50,'2024-11-29','111');
/*!40000 ALTER TABLE `material_stock_out` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_transactions`
--

DROP TABLE IF EXISTS `material_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_transactions` (
  `transaction_id` bigint NOT NULL AUTO_INCREMENT,
  `below_safety_stock` bit(1) NOT NULL,
  `remaining_stock` bigint DEFAULT NULL,
  `stock_in` bigint DEFAULT NULL,
  `stock_in_date` date NOT NULL,
  `material_code` varchar(30) NOT NULL,
  `stock_out` bigint DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `FKl7ha7tx3f4j0s8v9fkvws5beu` (`material_code`),
  CONSTRAINT `FKl7ha7tx3f4j0s8v9fkvws5beu` FOREIGN KEY (`material_code`) REFERENCES `materials` (`material_code`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_transactions`
--

LOCK TABLES `material_transactions` WRITE;
/*!40000 ALTER TABLE `material_transactions` DISABLE KEYS */;
INSERT INTO `material_transactions` VALUES (27,_binary '',NULL,10,'2024-11-13','nid456',NULL,NULL),(32,_binary '',NULL,11,'2024-11-14','imp123',NULL,NULL),(40,_binary '',NULL,60,'2024-11-29','111',NULL,NULL);
/*!40000 ALTER TABLE `material_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `material_code` varchar(30) NOT NULL,
  `first_register_date` date DEFAULT NULL,
  `material_name` varchar(30) NOT NULL,
  `material_unit` varchar(20) NOT NULL,
  `material_unit_price` bigint NOT NULL,
  `min_quantity` bigint NOT NULL,
  `stock_management_item` bit(1) NOT NULL,
  `company_code` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`material_code`),
  KEY `FK3h5a0vjxycpb5e75467ifq406` (`company_code`),
  CONSTRAINT `FK3h5a0vjxycpb5e75467ifq406` FOREIGN KEY (`company_code`) REFERENCES `company` (`company_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES ('111','2024-11-29','1111','111',111,150,_binary '','sw223'),('imp123','2024-11-14','임플란트','50ea/1box',30000,10,_binary '','yiorkr'),('nid456','2024-11-13','니들','100ea/1box',30,10,_binary '\0','jd115');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_chart`
--

DROP TABLE IF EXISTS `medical_chart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_chart` (
  `cnum` int NOT NULL AUTO_INCREMENT,
  `check_doc` varchar(255) DEFAULT NULL,
  `chart_num` varchar(255) NOT NULL,
  `md_time` date NOT NULL,
  `medical_content` tinytext,
  `medical_division` varchar(255) NOT NULL,
  `pa_name` varchar(20) NOT NULL,
  `teeth_num` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`cnum`)
) ENGINE=InnoDB AUTO_INCREMENT=516 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_chart`
--

LOCK TABLES `medical_chart` WRITE;
/*!40000 ALTER TABLE `medical_chart` DISABLE KEYS */;
INSERT INTO `medical_chart` VALUES (377,'김관호','240912041','2024-11-06','음식이 끼고 빼기 힘들어요.\n치아가 시려요.\n','CC','이재준','43, 38, 74, 11, 52, 61, 32, 55, 54, 45, 46'),(480,'김관호','240911011','2024-11-11','치아가 시려요.\n양치할 때 피가 나요.\n','CC','송경섭','14, 21, 31, 33'),(481,'김관호','240912015','2024-11-11','Per(+), Occlusal Caries, Implant, CA Abrasion, Pus, Gingival Calculus, Attrition','PI','dfdfdfsdf','17, 15, 26, 85, 45'),(500,'송경섭','240911011','2024-11-14','스케일링을 받고 싶어요.\n치아가 시려요.\n','CC','송경섭','17, 11'),(501,'최선아','240911011','2024-11-14','Tooth Crack, Tooth Fracture, pericoronitis, Mobility(1)','PI','송경섭','18, 12, 52'),(502,'최선아','240911011','2024-11-14','엔도 크라운, 크라운, 브릿지','PLAN','송경섭','21, 22, 23'),(503,'김관호','240911011','2024-11-14','구강검진/정기검진하러 왔어요.\n치아가 시려요.\n','CC','송경섭','17, 16, 15, 81, 82'),(504,'송경섭','240911011','2024-11-13','Spontaneous Pain, Restoration Failure, Tooth Fracture','PI','송경섭','15, 14, 13, 82, 81'),(505,'김관호','240911011','2024-11-13','SS 크라운, 공간 유지 장치, 치아 홈 메우기','PLAN','송경섭','55, 54, 83'),(509,'송경섭','240911011','2024-11-01','스케일링을 받고 싶어요.\n','CC','송경섭','18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38'),(510,'김관호','240911011','2024-11-01','Gingival Calculus','PI','송경섭','18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38, 55, 54, 53, 52, 51, 61, 62, 63, 64, 65'),(512,'송경섭','240911011','2024-11-29','인레이','PLAN','송경섭','33, 34'),(513,'김관호','240912041','2024-11-29','스케일링을 받고 싶어요.\n치아가 변색된 것 같아요.\n','CC','이재준','18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28'),(514,'송경섭','240912041','2024-11-29','Bite(+), Bite(-)','PI','이재준','55, 54, 53, 52, 51, 61, 62, 63, 64, 65, 46, 45'),(515,'송경섭','240912041','2024-11-14','인레이, 인레이 or 엔도크라운, 레진','PLAN','이재준','18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 85, 84, 83, 82, 81, 71, 72, 73, 74, 75');
/*!40000 ALTER TABLE `medical_chart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_chart_price`
--

DROP TABLE IF EXISTS `medical_chart_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_chart_price` (
  `num` int NOT NULL AUTO_INCREMENT,
  `clinic` varchar(255) NOT NULL,
  `doc_name` varchar(255) NOT NULL,
  `pa_name` varchar(255) NOT NULL,
  `pa_num` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_chart_price`
--

LOCK TABLES `medical_chart_price` WRITE;
/*!40000 ALTER TABLE `medical_chart_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_chart_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_fee`
--

DROP TABLE IF EXISTS `medical_fee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_fee` (
  `num` int NOT NULL AUTO_INCREMENT,
  `medical_procedure` varchar(255) NOT NULL,
  `procedure_price` int DEFAULT NULL,
  `medical_procedure_ko` varchar(255) NOT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_fee`
--

LOCK TABLES `medical_fee` WRITE;
/*!40000 ALTER TABLE `medical_fee` DISABLE KEYS */;
INSERT INTO `medical_fee` VALUES (1,'clinic_inlay',200000,'인레이'),(2,'clinic_inlay_or_endocrown',300000,'인레이 or 엔도크라운'),(3,'clinic_resin',150000,'레진'),(4,'clinic_cervical_resin',180000,'서비컬 레진'),(5,'clinic_resin_diastema',250000,'레진 Diastema'),(6,'clinic_endo_post_crown',600000,'엔도, 포스트 크라운'),(7,'clinic_endo_crown',550000,'엔도 크라운'),(8,'clinic_crown',500000,'크라운'),(9,'clinic_bridge',1200000,'브릿지'),(10,'clinic_implant_or_bridge',1500000,'임플란트 or 브릿지'),(11,'clinic_implant_or_denture',1700000,'임플란트 or 틀니'),(12,'clinic_implant',2000000,'임플란트'),(13,'clinic_implant_bone_graft',300000,'임플란트 뼈이식'),(14,'clinic_implant_sinus_lift',400000,'임플란트 상악동'),(15,'clinic_ss_crown',250000,'SS 크라운'),(16,'clinic_space_maintainer',200000,'공간 유지 장치'),(17,'clinic_fissure_sealant',80000,'치아 홈 메우기'),(18,'clinic_fluoride_application',50000,'불소 도포'),(19,'clinic_extraction_orthodontics_A',800000,'발치 교정 A'),(20,'clinic_extraction_orthodontics_B',850000,'발치 교정 B'),(21,'clinic_extraction_orthodontics_C',900000,'발치 교정 C'),(22,'clinic_non_extraction_orthodontics_A',1000000,'비발치 교정 A'),(23,'clinic_non_extraction_orthodontics_B',1100000,'비발치 교정 B'),(24,'clinic_partial_orthodontics',600000,'부분 교정'),(25,'clinic_growth_control_A',700000,'성장 조절 장치 A'),(26,'clinic_growth_control_B',750000,'성장 조절 장치 B'),(27,'clinic_growth_control_C',800000,'성장 조절 장치 C'),(28,'clinic_removable_appliance_A',500000,'가철식 장치 교정 A'),(29,'clinic_removable_appliance_B',550000,'가철식 장치 교정 B'),(30,'clinic_laminate',1200000,'라미네이트'),(31,'clinic_tooth_whitening',400000,'치아 미백'),(32,'clinic_botox',300000,'보톡스'),(33,'clinic_filler',350000,'필러');
/*!40000 ALTER TABLE `medical_fee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `mid` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `retirement` bit(1) NOT NULL,
  `social` varchar(255) DEFAULT NULL,
  `regdate` datetime(6) DEFAULT NULL,
  `moddate` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `detail_address` varchar(255) DEFAULT NULL,
  `zip_code` int NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES ('aaaa','11','김관호','$2a$10$OUKry/0Y9bLKhj0nlXrZjO9iaqo8Nn2rQ0Vsba56vsOzwhvW84ETu',_binary '\0',NULL,'2024-10-29 09:33:06.945240','2024-10-29 09:33:06.945240','','1',0,'11','01122333',''),('adf','','','$2a$10$STe5P8/bu0SGO7nWHtH2AODc8g9PocvdjJ1HckvOWgIR6UBHysWv.',_binary '\0','','2024-12-01 02:02:38.638232','2024-12-01 02:02:38.638232','','',0,'','',''),('admin','admin@yi.or.kr','최영민','$2a$10$8OVRSc792bYDHJWQTyaJNOOAmME.9BZSIZlsuynRypKpzhrdPVlfK',_binary '\0',NULL,NULL,NULL,'대구 달서구 달구벌대로 지하 1900','1212',42663,'010-4801-0799','0535551335','시스템 관리자'),('bbbb','sdf','sdf','$2a$10$snK07aS0PjpFU2z/2QSeguUL47ddi7ffzTgqHFRcNbFOg0OJCxQRK',_binary '\0','dsf','2024-12-01 02:26:02.700977','2024-12-01 02:26:02.700977','sdf','sdf',1111,'sdf','sdf','sdf'),('bbbbbbb','sdf','sdf','$2a$10$XSex9dVo4hwZKituuhmK2.jRFEAEEkJVDyeqPC1I2w0Uj9Y7DAXyC',_binary '\0','dsf','2024-12-01 02:26:47.174822','2024-12-01 02:26:47.174822','sdf','sdf',1111,'sdf','sdf','sdf'),('ccccc','dsf','sdf','$2a$10$YxGEJxH9KlkZTCuK/6adN.DgER1QP7W4eBq9jsKl9I6LDcNC3g.9a',_binary '\0','sdf','2024-12-01 02:27:35.753308','2024-12-01 02:27:35.753308','df','sdf',2333,'sdf','sdf','sdf'),('doctor2','doctor2@yi.or.kr','신혜리',NULL,_binary '\0',NULL,NULL,NULL,'광주 동구 지호로164번길 46-18','1200호',61447,'010-4801-0700','053-555-1338','인턴'),('eeee','sdf','sdf','$2a$10$h0xhU7dX7iKbycqqXOTrV.0jWGf3Q/MHEASgpPyDzgm10KxmCg.3.',_binary '\0','df','2024-12-01 12:08:19.194694','2024-12-01 12:08:19.194694','df','sdf',555,'dsf','dsfs','sdf'),('fffff','sdf','dsf','$2a$10$Q1B71SBWRvylgW9imXgIQe.r8W/I4e4Ap4x8J67tOZuuBpnj8voOm',_binary '\0','dsfsdf','2024-12-01 02:29:29.368287','2024-12-01 02:29:29.368287','dfs','fsdfsd',34444,'dsf','dsf','fsdfs'),('hhhh','dasd','aaaa','$2a$10$f4/BSG8lSPEGHPAqrEWoJu58PgFbS13fAZ52KNWF0tSHKIL84UUUK',_binary '\0','dfsdf','2024-12-01 11:41:40.417982','2024-12-01 11:41:40.417982','dfsdf','dsfsf',23222,'fsdf','dsfsdf','dfsdf'),('kkkk','aaaa@naver.com','송경섭','$2a$10$vaNwlxbw/2plOE9MEddtWeT6nIcvP8Dxv52ocZ7ckzCNV.O1szfTW',_binary '\0',NULL,NULL,'2024-11-14 00:30:26.722791','','',0,'010-4545-4555','',''),('kkkkkkk','ad','dddd','$2a$10$FVqNczuh2tY2CxfoU/waIewU6RAL3OCS6ywo9.3aHBHn3sgiQFmgK',_binary '\0','dfsd','2024-12-01 11:47:14.319368','2024-12-01 11:47:14.319368','df','dsfsd',3333,'sdfsdf','dfsdf','dsfs'),('mmmm','sdf','sdf','$2a$10$T7d9KFTNE51b91PssoZcB.fKrBzEjEgroqvpkKcR.z9fk3iZ4k8mu',_binary '\0','df','2024-12-01 12:01:59.903720','2024-12-01 12:01:59.903720','dsf','sdf',4444,'sdf','sdf','sdf'),('nnnn','dsfsdf','df','$2a$10$J2EwKmPrRPY5NZJHHuf.yekftDEhXjNjzb6hXyZRwFSBEfP6.rFPu',_binary '\0','dfsdf','2024-12-01 12:00:39.519054','2024-12-01 12:00:39.519054','df','sdf',3333,'sdf','sdfsdf','sdf'),('nnnn1','dsfsdf','df','$2a$10$D/vWSV5ovF/E7baA7mAeuORr3aaoxjwT635oQj81k/3CmgrzVtt/W',_binary '\0','dfsdf','2024-12-01 12:00:59.095650','2024-12-01 12:00:59.095650','df','sdf',3333,'sdf','sdfsdf','sdf'),('qqqq','qqqq@yi.or.kr','최선아','$2a$10$oXSS2xdxuokaiZ5brWp4gORmoeLjv.WfDPKGzkzuCHs1rC.Bq.4gG',_binary '\0',NULL,NULL,NULL,'서울 중구 소공로6가길 13','3층',4630,'01048010730','0535551444','직원'),('sdsd','plus4957@google.co.kr','정수빈','$2a$10$oXSS2xdxuokaiZ5brWp4gORmoeLjv.WfDPKGzkzuCHs1rC.Bq.4gG',_binary '\0',NULL,NULL,NULL,'광주 동구 지호로164번길 46-18','121233333',61447,'010-4801-0797','053-555-1333','ㅁㅇㄴㅇㄴ'),('string','string','string','$2a$10$KYeZDmBcaXpo91nhckLPxujF4Qo9rjV5Mrtb.64FUzeb3e3j3/60S',_binary '','string','2024-11-29 13:44:13.152485','2024-11-29 13:44:13.152485','string','string',0,'string','string','string'),('user1','dldms562@naver.com','이재준','$2a$10$EdlZeGaDHjLesRwcP/cLDOKp1yqsUwUqaxIuulJ1.9ote/TSfOhWu',_binary '\0',NULL,'2024-11-29 16:46:38.234915','2024-11-29 16:46:38.234915','부산 강서구 르노삼성대로 14','2층',46760,'010-4489-5136','053-555-1333',''),('user11','11','11','$2a$10$t6U7zUn.r8mfx3CJgpkO/OO2g3nsLhpNKymuLFcHP75ne2aoMIIfe',_binary '\0',NULL,'2024-11-29 16:27:03.003544','2024-11-29 16:27:03.003544','','',0,'11','11',''),('user2','user2@yi.or.kr','최선아','$2a$10$oXSS2xdxuokaiZ5brWp4gORmoeLjv.WfDPKGzkzuCHs1rC.Bq.4gG',_binary '\0',NULL,NULL,NULL,'대전 동구 비래서로42번안길 43','1층',34528,'010-4801-0798','053-555-1334','일반 행정직원'),('user3','bjy6945@yi.or.kr','백지영','$2a$10$7FKSNdZLKBDceDaEEwh0aua.liaxRQghVWMFXAcxBGkJGnJ7apKLG',_binary '\0',NULL,'2024-11-14 00:38:59.265750','2024-11-14 00:38:59.265750','대구 서구 서대구로7길 2','2층',41851,'010-4435-4273','',''),('uuuu','plus4957@gmail.com','최영민','$2a$10$oXSS2xdxuokaiZ5brWp4gORmoeLjv.WfDPKGzkzuCHs1rC.Bq.4gG',_binary '\0',NULL,NULL,'2024-11-14 00:30:17.676809','','',0,'010-5588-4499','',''),('xxx','ksol0048@naver.com','조성현',NULL,_binary '\0',NULL,NULL,NULL,'인천 미추홀구 경원대로 627','1층',22233,'01048010788','0535551344','행정 사무직');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_role_set`
--

DROP TABLE IF EXISTS `member_role_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_role_set` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_set` enum('ADMIN','DOCTOR','EMP','NURSE') DEFAULT NULL,
  `member_mid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfjsrs6u4t2kvu8l1brmn8r00a` (`member_mid`),
  CONSTRAINT `FKfjsrs6u4t2kvu8l1brmn8r00a` FOREIGN KEY (`member_mid`) REFERENCES `member` (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_role_set`
--

LOCK TABLES `member_role_set` WRITE;
/*!40000 ALTER TABLE `member_role_set` DISABLE KEYS */;
INSERT INTO `member_role_set` VALUES (2,'ADMIN','admin'),(31,'ADMIN','admin'),(35,'ADMIN','qqqq'),(41,'ADMIN','doctor2'),(42,'EMP','xxx'),(44,'DOCTOR','user2'),(45,'DOCTOR','aaaa'),(54,'ADMIN','uuuu'),(55,'DOCTOR','kkkk'),(59,'EMP','sdsd'),(61,'ADMIN','user3'),(68,'EMP','string'),(69,'EMP','user11'),(71,'ADMIN','user1'),(72,'ADMIN','bbbb'),(73,'DOCTOR','bbbb'),(74,'DOCTOR','bbbbbbb'),(75,'ADMIN','bbbbbbb'),(76,'DOCTOR','ccccc'),(77,'ADMIN','ccccc'),(78,'DOCTOR','fffff'),(79,'EMP','fffff'),(80,'ADMIN','hhhh'),(81,'DOCTOR','hhhh'),(82,'EMP','kkkkkkk'),(83,'ADMIN','kkkkkkk'),(84,'EMP','nnnn'),(85,'ADMIN','nnnn'),(86,'EMP','nnnn1'),(87,'ADMIN','nnnn1'),(88,'EMP','mmmm'),(89,'DOCTOR','mmmm'),(90,'EMP','eeee');
/*!40000 ALTER TABLE `member_role_set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memo`
--

DROP TABLE IF EXISTS `memo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memo` (
  `mmo` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) DEFAULT NULL,
  `memo_chart_num` varchar(255) DEFAULT NULL,
  `reg_date` date DEFAULT NULL,
  PRIMARY KEY (`mmo`)
) ENGINE=InnoDB AUTO_INCREMENT=431 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memo`
--

LOCK TABLES `memo` WRITE;
/*!40000 ALTER TABLE `memo` DISABLE KEYS */;
/*!40000 ALTER TABLE `memo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_admissions`
--

DROP TABLE IF EXISTS `patient_admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_admissions` (
  `pid` int NOT NULL AUTO_INCREMENT,
  `chart_num` int NOT NULL,
  `cp_time` datetime(6) DEFAULT NULL,
  `main_doc` varchar(20) DEFAULT NULL,
  `pa_name` varchar(20) NOT NULL,
  `reception_time` datetime(6) DEFAULT NULL,
  `rv_time` datetime(6) DEFAULT NULL,
  `treat_status` varchar(100) DEFAULT NULL,
  `vi_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=717 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_admissions`
--

LOCK TABLES `patient_admissions` WRITE;
/*!40000 ALTER TABLE `patient_admissions` DISABLE KEYS */;
INSERT INTO `patient_admissions` VALUES (513,240912018,'2024-11-05 17:20:16.061413','김관호','김개똥','2024-11-05 17:13:08.454695','2024-11-05 09:00:00.000000','3','2024-11-05 17:17:50.242630'),(514,240912003,'2024-11-05 17:27:38.610983','송경섭','김유신','2024-11-05 17:26:51.501430',NULL,'3','2024-11-05 17:27:23.246061'),(515,240912003,NULL,'최선아','가나다','2024-11-05 17:35:46.616274',NULL,'2','2024-11-05 17:42:56.836434'),(516,241002006,NULL,'김관호','가가가','2024-11-05 17:48:23.780252',NULL,'2','2024-11-05 18:07:32.842125'),(561,240912045,NULL,'김관호','김순자','2024-11-05 15:27:49.543000','2024-11-05 09:30:00.000000','2','2024-11-05 15:27:53.930665'),(562,240930001,'2024-11-05 15:33:09.007000','최선아','홍길동','2024-11-05 15:32:27.539000','2024-11-05 10:00:00.000000','3','2024-11-05 15:33:05.369000'),(602,240912041,'2024-11-19 11:22:32.881678','김관호','이재준','2024-11-19 11:22:22.493080',NULL,'3','2024-11-19 11:22:28.482880'),(604,240911011,NULL,'김관호','송경섭','2024-11-19 12:31:34.421860',NULL,'2','2024-11-19 12:31:42.170215'),(605,240911011,'2024-11-21 12:00:25.015067','김관호','송경섭','2024-11-21 11:59:23.329557',NULL,'3','2024-11-21 12:00:18.366886'),(609,240912042,NULL,'김관호','김유신','2024-11-22 09:24:38.409952',NULL,'2','2024-11-22 09:24:41.249752'),(612,240911011,NULL,'김관호','송경섭','2024-11-24 16:54:14.451805',NULL,'2','2024-11-24 16:54:24.028540'),(617,240911011,'2024-11-25 02:00:15.865275','김관호','송경섭','2024-11-25 01:58:50.960484',NULL,'3','2024-11-25 02:00:12.895342'),(618,240912041,NULL,'김관호','이재준','2024-11-25 01:59:40.327992',NULL,'2','2024-11-25 02:00:19.392826'),(619,240912042,NULL,'김관호','김유신','2024-11-25 01:59:48.833179',NULL,'2','2024-11-25 02:00:22.746803'),(623,240912042,NULL,'김관호','김유신','2024-11-25 03:15:01.326190',NULL,'2','2024-11-25 13:37:19.572128'),(624,240930001,NULL,'김관호','홍길동','2024-11-25 13:42:52.569043',NULL,'2','2024-11-25 14:46:34.466129'),(644,240930001,'2024-11-27 10:03:20.275769','김관호','홍길동','2024-11-27 10:02:56.209870',NULL,'3','2024-11-27 10:03:17.962581'),(646,240930001,'2024-11-27 10:03:24.716643','김관호','홍길동','2024-11-27 10:02:57.698015',NULL,'3','2024-11-27 10:03:11.740958'),(647,240930001,NULL,'김관호','홍길동','2024-11-27 10:02:58.619910',NULL,'2','2024-11-27 10:03:09.043405'),(652,240912042,NULL,'김관호','김유신','2024-11-27 10:03:32.018140',NULL,'2','2024-11-27 10:03:45.428775'),(653,240912042,NULL,'김관호','김유신','2024-11-27 10:03:32.701312',NULL,'2','2024-11-27 10:03:48.961099'),(660,240912042,NULL,'김관호','김유신','2024-11-27 10:03:35.307846',NULL,'2','2024-11-27 10:03:41.363070'),(690,240912042,'2024-11-29 09:03:15.696720','김관호','김유신','2024-11-29 08:58:22.465886',NULL,'3','2024-11-29 09:01:01.778390'),(691,240930001,'2024-11-29 09:03:18.311014','김관호','홍길동','2024-11-29 09:02:04.262342',NULL,'3','2024-11-29 09:02:32.016316'),(692,240912041,'2024-11-29 09:03:20.662752','김관호','이재준','2024-11-29 09:02:43.134948','2024-11-29 09:00:00.000000','3','2024-11-29 09:03:00.543148'),(693,240911011,NULL,'김관호','송경섭','2024-11-29 09:03:25.292393',NULL,'2','2024-11-29 09:03:27.967776'),(694,240912045,NULL,'김관호','김순자','2024-11-29 09:03:32.056073',NULL,'2','2024-11-29 09:03:34.521070'),(695,240930001,'2024-11-29 10:05:48.984730','김관호','홍길동','2024-11-29 09:03:37.252066',NULL,'3','2024-11-29 09:03:41.206205'),(696,240912042,'2024-11-29 10:23:16.857070','김관호','김유신','2024-11-29 09:04:00.012237',NULL,'3','2024-11-29 09:04:02.723520'),(697,240912042,NULL,NULL,'김유신','2024-11-29 09:04:04.835123',NULL,'1',NULL),(698,240911011,NULL,NULL,'송경섭','2024-11-29 09:04:08.581315',NULL,'1',NULL),(699,240912041,NULL,NULL,'이재준','2024-11-29 09:04:14.768749','2024-11-29 09:00:00.000000','1',NULL),(700,240930001,NULL,NULL,'홍길동','2024-11-29 09:04:18.522505',NULL,'1',NULL),(701,240912045,NULL,NULL,'김순자','2024-11-29 09:04:22.669653',NULL,'1',NULL),(702,240912044,'2024-11-29 16:49:01.306403','김관호','이순신','2024-11-29 09:04:26.770187',NULL,'3','2024-11-29 10:23:13.718805'),(703,240911011,NULL,NULL,'송경섭','2024-11-29 09:04:31.267672',NULL,'1',NULL),(705,240930001,NULL,NULL,'홍길동','2024-11-29 09:04:53.016709',NULL,'1',NULL),(708,240912045,NULL,'최선아','김순자','2024-11-29 09:07:02.864834',NULL,'2','2024-11-29 10:05:09.403340'),(709,240912042,NULL,'송경섭','김유신','2024-11-29 09:07:07.545887',NULL,'2','2024-11-29 10:04:57.139838'),(711,240912041,'2024-11-29 10:04:29.972893','김관호','이재준','2024-11-29 10:04:22.196429','2024-11-29 09:00:00.000000','3','2024-11-29 10:04:26.747160'),(712,240912041,'2024-11-29 10:38:11.603236','김관호','이재준','2024-11-29 10:37:57.980392','2024-11-29 09:00:00.000000','3','2024-11-29 10:38:02.177992'),(714,240912045,NULL,'김관호','김순자','2024-11-29 16:04:45.785852','2024-11-29 11:00:00.000000','2','2024-11-29 16:53:47.495147'),(716,240912044,'2024-11-29 16:53:59.125370','송경섭','이순신','2024-11-29 16:47:30.188850','2024-11-29 09:00:00.000000','3','2024-11-29 16:48:16.779497');
/*!40000 ALTER TABLE `patient_admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_appointments`
--

DROP TABLE IF EXISTS `patient_appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_appointments` (
  `chart_num` int NOT NULL AUTO_INCREMENT,
  `dental_hygienist` varchar(20) DEFAULT NULL,
  `first_visit` date DEFAULT NULL,
  `last_reserv` date DEFAULT NULL,
  `last_visit` date DEFAULT NULL,
  `main_doc` varchar(20) DEFAULT NULL,
  `md_time` date DEFAULT NULL,
  `medical_type` varchar(100) DEFAULT NULL,
  `notice` tinytext,
  `pa_info` tinytext,
  `pa_name` varchar(20) NOT NULL,
  `reservation_date` date DEFAULT NULL,
  `rv_info` varchar(100) DEFAULT NULL,
  `rv_non` varchar(20) DEFAULT NULL,
  `rv_time` date DEFAULT NULL,
  `rv_type` varchar(20) DEFAULT NULL,
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
-- Table structure for table `patient_reg`
--

DROP TABLE IF EXISTS `patient_reg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_reg` (
  `chart_num` varchar(255) NOT NULL,
  `pa_name` varchar(100) DEFAULT NULL,
  `first_reident_num` varchar(30) DEFAULT NULL,
  `last_reident_num` varchar(30) DEFAULT NULL,
  `pa_gender` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `pa_home_num` varchar(255) DEFAULT NULL,
  `pa_phone_num` varchar(255) DEFAULT NULL,
  `pa_email` varchar(255) DEFAULT NULL,
  `default_address` varchar(255) DEFAULT NULL,
  `detailed_address` varchar(255) DEFAULT NULL,
  `main_doc` varchar(255) DEFAULT NULL,
  `dental_hygienist` varchar(255) DEFAULT NULL,
  `pa_category` varchar(255) DEFAULT NULL,
  `pa_tendency` varchar(255) DEFAULT NULL,
  `visit_path` varchar(255) DEFAULT NULL,
  `first_visit` date DEFAULT NULL,
  `last_visit` date DEFAULT NULL,
  PRIMARY KEY (`chart_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_reg`
--

LOCK TABLES `patient_reg` WRITE;
/*!40000 ALTER TABLE `patient_reg` DISABLE KEYS */;
INSERT INTO `patient_reg` VALUES ('240912041','이재준','800205','156156','m','1980-02-05','010-4567-7894','--','ksol0123123123@ksol0123.com','서울 강남구 강남대로 328 (역삼동)','','','','틀니','zzzzz','인터넷','2013-05-10',NULL),('240912042','김유신','701123','1561231','w','1970-11-23','010-1234-7894','--','user1@example.com','경기 성남시 분당구 대왕판교로 477 (판교동)','','허성준','','심미보철','zzzzzzzzzzz','간판','2020-12-31',NULL),('240912044','이순신','640101','1234564','m','1964-01-01','010-2315-8456','--','ksol0123123@naver.com','경기 안양시 만안구 안양로532번길 13 (석수동)','','김관호','','임플란트','','인터넷','2021-03-05',NULL),('240912045','김순자','750621','1231561','w','1975-06-21','010-8648-8974','--','user2@naver.com','서울 노원구 동일로242마길 6 (상계동)','','허성준','','교정','','광고','2022-12-30',NULL),('240930001','홍길동','301221','1231561','','1930-12-21','010-1215-4894','--','@','제주특별자치도 서귀포시 대정읍 대한로 632','','허성준','','임플란트','','간판','2000-11-12',NULL),('241129001','11','11','11','','2024-11-28','111-111-111','111-111-111','@','','','',NULL,'','','',NULL,NULL),('241129002','ㄴㅁㅇㅁㅇ','','','',NULL,'--','--','@','','','송경섭',NULL,'','','인터넷',NULL,NULL);
/*!40000 ALTER TABLE `patient_reg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_reg_memos`
--

DROP TABLE IF EXISTS `patient_reg_memos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_reg_memos` (
  `patient_register_chart_num` varchar(255) NOT NULL,
  `memos_mmo` bigint NOT NULL,
  UNIQUE KEY `UKpxcdd3dt5yon20n0epp5sljja` (`memos_mmo`),
  KEY `FK9d0ulqa9g7lqy56tmnp8tgwyt` (`patient_register_chart_num`),
  CONSTRAINT `FK5q2rjjritfky18soarl9clry8` FOREIGN KEY (`memos_mmo`) REFERENCES `memo` (`mmo`),
  CONSTRAINT `FK9d0ulqa9g7lqy56tmnp8tgwyt` FOREIGN KEY (`patient_register_chart_num`) REFERENCES `patient_reg` (`chart_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_reg_memos`
--

LOCK TABLES `patient_reg_memos` WRITE;
/*!40000 ALTER TABLE `patient_reg_memos` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_reg_memos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persistent_logins`
--

DROP TABLE IF EXISTS `persistent_logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persistent_logins` (
  `series` varchar(64) NOT NULL,
  `last_used` datetime(6) NOT NULL,
  `token` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  PRIMARY KEY (`series`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persistent_logins`
--

LOCK TABLES `persistent_logins` WRITE;
/*!40000 ALTER TABLE `persistent_logins` DISABLE KEYS */;
/*!40000 ALTER TABLE `persistent_logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_hashtags`
--

DROP TABLE IF EXISTS `post_hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_hashtags` (
  `post_id` bigint NOT NULL,
  `hashtag_id` bigint NOT NULL,
  PRIMARY KEY (`post_id`,`hashtag_id`),
  KEY `FKb8j4xx456a7584d8blc604pqg` (`hashtag_id`),
  CONSTRAINT `FKb8j4xx456a7584d8blc604pqg` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`id`),
  CONSTRAINT `FKrrlq793bvaswhomm900i71ac5` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_hashtags`
--

LOCK TABLES `post_hashtags` WRITE;
/*!40000 ALTER TABLE `post_hashtags` DISABLE KEYS */;
INSERT INTO `post_hashtags` VALUES (1,4),(1,6);
/*!40000 ALTER TABLE `post_hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'해쉬태그 테스트1','2024-10-31 14:30:28.000000','해쉬태그 1'),(2,'해쉬태그 테스트2','2024-10-31 14:38:25.000000','해쉬태그 2');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `seq` bigint NOT NULL AUTO_INCREMENT,
  `chart_number` varchar(255) DEFAULT NULL,
  `doctor` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `patient_note` varchar(255) DEFAULT NULL,
  `reservation_date` varchar(255) DEFAULT NULL,
  `reservation_status_check` varchar(255) DEFAULT NULL,
  `sns_notification` bit(1) DEFAULT NULL,
  `treatment_type` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (9,'240911011','김관호','송경섭','3개월 정기검진','2024-11-13T09:00','ca',_binary '\0','일반',NULL),(10,'240912042','최선아','김유신','신경치료','2024-11-13T11:30','ba',_binary '\0','일반',NULL),(11,'240912045','최선아','김순자','임플란트','2024-11-13T09:30','없음',_binary '\0','수술',NULL),(12,'240930001','김관호','홍길동','사랑니 발치','2024-11-13T10:00','ca',_binary '\0','일반',NULL),(15,'240930001','김관호','홍길동','임플란트','2024-11-13T09:00','ca',_binary '\0','일반',NULL),(27,'240930001','김관호','홍길동','신경치료','2024-11-15T09:00','없음',_binary '\0','일반',NULL),(28,'240912044','김관호','이순신','3개월 정기검진','2024-11-15T09:00','없음',_binary '\0','일반',NULL),(29,'240912044','김관호','이순신','신경치료','2024-11-16T09:00','없음',_binary '\0','일반',NULL),(30,'240912044','김관호','이순신','사랑니 발치','2024-11-16T10:30','없음',_binary '\0','일반',NULL),(36,'240912045','송경섭','김순자','임플란트','2024-11-14T10:00','없음',_binary '\0','수술',NULL),(43,'240911011','김관호','송경섭','정기검진','2024-11-14T09:00','없음',_binary '\0','신환',NULL),(45,'240912044','최선아','이순신','스케일링','2024-11-14T09:00','없음',_binary '\0','일반',NULL),(46,'240912041','김관호','이재준','임플란트','2024-11-14T11:00','ba',_binary '\0','일반',NULL),(49,'240911011','김관호','송경섭','','2024-11-27T11:30','ba',_binary '\0','일반',NULL),(50,'240912044','김관호','이순신','','2024-11-27T14:30','없음',_binary '\0','일반',NULL),(64,'240912041','김관호','이재준','임플란트','2024-11-29T11:30','ba',_binary '\0','일반',NULL),(67,'240912041','김관호','이재준','dsfdfsdf','2024-11-29T14:30','없음',_binary '\0','일반',NULL),(69,'240912044','송경섭','이순신','사랑니 발치','2024-11-29T09:00','없음',_binary '\0','수술',NULL),(70,'240912045','김관호','김순자','임플란트','2024-11-29T11:00','없음',_binary '\0','일반',NULL);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terms`
--

DROP TABLE IF EXISTS `terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms`
--

LOCK TABLES `terms` WRITE;
/*!40000 ALTER TABLE `terms` DISABLE KEYS */;
INSERT INTO `terms` VALUES (117,'3개월 정기검진'),(118,'6개월 정기검진'),(121,'사랑니 발치'),(124,'스케일링'),(125,'임플란트');
/*!40000 ALTER TABLE `terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  UNIQUE KEY `UKsb8bbouer5wak8vyiiy4pf2bx` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'his'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-02 15:19:12
