package kroryi.his.repository;

import kroryi.his.domain.PatientRegisterMemo;
import kroryi.his.dto.PatientMemoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientMemoRepository extends JpaRepository<PatientRegisterMemo, Long> {



}
