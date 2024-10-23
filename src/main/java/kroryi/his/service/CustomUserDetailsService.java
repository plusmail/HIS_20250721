package kroryi.his.service;

import kroryi.his.domain.Member;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.dto.MemberSecurityDTO;
import kroryi.his.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("loadUserByUsername: {}" , username);
        Optional<Member> result = memberRepository.getWithRoles(username);
        if (result.isEmpty()) {
            throw new UsernameNotFoundException(username+"를 찾을수 없습니다.");
        }

        Member member = result.get();
        // MemberJoinDTO 객체 생성
        MemberJoinDTO memberJoinDTO = new MemberJoinDTO(
                member.getMid(),
                member.getName(), // 이름도 추가
                member.getPassword(),
                member.getEmail(),
                member.isRetirement(), // 퇴직 여부
                member.getSocial(),
                member.getRoleSet()
        );

        MemberSecurityDTO memberSecurityDTO =
                new MemberSecurityDTO(
                        memberJoinDTO,
                        member.getRoleSet()
                                .stream().map(memberRole -> new SimpleGrantedAuthority(
                                        "ROEL_" + memberRole.getRoleSet()))
                                .collect(Collectors.toList())
                );
        // Create Authentication object
        Authentication authentication = new UsernamePasswordAuthenticationToken(memberSecurityDTO, null, memberSecurityDTO.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication); // Store Authentication in SecurityContext

        log.info("memberSecurityDTO: {}", memberSecurityDTO);

        return memberSecurityDTO;
    }
}
