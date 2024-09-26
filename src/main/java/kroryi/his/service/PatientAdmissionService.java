package kroryi.his.service;

import kroryi.his.domain.PatientAdmission;
import kroryi.his.dto.PatientAdmissionDTO;
import kroryi.his.repository.PatientAdmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientAdmissionService {

    @Autowired
    private PatientAdmissionRepository patientAdmissionRepository;

    public void saveCompletedData(List<PatientAdmissionDTO> completedData) {
        // DTO를 엔티티로 변환하여 데이터베이스에 저장
        List<PatientAdmission> patientAdmissions = completedData.stream()
                .map(dto -> {
                    PatientAdmission patientAdmission = new PatientAdmission();
                    patientAdmission.setChartNum(dto.getChartNum()); // 차트 번호 설정
                    patientAdmission.setPaName(dto.getPaName()); // 환자 이름 설정
                    patientAdmission.setMainDoc(dto.getMainDoc()); // 의사 이름 설정
                    patientAdmission.setReceptionTime(LocalDateTime.now()); // 현재 시간으로 접수 시간 설정
                    patientAdmission.setCompletionTime(LocalDateTime.now()); // 현재 시간으로 완료 시간 설정
                    return patientAdmission;
                })
                .collect(Collectors.toList());

        // 엔티티를 데이터베이스에 저장
        patientAdmissionRepository.saveAll(patientAdmissions);
    }
}
