package kroryi.his;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootApplication
public class HisApplication {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(HisApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void checkPasswordHashes() {
        System.out.println("=== 비밀번호 해시 확인 ===");
        System.out.println("'1111'의 해시: " + passwordEncoder.encode("1111"));
        System.out.println("user1의 DB 해시: $2a$10$EdlZeGaDHjLesRwcP/cLDOKp1yqsUwUqaxIuulJ1.9ote/TSfOhWu");
        System.out.println("user2의 DB 해시: $2a$10$oXSS2xdxuokaiZ5brWp4gORmoeLjv.WfDPKGzkzuCHs1rC.Bq.4gG");
        System.out.println("'1111'과 user1 해시 매치: " + passwordEncoder.matches("1111", "$2a$10$EdlZeGaDHjLesRwcP/cLDOKp1yqsUwUqaxIuulJ1.9ote/TSfOhWu"));
        System.out.println("'1111'과 user2 해시 매치: " + passwordEncoder.matches("1111", "$2a$10$oXSS2xdxuokaiZ5brWp4gORmoeLjv.WfDPKGzkzuCHs1rC.Bq.4gG"));
        System.out.println("==========================");
    }
}
