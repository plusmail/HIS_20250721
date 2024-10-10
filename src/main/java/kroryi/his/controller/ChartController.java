package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.service.ChartService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
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
    private final ChartService chartService;
}
