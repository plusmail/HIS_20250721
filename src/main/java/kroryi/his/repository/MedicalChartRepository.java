package kroryi.his.repository;

import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface MedicalChartRepository extends JpaRepository<MedicalChart, Integer> {


    // paName으로 검색하여 DTO를 반환하는 JPQL 쿼리
//    @Query("SELECT  new kroryi.his.dto.MedicalChartDTO(m.chartNum) FROM MedicalChart m WHERE m.chartNum = :chartNum")
//    List<MedicalChartDTO> findMedicalChartsByChartNum(@Param("chartNum") String chartNum);

    List<MedicalChart> findMedicalChartByChartNum(String chartNum);


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


}
