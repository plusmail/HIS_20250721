package kroryi.his.dto;

import io.swagger.annotations.Info;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import kroryi.his.domain.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

//@Builder
@Data
@NoArgsConstructor
public class BoardDTO {
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime regDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime modDate;
    private Long bno;
    private Long id;

    public LocalDateTime getRegDate() {
        // null 처리: 만약 regDate가 null이면, 기본값을 반환
        return regDate != null ? regDate : LocalDateTime.now();  // 현재 시간으로 기본값 설정
    }

    @NotEmpty
    @Size(min = 1, max = 100)
    private String title;

    @NotEmpty
    private String content;

    @NotEmpty
    private String writer;

    public BoardDTO(Board entity) {

    }

    public BoardDTO(Long id, String title, String content, String author) {
        this.id = id;
        this.title = title;
        this.content = content;
    }

    public BoardDTO(Long bno, String title, String content, LocalDateTime regDate) {

    }

}
