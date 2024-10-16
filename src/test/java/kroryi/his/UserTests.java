package kroryi.his;

import kroryi.his.domain.Member;
import kroryi.his.domain.MemberRole;
import kroryi.his.domain.PatientRegister;
import kroryi.his.repository.MemberRepository;
import kroryi.his.service.MemberService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Log4j2
public class UserTests {
    @Autowired
    MemberRepository memberRepository;

    @Autowired
    MemberService memberService;

    @Test
    public void testSearchName(){

        List<Member> Members = memberService.getMembersByRole(MemberRole.EMP);
        for (Member Member : Members) {
            log.info(Member.toString());
        }
    }
}
