package kroryi.his.repository;

import kroryi.his.domain.MedicalChart;
import kroryi.his.domain.QMedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MedicalChartRepository extends JpaRepository<MedicalChart, Integer> {


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

    Optional<MedicalChart> findByCnum(Integer cnum);

}
