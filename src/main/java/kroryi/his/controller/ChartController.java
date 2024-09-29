package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.service.ChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

//@Controller
@RequestMapping("/his")
@Log4j2
@RequiredArgsConstructor
@Controller
@RestController
public class ChartController {


    @PostMapping("/add-to-session")
    @ResponseBody
//    public String addToSession(@RequestBody Map<String, String> payload, HttpSession session) {
    public String addToSession(@RequestBody List<String> newItem, HttpSession session) {
        List<List<String>> nestedList = (List<List<String>>) session.getAttribute("nestedList");

        // 세션에 다중 배열이 없으면 새로 생성
        if (nestedList == null) {
            nestedList = new ArrayList<>();
            for(int i = 0; i<4; i++){
                nestedList.add(new ArrayList<>());
            }
        }
        log.info(nestedList);
        // 다중 배열에 새로운 리스트 추가
        nestedList.add(newItem);
        session.setAttribute("nestedList", nestedList);
        return "Nested item added";
    }
    // 세션에 배열을 저장하는 엔드포인트
    @PostMapping("/save-to-session")
    public String saveArrayToSession(@RequestBody List<List<String>> nestedList, HttpSession session) {
        // 세션에 이중 리스트 저장
        session.setAttribute("nestedList", nestedList);
        return "Items updated in session";
    }

//    @GetMapping("/get-session-items")
//    @ResponseBody
//    public List<String> getSessionItems(HttpSession session) {
//        // 세션에서 값 가져오기
//        List<String> itemList = (List<String>) session.getAttribute("itemList");
//        log.info("------------ -> {}", itemList);
//        return itemList != null ? itemList : new ArrayList<>();
//    }

//    @GetMapping("/get-session-items")
//    public List<List<String>> getNestedSession(HttpSession session) {
//        List<List<String>> nestedList = (List<List<String>>) session.getAttribute("nestedList");
//        return nestedList != null ? nestedList : new ArrayList<>();
//    }


    // 세션에서 배열을 가져오는 엔드포인트
    @GetMapping("/get-session-items")
    public List<List<String>> getSessionItems(HttpSession session) {
        // 세션에서 "nestedList" 가져오기
        List<List<String>> nestedList = (List<List<String>>) session.getAttribute("nestedList");

        // 세션에 값이 없을 경우 빈 이중 리스트를 반환
        if (nestedList == null) {
            nestedList = new ArrayList<>();
            for(int i = 0; i<4; i++){
                nestedList.add(new ArrayList<>());
            }
        }

        return nestedList;
    }
}
