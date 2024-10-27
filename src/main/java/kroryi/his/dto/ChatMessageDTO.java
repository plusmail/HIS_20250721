package kroryi.his.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Long id;             // 메시지 ID
    private String content;       // 메시지 내용
    private LocalDateTime timestamp; // 메시지 전송 시간
    private Long roomId;          // 채팅방 ID
    private String senderId;      // 발신자 ID (Member의 mid)
}

