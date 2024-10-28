package kroryi.his.service;

import kroryi.his.domain.PatientAdmission;
import kroryi.his.dto.PatientAdmissionDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public interface PatientAdmissionService {
    PatientAdmission savePatientAdmission(PatientAdmissionDTO patientAdmissionDTO);

    List<PatientAdmission> getWaitingPatients();

    long getCompleteTreatmentCount(String count, LocalDate date);

    List<PatientAdmission> findByChartNumAndReceptionTime(Integer chartNum, LocalDateTime receptionTime);


    void updatePatientAdmission(PatientAdmission patientAdmission);

    List<PatientAdmissionDTO> getAdmissionsByReceptionTime(LocalDateTime startDate, LocalDateTime endDate);

    void cancelAdmission(Integer pid);

    PatientAdmission getLatestCompletionTime(Integer chartNum);
}
