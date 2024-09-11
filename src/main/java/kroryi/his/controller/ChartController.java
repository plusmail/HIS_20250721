package kroryi.his.controller;

import kroryi.his.service.ChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

//@Controller
@RequestMapping("/his")
@Log4j2
@RequiredArgsConstructor
public class ChartController {
    private final ChartService chartService;




}
