package kroryi.his.controller;

import jakarta.validation.Valid;
import kroryi.his.dto.BoardDTO;
import kroryi.his.dto.PageRequestDTO;
import kroryi.his.dto.PageResponseDTO;
import kroryi.his.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

@Controller
@RequestMapping("/board")
@Log4j2
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/register")
    public String register() {

        return "board/register";
    }

    @PostMapping("/register")
    public String registerPost(@Valid BoardDTO boardDTO,
                               BindingResult bindingResult,
                               RedirectAttributes redirectAttributes) {
        log.info("------------register============");
        if (bindingResult.hasErrors()) {
            log.info("에러발생");
            redirectAttributes.addFlashAttribute("errors", bindingResult.getAllErrors());

            return "redirect:/board/register";
        }

        Long bno = boardService.register(boardDTO);
        log.info(boardDTO);
        redirectAttributes.addFlashAttribute("result", bno);


        return "redirect:/board/list";
    }

    @GetMapping({"/read"})
    public String read(Long bno, PageRequestDTO pageRequestDTO, Model model) {
        BoardDTO boardDTO = boardService.readOne(bno);

        log.info(boardDTO);

        model.addAttribute("dto", boardDTO);

        return "board/read";
    }

    @GetMapping("/modify")
    public String modify(Long bno, PageRequestDTO pageRequestDTO, Model model) {
        log.info("-------modify -------");
        BoardDTO boardDTO = boardService.readOne(bno);
        log.info("/board/modify ---> {}", boardDTO);
        model.addAttribute("dto", boardDTO);
        return "board/modify";
    }
    @PostMapping("/modify")
    public String modify(@Valid BoardDTO boardDTO,
                         PageRequestDTO pageRequestDTO,
                         BindingResult bindingResult,
                         RedirectAttributes redirectAttributes) {
        log.info("-------modify post -------");
        if (bindingResult.hasErrors()) {
            log.info("/modify post 에러 발생 : {}", bindingResult.getAllErrors());
            String link = pageRequestDTO.getLink();
            redirectAttributes.addFlashAttribute("errors", bindingResult.getAllErrors());
            redirectAttributes.addAttribute("bno", boardDTO.getBno());
            return "redirect:/board/modify?" + link;
        }
        boardService.modify(boardDTO);
        redirectAttributes.addFlashAttribute("result", "수정됨");
        redirectAttributes.addAttribute("bno", boardDTO.getBno());
        return "redirect:/board/read";
    }
    @PostMapping("/remove")
    public String remove(Long bno, RedirectAttributes redirectAttributes) {
        boardService.remove(bno);
        redirectAttributes.addFlashAttribute("result", "삭제되었습니다.");
        return "redirect:/board/list";
    }
//    @GetMapping("/board/view/{bno}")
//    public String view(@PathVariable Long bno, Model model) {
//        // 게시글을 조회하는 서비스 호출
//        BoardDTO dto = boardService.getPost(bno);
//
//        model.addAttribute("dto", dto);
//
//        return "board/view";
//    }

    @GetMapping("/board/list")
    public String list(PageRequestDTO pageRequestDTO, Model model) {
        PageResponseDTO<BoardDTO> pageResponseDTO = boardService.getList(pageRequestDTO);
        model.addAttribute("pageResponseDTO", pageResponseDTO);
        return "board/list";
    }


}