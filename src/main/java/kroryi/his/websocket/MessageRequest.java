package kroryi.his.websocket;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MessageRequest {
    private int status1;
    private int status2;
    private int status3;
}
