package kroryi.his.service.Impl;

import kroryi.his.domain.PatientRegister;
import kroryi.his.domain.PatientRegisterMemo;
import kroryi.his.dto.PatientMemoDTO;
import kroryi.his.repository.PatientMemoRepository;
import kroryi.his.repository.PatientRegisterRepository;
import kroryi.his.service.PatientRegisterMemoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class PatientRegisterMemoServiceImpl implements PatientRegisterMemoService {
    private final PatientMemoRepository patientMemoRepository;
    private final ModelMapper modelMapper;
    private final PatientRegisterRepository patientRegisterRepository;


    @Override
    public Long register(PatientMemoDTO patientMemoDTO) {
        PatientRegister patientRegister = patientRegisterRepository.findById(patientMemoDTO.getMemoCharNum())
                .orElseThrow(() -> new IllegalArgumentException("환자가 없음"));

        PatientRegisterMemo patientRegisterMemo = modelMapper.map(patientMemoDTO, PatientRegisterMemo.class);
        patientRegisterMemo.setMemoChartNum(patientRegister.getChartNum());

        Long mmo = patientMemoRepository.save(patientRegisterMemo).getMmo();

        patientMemoRepository.insertPatientRegMemo(patientRegister.getChartNum(), mmo);
        return mmo;
    }

    @Override
    @Transactional
    public void remove(Long mmo) {
        // Delete dependent records first
        patientMemoRepository.deleteByMemosMmo(mmo);

        // Then delete the memo itself
        patientMemoRepository.deleteById(mmo);
    }
    @Override
    public void modify(PatientMemoDTO patientMemoDTO) {
        Optional<PatientRegisterMemo> patientRegisterMemoOptional = patientMemoRepository.findById(patientMemoDTO.getMmo());

        PatientRegisterMemo patientRegisterMemo = patientRegisterMemoOptional.orElseThrow();

        // 내용 및 등록 날짜 수정
        patientRegisterMemo.changeText(patientMemoDTO.getContent()); // 내용 수정
        patientRegisterMemo.setRegDate(patientMemoDTO.getRegDate()); // 등록 날짜 수정

        // 수정된 메모 저장
        patientMemoRepository.save(patientRegisterMemo);
    }
}
