package kroryi.his;

import kroryi.his.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SpringSecurityAuthTest {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Test
    void testPasswordMatchesDirectly() {
        String username = "user1";
        String rawPassword = "1111";
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // 직접 비밀번호 체크
        assertTrue(passwordEncoder.matches(rawPassword, userDetails.getPassword()),
                "입력한 비밀번호와 DB 해시가 매칭되어야 합니다");
    }

    @Test
    void testSpringSecurityAuthentication() {
        String username = "user1";
        String rawPassword = "1111";

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        Authentication auth = new UsernamePasswordAuthenticationToken(username, rawPassword);

        Authentication result = provider.authenticate(auth);

        assertTrue(result.isAuthenticated(), "Spring Security 인증이 성공해야 합니다");
        assertEquals(username, result.getName());
    }
} 