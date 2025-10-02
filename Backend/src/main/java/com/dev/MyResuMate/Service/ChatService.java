package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.ChatRequest;
import com.dev.MyResuMate.DTO.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatService {

    // Reads the URL of your Python service from application.properties
    @Value("${chatbot.python.url}")
    private String pythonChatUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public ChatResponse getSimpleChatReply(ChatRequest chatRequest) {
        // Forward the incoming request directly to the Python URL
        ChatResponse aiResponse = restTemplate.postForObject(pythonChatUrl, chatRequest, ChatResponse.class);

        if (aiResponse == null) {
            // A simple fallback if the Python service isn't reachable
            return new ChatResponse("Sorry, the AI assistant is currently unavailable.");
        }

        return aiResponse;
    }
}