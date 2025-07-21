package kroryi.his;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

public class PasswordEncodingTest {
    @Test
    void testPasswordMatch() {
        String raw = "1111";
        String dbHash = "$2a$10$zRA2sR7SU0NZBlqFt/ewFuvYnPqtlSTMArezEiBkP8qoGLwrGwkxO";

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        assertTrue(encoder.matches(raw, dbHash), "1111과 DB 해시가 매칭되어야 합니다");
    }

    @Test
    void printEncodedPassword() {
        String raw = "1111";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encoded = encoder.encode(raw);
        System.out.println("1111의 bcrypt 해시: " + encoded);
    }
} 