package kroryi.his.repository;

import kroryi.his.domain.PatientRegisterMemo;
import kroryi.his.dto.PatientMemoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PatientMemoRepository extends JpaRepository<PatientRegisterMemo, Long> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO patient_reg_memos (patient_register_chart_num, memos_mmo) VALUES (:chartNum, :mmo)", nativeQuery = true)
    void insertPatientRegMemo(String chartNum, Long mmo);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM patient_reg_memos WHERE memos_mmo = :mmo", nativeQuery = true)
    void deleteByMemosMmo(Long mmo); // Method to delete dependent records

}
