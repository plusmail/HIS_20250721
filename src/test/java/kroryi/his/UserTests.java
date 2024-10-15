package kroryi.his;

import kroryi.his.domain.Member;
import kroryi.his.repository.UserRepository;
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
    UserRepository userRepository;

    @Autowired
    MemberService memberService;

    @Test
    public void testUserAllFind(){

        List<Member> registers = memberService.findAllUsers();
        for (Member register : registers) {
            log.info(register);
        }
    }
}
