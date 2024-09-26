package kroryi.his.repository;

import kroryi.his.domain.PatientAdmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientAdmissionRepository extends JpaRepository<PatientAdmission, Integer> {
}
