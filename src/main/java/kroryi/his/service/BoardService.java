package kroryi.his.service;


import kroryi.his.domain.Board;
import kroryi.his.dto.BoardDTO;
import kroryi.his.dto.PageRequestDTO;
import kroryi.his.dto.PageResponseDTO;
import kroryi.his.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public interface BoardService {

    List<BoardDTO> getLatestPosts();

    Long register(BoardDTO dto);

    BoardDTO readOne(Long id);

    void modify(BoardDTO dto);

    void remove(Long id);

    PageResponseDTO<BoardDTO> list(PageRequestDTO pageRequestDTO);

    PageResponseDTO<BoardDTO> getList(PageRequestDTO pageRequestDTO);
}
