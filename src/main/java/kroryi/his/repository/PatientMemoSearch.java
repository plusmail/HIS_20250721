package kroryi.his.repository;

import kroryi.his.domain.PatientRegister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientMemoSearch extends JpaRepository<PatientRegister, Long> {



}
