package com.cargoshare.config;
import com.cargoshare.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.config.*;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.*;
import org.springframework.web.socket.config.annotation.*;
@Configuration @EnableWebSocketMessageBroker @RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
 private final JwtUtil jwt;
 public void configureMessageBroker(MessageBrokerRegistry c) { c.enableSimpleBroker("/topic"); c.setApplicationDestinationPrefixes("/app"); }
 public void registerStompEndpoints(StompEndpointRegistry r) { r.addEndpoint("/ws").setAllowedOriginPatterns("http://localhost:5173", "http://127.0.0.1:5173").withSockJS(); }
 public void configureClientInboundChannel(ChannelRegistration r) {
  r.interceptors(new ChannelInterceptor() {
   public Message<?> preSend(Message<?> m, MessageChannel c) {
    var a=MessageHeaderAccessor.getAccessor(m, StompHeaderAccessor.class);
    if (a==null) return m;
    if (a.getCommand()==StompCommand.CONNECT) {
     String h=a.getFirstNativeHeader("Authorization");
     if(h==null || !h.startsWith("Bearer ") || !jwt.validateToken(h.substring(7))) throw new IllegalArgumentException("Authentication required");
     String id=jwt.getUserIdFromToken(h.substring(7)).toString(); a.setUser(() -> id);
    }
    if(a.getCommand()==StompCommand.SEND) throw new IllegalArgumentException("Use authenticated chat API");
    if(a.getCommand()==StompCommand.SUBSCRIBE) {
     if(a.getUser()==null) throw new IllegalArgumentException("Authentication required");
     String d=a.getDestination();
     boolean allowed=d!=null && d.matches("/topic/containers/(all|CNT-[0-9]+)");
     if(d!=null && d.matches("/topic/chat/[0-9]+_[0-9]+")) {
      var ids=d.substring("/topic/chat/".length()).split("_"); allowed=java.util.Arrays.asList(ids).contains(a.getUser().getName());
     }
     if(!allowed) throw new IllegalArgumentException("Private channel");
    }
    return m;
   }
  });
 }
}
