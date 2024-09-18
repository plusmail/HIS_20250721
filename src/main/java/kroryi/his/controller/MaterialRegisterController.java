package kroryi.his.controller;


import io.swagger.annotations.ApiOperation;
import kroryi.his.service.MaterialRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory_management")
@Log4j2
@RequiredArgsConstructor
public class MaterialRegisterController {
    private final MaterialRegisterService materialRegisterService;



}
