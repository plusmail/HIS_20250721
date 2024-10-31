package kroryi.his.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/user");  // 메시지를 전달할 경로에 /user 추가
        config.setUserDestinationPrefix("/user");      // 개인 메시징 경로를 /user로 설정
        config.setApplicationDestinationPrefixes("/app");  // 클라이언트가 메시지를 보낼 때의 경로
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")  // WebSocket 연결을 할 엔드포인트
                .setAllowedOriginPatterns("*")
                .withSockJS();  // SockJS 사용
    }
}

