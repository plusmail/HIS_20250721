package kroryi.his.service.Impl;


import jakarta.persistence.EntityNotFoundException;
import kroryi.his.domain.Term;
import kroryi.his.dto.TermDTO;
import kroryi.his.repository.TermRepository;
import kroryi.his.service.TermService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TermServiceImpl implements TermService {

    private final TermRepository termRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public TermServiceImpl(TermRepository termRepository, ModelMapper modelMapper) {
        this.termRepository = termRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Term saveTerm(TermDTO termDTO) {
        Term term = modelMapper.map(termDTO, Term.class); // DTO를 엔티티로 변환
        return termRepository.save(term);
    }

    @Override
    public List<Term> getAllTerms() {
        return termRepository.findAll();
    }

    // DTO 목록 반환 메서드 추가
    public List<TermDTO> getAllTermDTOs() {
        return termRepository.findAll().stream()
                .map(term -> modelMapper.map(term, TermDTO.class)) // 엔티티를 DTO로 변환
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTerm(Long seq) {
        if (!termRepository.existsById(seq)) {
            throw new EntityNotFoundException("not found: "+seq);
        }
        termRepository.deleteById(seq);

    }


}
