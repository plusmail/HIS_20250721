package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@Log4j2
@RequiredArgsConstructor
@RestController
public class ChartSessionController {
    private HttpSession session;
    // 세션에서 "nestedList" 가져오기





    @PostMapping("/his/add-to-sublist")
    @ResponseBody
    public String addToSubList(@RequestParam int subListIndex, @RequestParam String newValue, HttpSession session) {
        // 세션에서 이중 리스트 가져오기
        List<List<String>> nestedList = getSessionItems(session);
        log.info("addToSubList--------> {}", subListIndex);
        log.info("addToSubList--------> {}", newValue);
        log.info(nestedList);
        if (nestedList == null) {
            return "No data found in session.";
        }

        // 원하는 subList가 존재하는지 확인하고 값 추가
        if (subListIndex < nestedList.size() && nestedList.get(subListIndex) != null) {
            List<String> innerList = nestedList.get(subListIndex); // subList[0] 배열 가져오기
            innerList.add(newValue); // 값 추가 (push와 동일한 동작)
        } else {
            return "Sublist not found.";
        }

        // 변경된 이중 리스트를 세션에 다시 저장
        session.setAttribute("nestedList", nestedList);
        return "Value added to sublist.";
    }

    @PostMapping("/his/change-to-sublist")
    @ResponseBody
    public String changeToSubList(@RequestParam int subListIndex, @RequestParam String newValue, HttpSession session) {
        // 세션에서 이중 리스트 가져오기
        List<List<String>> nestedList = getSessionItems(session);
        log.info("addToSubList--------> {}", subListIndex);
        log.info("addToSubList--------> {}", newValue);
        log.info(nestedList);
        if (nestedList == null) {
            return "No data found in session.";
        }

        // 원하는 subList가 존재하는지 확인하고 값 추가
        if (subListIndex < nestedList.size() && nestedList.get(subListIndex) != null) {
            List<String> innerList = nestedList.get(subListIndex); // subList[0] 배열 가져오기
            innerList.removeIf(item -> item.equals(newValue)); // 값 추가 (push와 동일한 동작)
        } else {
            return "Sublist not found.";
        }

        // 변경된 이중 리스트를 세션에 다시 저장
        session.setAttribute("nestedList", nestedList);
        return "Value added to sublist.";
    }

    // 세션에서 배열을 가져오는 엔드포인트
    @GetMapping("/his/get-session-items")
    public List<List<String>> getSessionItems(HttpSession session) {

       List<List<String>> nestedList = (List<List<String>>) session.getAttribute("nestedList");

        // 세션에 값이 없을 경우 빈 이중 리스트를 반환
        if (nestedList == null) {
            nestedList = new ArrayList<>();
            for (int i = 0; i < 4; i++) {
                nestedList.add(new ArrayList<>());
                if (i == 3) {
                    nestedList.get(i).add("삭제");
                }
            }


        }

        log.info("sessionItem-> {}", nestedList);
        return nestedList;
    }
}
