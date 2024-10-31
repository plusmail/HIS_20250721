package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.domain.Member;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.dto.MemberSecurityDTO;
import kroryi.his.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/member")
@Log4j2
@RequiredArgsConstructor
@SessionAttributes("loggedInUser")
public class MemberController {
    private final MemberService memberService;
//    private final AuthenticationManager authenticationManager;

    @GetMapping("/login")
    public String loginGET(@RequestParam(required = false) String error, @RequestParam(required = false) String logout) {
        log.info("로그인 컨트롤러");
        if (logout != null) {
            log.info("회원 로그아웃");
        }
        if (error != null) {
            log.error("로그인 실패: {}", error);
        }
        return "user/login"; // 로그인 페이지로 리턴
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
//        // 사용자 인증
//        Member user = memberService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
//
//        if (user != null) {
//            // 인증 성공 시 세션에 사용자 ID 저장
//            session.setAttribute("loggedInUserId", user.getMid());
//            log.info("User logged in with ID: " + user.getMid());
//            return ResponseEntity.ok("Login successful");
//        } else {
//            log.error("로그인 실패: 유효하지 않은 자격 증명");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//        }
//    }
    // 사용자 목록을 채팅에서 사용하기 위해 추가
    @GetMapping("/list")
    @ResponseBody
    public List<MemberJoinDTO> getAllMembers() {
        return memberService.getAllUserIdAndName();
    }

    @PostMapping("/login-proc")
    public String login(@RequestParam String username, @RequestParam String password, HttpSession session) {
        Member user = memberService.findMemberByUsernameAndPassword(username, password);
        if (user != null) {
            session.setAttribute("user", user); // 세션에 "user" 이름으로 사용자 정보 저장
            System.out.println("로그인 성공, 세션에 저장된 사용자 ID: " + user.getMid());
            return "redirect:/home";
        }
        return "redirect:/member/login?error";
    }


    @GetMapping("/logout")
    public String logout(SessionStatus status) {
        status.setComplete(); // 세션에서 'loggedInUser' 속성 제거
        return "redirect:/member/login?logout";
    }
}
