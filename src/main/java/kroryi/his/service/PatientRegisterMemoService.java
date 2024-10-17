package kroryi.his.service;

import kroryi.his.domain.PatientRegisterMemo;
import kroryi.his.dto.PatientMemoDTO;

public interface PatientRegisterMemoService {
    Long register(PatientMemoDTO patientMemoDTO);

    void remove(Long mmo);

    void modify(PatientMemoDTO patientMemoDTO);
}
