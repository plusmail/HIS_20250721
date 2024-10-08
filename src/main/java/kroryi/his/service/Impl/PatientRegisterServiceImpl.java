package kroryi.his.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import kroryi.his.domain.PatientRegister;
import kroryi.his.domain.PatientRegisterMemo;
import kroryi.his.dto.PatientDTO;
import kroryi.his.dto.PatientMemoDTO;
import kroryi.his.repository.PatientMemoRepository;
import kroryi.his.repository.PatientRegisterRepository;
import kroryi.his.service.PatientRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class PatientRegisterServiceImpl implements PatientRegisterService {
    private final PatientRegisterRepository patientRegisterRepository;
    private final ModelMapper modelMapper;
    private final PatientMemoRepository patientMemoRepository;

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
    public PatientRegister register(PatientDTO patientDTO) {
        // chart_num 생성
        String chartNum = generateChartNum();
        // 엔티티 생성 및 DTO 매핑
        PatientRegister patientRegister = modelMapper.map(patientDTO, PatientRegister.class);

        // chart_num 설정

        patientRegister.setChartNum(chartNum);


        List<PatientRegisterMemo> memoList = new ArrayList<>();
        if (patientDTO.getMemos() != null) {
            for (PatientMemoDTO patientMemoDTO : patientDTO.getMemos()) {
                PatientRegisterMemo memo = new PatientRegisterMemo();
                memo.setRegDate(patientMemoDTO.getRegDate());
                memo.setContent(patientMemoDTO.getContent());
                memo.setMemoChartNum(chartNum);
                memoList.add(memo);
                log.info("memo!!!!!{}", memo.getMemoChartNum());
            }
        }
        patientRegister.setMemos(memoList);

        log.info("patientRegister: {}", patientRegister);

        return patientRegisterRepository.save(patientRegister);
    }

    @Override
    public List<PatientRegister> searchNameByKeyword(String keyword) {
        return patientRegisterRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Override
    public void remove(String chartNum) {
        log.info("remove: {}", chartNum);
        patientRegisterRepository.deleteById(chartNum);
    }

    @Override
    public PatientRegister modify(PatientDTO patientDTO) {
        Optional<PatientRegister> patientRegisterOptional = patientRegisterRepository.findById(patientDTO.getChartNum());

        PatientRegister patientRegister = patientRegisterOptional.orElseThrow();

        // Update PatientRegister fields
        patientRegister.setName(patientDTO.getName());
        patientRegister.setFirstPaResidentNum(patientDTO.getFirstPaResidentNum());
        patientRegister.setLastPaResidentNum(patientDTO.getLastPaResidentNum());
        patientRegister.setGender(patientDTO.getGender());
        patientRegister.setBirthDate(patientDTO.getBirthDate());
        patientRegister.setHomeNum(patientDTO.getHomeNum());
        patientRegister.setPhoneNum(patientDTO.getPhoneNum());
        patientRegister.setEmail(patientDTO.getEmail());
        patientRegister.setDefaultAddress(patientDTO.getDefaultAddress());
        patientRegister.setDetailedAddress(patientDTO.getDetailedAddress());
        patientRegister.setMainDoc(patientDTO.getMainDoc());
        patientRegister.setVisitPath(patientDTO.getVisitPath());
        patientRegister.setCategory(patientDTO.getCategory());
        patientRegister.setTendency(patientDTO.getTendency());
        patientRegister.setFirstVisit(patientDTO.getFirstVisit());
        patientRegister.setLastVisit(patientDTO.getLastVisit());



        return patientRegisterRepository.save(patientRegister);
    }
}



