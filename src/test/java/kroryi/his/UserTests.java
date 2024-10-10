package kroryi.his;

import kroryi.his.domain.PatientRegister;
import kroryi.his.domain.User;
import kroryi.his.repository.UserRepository;
import kroryi.his.service.UserService;
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
    UserService userService;

    @Test
    public void testUserAllFind(){

        List<User> registers = userService.findAllUsers();
        for (User register : registers) {
            log.info(register);
        }
    }
}
