package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.dto.RequestData;
import kroryi.his.service.ChartPiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Log4j2
@RequiredArgsConstructor
@RestController
public class ChartPiController {

    private final ChartPiService chartPiService;

    @PostMapping("/medical_chart/addDelete-to-subList")
    private ResponseEntity<List<String>> addDeleteToSubList(@RequestBody RequestData data) {
        return chartPiService.addDeleteToSubList(data);
    }

    @GetMapping("/medical_chart/get-session-items")
    public List<List<String>> getSessionItems(HttpSession session) {
        return chartPiService.getSessionItems(session.getAttribute("nestedList"));
    }
}
