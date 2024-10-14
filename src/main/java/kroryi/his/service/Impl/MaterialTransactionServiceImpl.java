package kroryi.his.service.Impl;

import kroryi.his.repository.CompanyRegisterRepository;
import kroryi.his.repository.MaterialRegisterRepository;
import kroryi.his.service.MaterialTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Log4j2
@Service
public class MaterialTransactionServiceImpl implements MaterialTransactionService {

    private final MaterialRegisterRepository materialRepository;
    private final CompanyRegisterRepository companyRepository;
    private final ModelMapper modelMapper;


}
