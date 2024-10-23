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
        log.info("loadUserByUsername: {}", username);
        Optional<Member> result = memberRepository.getWithRoles(username);

        if (result.isEmpty()) {
            throw new UsernameNotFoundException(username + "를 찾을 수 없습니다.");
        }

        Member member = result.get();

//        String mid,
//        String email,
//        String name,
//        String password,
//        boolean retirement,
//        String social,
//        LocalDateTime regDate,
//        LocalDateTime modDate,
//        String address,
//        String detailAddress,
//        int zipCode

        // MemberJoinDTO 객체 생성
        MemberJoinDTO memberJoinDTO = new MemberJoinDTO(
                member.getMid(),
                member.getEmail(),
                member.getName(), // 이름도 추가
                member.getPassword(),
                member.isRetirement(), // 퇴직 여부
                member.getSocial(),
                member.getRegDate(),
                member.getModDate(),
                member.getAddress(),
                member.getDetailAddress()
        );

        // MemberSecurityDTO 객체 생성
        MemberSecurityDTO memberSecurityDTO = new MemberSecurityDTO(
                memberJoinDTO,
                member.getRoleSet()
                        .stream()
                        .map(memberRole -> new SimpleGrantedAuthority("ROLE_" + memberRole.getRoleSet()))
                        .collect(Collectors.toList())
        );

        log.info("----------------memberSecurityDTO: {}", memberSecurityDTO);

        // Create Authentication object
        Authentication authentication = new UsernamePasswordAuthenticationToken(memberSecurityDTO, null, memberSecurityDTO.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication); // Store Authentication in SecurityContext

        // Log current Authentication
        log.info("Current Authentication: {}", SecurityContextHolder.getContext().getAuthentication());
        return memberSecurityDTO;
    }
}
