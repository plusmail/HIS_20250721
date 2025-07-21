package kroryi.his.controller;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kroryi.his.domain.Board;
import kroryi.his.dto.BoardDTO;
import kroryi.his.dto.MemberSecurityDTO;
import kroryi.his.dto.PageRequestDTO;
import kroryi.his.dto.PageResponseDTO;
import kroryi.his.service.BoardService;
import kroryi.his.service.PatientRegisterService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@Log4j2
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 모든 출처를 허용 (보안상 좋지 않을 수 있으니 주의)
public class HomeController {
    private final PatientRegisterService patientRegisterService;
    private final BoardService boardService;

    //    @Autowired
//    public HomeController(BoardService boardService, PatientRegisterService patientRegisterService) {
//        this.boardService = boardService;
//        this.patientRegisterService = patientRegisterService;
//    }
//



    @GetMapping("/home")
    public String home(@AuthenticationPrincipal Object user, Model model, HttpSession session) {
        System.out.println("user class: " + (user != null ? user.getClass() : "null"));
        System.out.println("user: " + user);
        try {
            if (user != null) {
                model.addAttribute("user", user.getUsername());
                session.setAttribute("user", user);
            } else {
                return "redirect:/member/login";
            }
            log.info("Current Authentication: {}", SecurityContextHolder.getContext().getAuthentication());

            List<BoardDTO> latestPosts = boardService.getLatestPosts();

            // 포맷된 날짜를 포함하는 DTO 리스트 생성
            List<BoardDTO> boardDTOS = latestPosts.stream()
                    .map(post -> new BoardDTO(post.getBno(), post.getTitle(), post.getContent(),
                            post.getRegDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))) // 날짜 포맷팅
                    .collect(Collectors.toList());

            model.addAttribute("latestPosts", boardDTOS);

            log.info("최신 게시글: {}", boardDTOS); // 포맷된 게시글 로그
            log.info("세선 값 {}", session.getAttribute("user"));
            log.info("User authorities: {}", user.getAuthorities());

            log.info("최신 게시글: {}", latestPosts);

            log.info("세선 값 {}", session.getAttribute("user"));
            log.info("User authorities: {}", user.getAuthorities());

            return "home";

        } catch (Exception e) {
            log.error("홈페이지 로드중 오류 발생", e);
            return "error";
        }
    }

    //    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @GetMapping("/admin_management")
    public String adminManagement() {
        return "admin_management";
    }

    //    환자등록
    @GetMapping("/patient_register")
    public String patientRegister(Model model) {
        List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가
        return "patient_register"; // Thymeleaf 템플릿 이름
    }

    //    진료예약
    @GetMapping("/reservation")
    public String reservation() {
        return "reservation";
    }

    //    진료차트
    @GetMapping("/medical_chart")
    public String medical_chart(Model model) {
        List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가
        return "medical_chart";
    }

    //    진료접수
    @GetMapping("/reception")
    public String reception(Model model) {
        List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가

        return "reception";
    }

    //    재고관리
    @GetMapping("/inventory_management")
    public String inventory_management() {
        return "inventory_management";
    }

    @GetMapping("/board/list")
    public String list(Model model, PageRequestDTO pageRequestDTO) {
        PageResponseDTO<BoardDTO> responseDTO = boardService.list(pageRequestDTO);

//        PageResponseDTO<BoardListReplyCountDTO> responseDTO = boardService.listWithReplyCount(pageRequestDTO);
//        PageResponseDTO<BoardListAllDTO> responseDTO = boardService.listWithAll(pageRequestDTO);

        log.info("!!!!!!!!!!" + responseDTO);

        model.addAttribute("responseDTO", responseDTO);

        return "board/list";
    }

    @GetMapping("/api/user/session")
    @ResponseBody
    public ResponseEntity<MemberSecurityDTO> getUserSession(HttpSession session) {
        MemberSecurityDTO user = (MemberSecurityDTO) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
