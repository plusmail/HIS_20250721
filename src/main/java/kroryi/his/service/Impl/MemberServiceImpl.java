package kroryi.his.service.Impl;

import kroryi.his.domain.Member;
import kroryi.his.domain.MemberRole;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.repository.MemberRepository;
import kroryi.his.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public void join(MemberJoinDTO memberJoinDTO) throws MemberService.MidExistException {
        String mid = memberJoinDTO.getMid();
        boolean exist = memberRepository.existsById(mid);
        if (exist) throw new MidExistException();

        Member member = modelMapper.map(memberJoinDTO, Member.class);
        member.changePassword(passwordEncoder.encode(memberJoinDTO.getPassword()));

        member.addRole(MemberRole.EMP);
        log.info("============");
        log.info(member);
        log.info(member.getRoleSet());
        memberRepository.save(member);
    }
}