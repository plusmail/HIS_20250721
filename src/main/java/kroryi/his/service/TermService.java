package kroryi.his.service;

import kroryi.his.domain.Term;
import kroryi.his.dto.TermDTO;

import java.util.List;

public interface TermService {
    Term saveTerm(TermDTO termDTO);
    List<Term> getAllTerms();
    List<TermDTO> getAllTermDTOs();
}
