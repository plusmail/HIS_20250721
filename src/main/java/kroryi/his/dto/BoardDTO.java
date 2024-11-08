package kroryi.his.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import kroryi.his.domain.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardDTO {
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime regDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime modDate;
    private Long bno;
    private Long id;

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
}
