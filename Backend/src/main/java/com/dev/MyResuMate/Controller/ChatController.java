package com.dev.MyResuMate.Controller;

import com.dev.MyResuMate.DTO.ChatRequest;
import com.dev.MyResuMate.DTO.ChatResponse;
import com.dev.MyResuMate.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/chat")
//@CrossOrigin(origins = "http://localhost:3000") // ✅ Added CrossOrigin
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/resume-helper")
    public ResponseEntity<ChatResponse> handleChat(@RequestBody ChatRequest request, Authentication authentication) {

        // ✅ Add try...catch block to handle new errors
        try {
            // 1. Pass the user's authentication info to the service
            ChatResponse reply = chatService.getSimpleChatReply(request, authentication);
            return ResponseEntity.ok(reply);

        } catch (ResponseStatusException e) {
            // 2. This catches our "limit reached" (429) or "user not found" (401) errors
            // and sends them to the frontend with the correct status code.
            // Your React code is already set up to handle this!
            ChatResponse errorResponse = new ChatResponse(e.getReason());
            return new ResponseEntity<>(errorResponse, e.getStatusCode());

        } catch (Exception e) {
            // 3. This catches any other unexpected error (like the Python service being down)
            e.printStackTrace(); // Log the full error to the console
            ChatResponse errorResponse = new ChatResponse("An internal server error occurred. Please try again later.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}