package kroryi.his.controller;

import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.domain.User;
import kroryi.his.dto.UserDTO;
import kroryi.his.repository.UserRepository;
import kroryi.his.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Controller
@RequestMapping("/admin_management")
@Log4j2
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
   /* @GetMapping("/")
    public List<User> getAllUsers() {
        log.info("!!!!!!!!!!!!!!!!!!!");
        return userService.findAllUsers();
    }*/


    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody UserDTO userDto) {
        // 사용자 추가 로직
        System.out.println("새로운 사용자 추가: " + userDto.toString());

        // 추가된 사용자를 데이터베이스에 저장하거나 비즈니스 로직을 수행할 수 있음
        return ResponseEntity.ok("사용자가 성공적으로 추가되었습니다.");
    }

    @ApiOperation(value = "회원 등록 POST", notes = "POST방식으로 회원 등록")
    @PostMapping(value = "/save", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> saveUser(@Valid @RequestBody UserDTO userDto, BindingResult bindingResult) throws BindException {
        log.info("userDTO---------{}", userDto);

        if (bindingResult.hasErrors()) {
//            bindingResult.rejectValue("bno","값을 넣어야 합니다.");
            throw new BindException(bindingResult);
        }

        Map<String, Object> response = new HashMap<>();
        log.info("response---------{}", response);
        try {
            User user = userService.saveUser(userDto);
            log.info(user.toString());
            response.put("success", true);
            response.put("user", user);
        } catch (Exception e) {
            log.error("Error saving user", e); // 에러 로그 출력
            response.put("success", false);
            response.put("message", "에러 발생");
        }
        return response;
    }

//    @PostMapping("/save")
//    public Map<String,User> saveUser(@RequestBody UserDTO userDto) {
    // 사용자 저장 로직 처리 (데이터베이스에 저장 등)
       /* try {
            userService.saveUser(userDto);
            return ResponseEntity.ok().body(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false));
        }*/
//        Map<String,User> map = new HashMap<>();
//        User user = userService.saveUser(userDto);
//        log.info(user.toString());
//        map.put("user", user);
//        return map;
//    }

//    @PostMapping
//    public ResponseEntity<?> addUser(@RequestBody UserDTO userDTO) {
//        try {
//            userService.saveUser(User);
//            return ResponseEntity.ok().body(Map.of("success", true));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false));
//        }
//    }

    @RequestMapping("/admin/admin_management")
    public String main() {

        return "admin_management";
    }

//        //등록된 사용자 리스트 조회
//        @RequestMapping("/admin/findUserInfo.do")
//        @ResponseBody
//        public List<Map<String, Object>> findUserInfo(@RequestBody Map<String, Object> param){
//
////            List<Map<String, Object>> list = userMapper.findUserInfo(param);
//            return list;
//        }

    //등록된 사용자 삭제
    @RequestMapping("/admin/saveUserInfoRemove.do")
    @ResponseBody
    public Map<String, Object> saveUserInfoRemove(@RequestBody List<Map<String, Object>> param) {

        userService.saveUserInfoRemove(param);
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);

        return result;
    }


    //신규 사용자 등록
    @RequestMapping("/admin/saveUserInfo.do")
    @ResponseBody
    public Map<String, Object> saveUserInfo(@RequestBody Map<String, Object> param) {

        userService.saveUserInfo(param);

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);

        return result;
    }


    //사용자 정보 수정
    @RequestMapping("/admin/saveModifyUserInfo.do")
    @ResponseBody
    public Map<String, Object> saveModifyUserInfo(@RequestBody Map<String, Object> param) {

        userService.saveModifyUserInfo(param);

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("success", true);

        return result;
    }

    @GetMapping("/edit/{id}")
    public String showUpdateUserForm(@PathVariable("id") Long id, Model model) {
        User user = userService.getUserById(id);
        model.addAttribute("user");
        return "user-form";
    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/users";
    }

    @PostMapping("/searchUsers")
    @ResponseBody
    public List<User> searchUsers(@RequestBody Map<String, String> params) {
        String userId = params.get("id");
        String userName = params.get("name");
        String userRole = params.get("role");
        String startDate = params.get("startDate");

        // 검색 조건을 사용해 사용자 목록 필터링
        List<User> filteredUsers = UserRepository.findUsersByConditions(userId, userName, userRole, startDate);
        return filteredUsers;

//    @GetMapping("/login")
//    public String loginGET(String error, String logout) {
//        log.info("로그인 컨트롤러");
//        log.info("로그아웃 : {}", logout);
//        if (logout != null) {
//            log.info("회원 로그아웃");
//        }

//        return "user/login";
//
//    }

//    // 새로운 사용자 추가 폼 페이지
//    @GetMapping("/users/new")
//    public String showNewUserForm(Model model) {
//        User user = new User();
//        model.addAttribute("user", user);
//        return "admin_management";
//    }


        // 새로운 사용자 저장
    /*@PostMapping("/users")
    public String saveUser(@ModelAttribute("user") User user) {
        userService.saveUser(user);
        return "redirect:/users";  // 사용자 리스트로 리디렉션
    }*/
    }
}
