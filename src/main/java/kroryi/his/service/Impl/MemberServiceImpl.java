package kroryi.his.service.Impl;

import kroryi.his.domain.Member;
import kroryi.his.domain.MemberRole;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.mapper.UserMapper;
import kroryi.his.repository.MemberRepository;
import kroryi.his.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private UserMapper userMapper;

    @Override
    public void join(MemberJoinDTO memberJoinDTO) throws MemberService.MidExistException {
        String mid = memberJoinDTO.getMid();
        boolean exist = memberRepository.existsById(mid);
        if (exist) throw new MidExistException();

        Member member = modelMapper.map(memberJoinDTO, Member.class);
        member.changePassword(passwordEncoder.encode(memberJoinDTO.getPassword()));

        Set<MemberRole> rolesSet = memberJoinDTO.getRoles();

        if(rolesSet.contains(MemberRole.EMP)) {
            member.addRole(MemberRole.EMP);
        } else if (rolesSet.contains(MemberRole.ADMIN)) {
            member.addRole(MemberRole.ADMIN);
        } else if (rolesSet.contains(MemberRole.DOCTOR)) {
            member.addRole(MemberRole.DOCTOR);

        } else if (rolesSet.contains(MemberRole.NURSE)) {
            member.addRole(MemberRole.NURSE);
        }else{
            member.addRole(MemberRole.EMP);
        }
        log.info("============");
        log.info(member);
        log.info(member.getRoleSet());
        memberRepository.save(member);
    }

    @Override
    public void saveUserInfoRemove(List<Map<String, Object>> list) {

        //체크한 항목이 여러개일 수 있으므로
        //리스트로 전달받고 for문 돌려서 1개씩 삭제
        for (Map<String, Object> map : list) {
            userMapper.saveUserInfoRemove(map);
        }
    }

    @Override
    public void saveUserInfo(Map<String, Object> map) {

        String orgPassword = (String) map.get("userPwd");
        String userId = (String) map.get("userId");
        System.out.println("orgPassword: " + orgPassword);
//        String encPassword = initUserPassword(orgPassword, userId);
//        map.put("userPwd", encPassword);
        userMapper.saveUserInfo(map);
    }

    @Override
    public void saveModifyUserInfo(Map<String, Object> map) {

        String orgPassword = (String) map.get("userPwd");
        String userId = (String) map.get("userId");

        if ("".equals(orgPassword)) {
            //수정된 팝업에서 비밀번호를 입력하지 않은 경우에는 업데이트 되지 않도록 공백을 보내줌
            map.put("userPwd", orgPassword);
        } else {
            //비밀번호를 입력한 경우에는 암호화된 비밀번호로 map에 재세팅해서 보내줌

//            String encPassword = initUserPassword(orgPassword, userId);
//            map.put("userPwd", encPassword);
        }
        userMapper.saveModifyUserInfo(map);
    }

    @Override
    public Member getUserById(Long id) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }

    @Override
    public List<Member> getMembersByRole(MemberRole role) {
        return memberRepository.findByRoleSet(role);
    }

    @Override
    public List<MemberJoinDTO> getMembers() {
        List<Member> members = memberRepository.findAll();
        return members.stream()
                .map(member -> new MemberJoinDTO(
                        member.getMid(),
                        member.getName(),
                        member.getPassword(),
                        member.getEmail(),
                        member.isRetirement(),
                        member.getSocial(),
                        member.getRoleSet()
                ))
                .collect(Collectors.toList());
    }
}