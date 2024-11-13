package kroryi.his.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDTO {
    private Long id;
    private String roomName;
    private Set<String> memberMids;
    private List<String> recipientIds;  // 기본 수신자 ID
    private ChatMessageDTO lastMessage;
    private LocalDateTime lastMessageTimestamp;
}
