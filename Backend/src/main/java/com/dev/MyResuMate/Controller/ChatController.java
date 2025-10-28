package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.ChatRequest;
import com.dev.MyResuMate.DTO.ChatResponse;
import com.dev.MyResuMate.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
//@CrossOrigin(origins = "http://localhost:3000") // Allows your React app to connect
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/resume-helper")
    public ResponseEntity<ChatResponse> handleChat(@RequestBody ChatRequest request) {
        ChatResponse reply = chatService.getSimpleChatReply(request);
        return ResponseEntity.ok(reply);
    }
}