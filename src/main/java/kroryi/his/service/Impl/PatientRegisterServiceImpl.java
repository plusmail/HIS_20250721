package kroryi.his.service.Impl;

import com.querydsl.core.BooleanBuilder;
import kroryi.his.domain.PatientRegister;
import kroryi.his.dto.PatientDTO;
import kroryi.his.repository.PatientRegisterRepository;
import kroryi.his.service.PatientRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class PatientRegisterServiceImpl implements PatientRegisterService {
    private final PatientRegisterRepository patientRegisterRepository;
    private final ModelMapper modelMapper;

    @Override
    public String generateChartNum() {
        // 현재 날짜를 yyyyMMdd 형식으로 변환
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));

        // 같은 날짜에 해당하는 가장 큰 chart_num을 조회
        PatientRegister lastPatient = patientRegisterRepository
                .findTopByChartNumStartingWithOrderByChartNumDesc(currentDate);

        // 증가 번호 계산
        int nextNumber = lastPatient != null
                ? Integer.parseInt(lastPatient.getChartNum().substring(6)) + 1
                : 1;

        // yyyyMMdd + 3자리 증가하는 숫자로 chart_num 생성
        return currentDate + String.format("%03d", nextNumber);
    }

    @Override
    public PatientRegister registerPatient() {
        // chart_num 생성
        String chartNum = generateChartNum();

        // 엔티티 생성
        PatientRegister patient = PatientRegister.builder()
                .chartNum(chartNum)
                .name("이재준")
                .email("sadasda")
                .firstPaResidentNum("asdas")
                .lastPaResidentNum("asdasda")
                .build();

        // 엔티티 저장
        return patientRegisterRepository.save(patient);
    }

    @Override
    public PatientRegister register(PatientDTO patientDTO) {
        // chart_num 생성
        String chartNum = generateChartNum();
        // 엔티티 생성 및 DTO 매핑
        PatientRegister patientRegister = modelMapper.map(patientDTO, PatientRegister.class);

        // chart_num 설정
        patientRegister.setChartNum(chartNum);
        log.info("patientRegister:{}", patientRegister);

        return patientRegisterRepository.save(patientRegister);
    }

    /*@Override
    public List<PatientRegister> searchName(String keyword) {

        log.info("searchName:{}", keyword);

        List<PatientRegister> registers = patientRegisterRepository.findByName(keyword);
        log.info("searchName:{}", registers);

        return registers;
    }*/

    @Override
    public List<PatientRegister> searchNameByKeyword(String keyword) {
        return patientRegisterRepository.findByNameContainingIgnoreCase(keyword);
    }


}
