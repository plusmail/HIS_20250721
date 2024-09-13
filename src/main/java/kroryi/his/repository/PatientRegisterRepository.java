package kroryi.his.repository;

import kroryi.his.domain.PatientRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRegisterRepository extends JpaRepository<PatientRegister, String> {

    PatientRegister findTopByChartNumStartingWithOrderByChartNumDesc(String chartNum);

}
