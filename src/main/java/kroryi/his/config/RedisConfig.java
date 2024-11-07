package kroryi.his.config;

import kroryi.his.websocket.RedisMessageListener;
import kroryi.his.websocket.RedisSubscriber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class RedisConfig {
    // Redis 서버의 호스트 주소를 가져오는 변수
    @Value("${spring.data.redis.host}")
    private String redisHost;

    // Redis 서버의 포트 번호를 가져오는 변수
    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory redisConnectionFactory,
            MessageListenerAdapter listenerAdapter,
            MessageListenerAdapter chatListenerAdapter,
            MessageListenerAdapter reservationListenerAdapter
    ) {
        RedisMessageListenerContainer redisMessageListenerContainer = new RedisMessageListenerContainer();
        redisMessageListenerContainer.setConnectionFactory(redisConnectionFactory);
        redisMessageListenerContainer.addMessageListener(listenerAdapter,   new ChannelTopic("patientStatusUpdate"));
        redisMessageListenerContainer.addMessageListener(chatListenerAdapter,   new ChannelTopic("chatChannel"));
        redisMessageListenerContainer.addMessageListener(reservationListenerAdapter,   new ChannelTopic("reservationChannel"));

        return redisMessageListenerContainer;
    }
    @Bean
    public ChannelTopic channelTopic() {
        return new ChannelTopic("/redis/admission");
    }
//    @Bean
//    public MessageListenerAdapter messageListenerAdapter(RedisSubscriber subscriber) {
//        return new MessageListenerAdapter(subscriber, "onMessage");
//    }

//    @Bean
//    public MessageListenerAdapter listenerAdapter(RedisSubscriber redisSubscriber) {
//        return new MessageListenerAdapter(redisSubscriber, "receiveMessage");
//    }

    // MessageListenerAdapter에 리스너 메서드 등록
    @Bean
    public MessageListenerAdapter listenerAdapter(RedisMessageListener redisMessageListener) {
        // receiveMessage 메서드를 Redis 메시지 수신 메서드로 설정
        return new MessageListenerAdapter(redisMessageListener, "receiveMessage");
    }


    // MessageListenerAdapter에 리스너 메서드 등록
    @Bean
    public MessageListenerAdapter chatListenerAdapter(RedisMessageListener redisMessageListener) {
        // receiveMessage 메서드를 Redis 메시지 수신 메서드로 설정
        return new MessageListenerAdapter(redisMessageListener, "receiveChatMessage");
    }


    @Bean
    public MessageListenerAdapter reservationListenerAdapter(RedisMessageListener redisMessageListener) {
        // receiveMessage 메서드를 Redis 메시지 수신 메서드로 설정
        return new MessageListenerAdapter(redisMessageListener, "receiveReservationMessage");
    }




    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));

        return redisTemplate;
    }
}