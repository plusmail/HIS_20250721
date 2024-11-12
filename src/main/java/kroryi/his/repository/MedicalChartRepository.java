package kroryi.his.repository;

import kroryi.his.domain.MedicalChart;

import kroryi.his.dto.MedicalChartDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MedicalChartRepository extends JpaRepository<MedicalChart, Integer>, JpaSpecificationExecutor<MedicalChart> {


    List<MedicalChart> findMedicalChartByChartNumOrderByMdTimeAsc(String chartNum);


    List<MedicalChart> findMedicalChartByChartNumAndMedicalDivision(String chartNum, String medicalDivision);


    @Transactional
    void deleteByChartNumAndPaNameAndTeethNumAndMedicalDivisionAndMdTime(
            String chartNum,
            String paName,
            String teethNum,
            String medicalDivision,
            LocalDate mdTime
    );

    List<MedicalChart> findByChartNumAndPaNameAndTeethNumAndMedicalDivisionAndMdTime(
            String chartNum,
            String paName,
            String teethNum,
            String medicalDivision,
            LocalDate mdTime
    );

    @Transactional
    @Modifying
    void deleteByCnum(Integer cnum);
//
//    @Query("SELECT DISTINCT m FROM MedicalChart m " +
//            "WHERE m.chartNum = :chartNum " +  // chartNum을 필수 검색 조건으로 설정
//            "AND (:mdTimeStart IS NULL OR m.mdTime >= :mdTimeStart) " +
//            "AND (:mdTimeEnd IS NULL OR m.mdTime <= :mdTimeEnd) " +
//            "AND (:checkDoc IS NULL OR LOWER(m.checkDoc) = LOWER(:checkDoc)) " +  // 대소문자 구분 없이 비교
//            "AND (:medicalDivision IS NULL OR m.medicalDivision = :medicalDivision) " +
//            "AND (:teethNum IS NULL OR m.teethNum LIKE CONCAT('%', :teethNum, '%'))") // teethNum 배열을 IN 조건으로 처리
//    List<MedicalChart> searchMedicalCharts(
//            @Param("chartNum") String chartNum,  // 필수 조건
//            @Param("mdTimeStart") LocalDate mdTimeStart,
//            @Param("mdTimeEnd") LocalDate mdTimeEnd,
//            @Param("checkDoc") String checkDoc,
//            @Param("medicalDivision") String medicalDivision,
//            @Param("teethNum") String teethNum  // List<String>으로 처리
//    );



    MedicalChart findByCnum(Integer cnum);

}
