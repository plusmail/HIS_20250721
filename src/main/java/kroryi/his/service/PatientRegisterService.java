package kroryi.his.service;

import kroryi.his.domain.PatientRegister;
import kroryi.his.dto.PatientDTO;

import java.util.List;

public interface PatientRegisterService {
    String generateChartNum();

    PatientRegister registerPatient();

    PatientRegister register(PatientDTO patientDTO);

//    Long register(PatientDTO patientDTO);
//    List<PatientRegister> searchName(String keyword);

    List<PatientRegister> searchNameByKeyword(String keyword);
}