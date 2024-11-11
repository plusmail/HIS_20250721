package kroryi.his.domain;

import jakarta.persistence.*;
import kroryi.his.dto.ChatMessageDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    private String lastMessage;

    private LocalDateTime lastMessageTimestamp;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "chat_room_members",
            joinColumns = @JoinColumn(name = "chat_room_id"),
            inverseJoinColumns = @JoinColumn(name = "member_mid", referencedColumnName = "mid") // Member.mid를 참조
    )
    private Set<Member> members = new HashSet<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private Set<ChatMessage> messages = new HashSet<>();

    @ElementCollection
    private Set<String> memberMids;

    @ElementCollection
    private List<String> recipientIds;  // 기본 수신자 ID

    public ChatRoom(String roomName) {
        this.roomName = roomName;
    }

}
