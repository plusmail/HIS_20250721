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
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private Long roomId;
    private String senderId;
    private String senderName;
    private String recipientId;  // 수신자 ID 추가
}



