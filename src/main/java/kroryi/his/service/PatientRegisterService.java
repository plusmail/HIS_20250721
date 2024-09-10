package kroryi.his.service;

import kroryi.his.domain.PatientRegister;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import kroryi.his.repository.PatientRegisterRepository;

@Service
public class PatientRegisterService {

    @Autowired
    private PatientRegisterRepository patientRegisterRepository;

    public String generateChartNum() {
        // 현재 날짜를 yyyyMMdd 형식으로 변환
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 같은 날짜에 해당하는 가장 큰 chart_num을 조회
        PatientRegister lastPatient = patientRegisterRepository
                .findTopByChartNumStartingWithOrderByChartNumDesc(currentDate);

        // 증가 번호 계산
        int nextNumber = lastPatient != null
                ? Integer.parseInt(lastPatient.getChartNum().substring(8)) + 1
                : 1;

        // yyyyMMdd + 3자리 증가하는 숫자로 chart_num 생성
        return currentDate + String.format("%03d", nextNumber);
    }

    public PatientRegister registerPatient() {
        // chart_num 생성
        String chartNum = generateChartNum();

        // 엔티티 생성
        PatientRegister patient = PatientRegister.builder()
                .chartNum(chartNum)
                .build();

        // 엔티티 저장
        return patientRegisterRepository.save(patient);
    }
}