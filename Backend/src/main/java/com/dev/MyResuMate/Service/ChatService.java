package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.ChatRequest;
import com.dev.MyResuMate.DTO.ChatResponse;
import com.dev.MyResuMate.Model.User; // ✅ Import your User model
import com.dev.MyResuMate.Repository.UserRepository; // ✅ Import your User repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus; // ✅ Import HttpStatus
import org.springframework.security.core.Authentication; // ✅ Import Authentication
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ✅ Import Transactional
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException; // ✅ Import ResponseStatusException

@Service
public class ChatService {

    @Value("${chatbot.python.url}")
    private String pythonChatUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ Inject the UserRepository to find user data
    @Autowired
    private UserRepository userRepository;

    // ✅ We make this @Transactional so the user save is guaranteed
    @Transactional
    public ChatResponse getSimpleChatReply(ChatRequest chatRequest, Authentication authentication) {

        // 1. Get the currently logged-in user
        String username = authentication.getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // 2. Check the user's limits
        if (!user.isPremium()) {
            if (user.getChatPromptCount() >= 50) {
                // 3. User is not premium and has hit the limit. Throw an error.
                // The controller will catch this and send a 429 error to React.
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "You have reached your 50 free prompts. Upgrade to Premium for unlimited access!");
            }
        }

        // 4. If user is premium OR is under the limit, call the Python AI
        ChatResponse aiResponse = restTemplate.postForObject(pythonChatUrl, chatRequest, ChatResponse.class);

        if (aiResponse == null) {
            // Throw an error if the Python service is down
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Sorry, the AI assistant is currently unavailable.");
        }

        // 5. If the call was successful and the user is NOT premium, increment their count
        if (!user.isPremium()) {
            user.setChatPromptCount(user.getChatPromptCount() + 1);
            userRepository.save(user); // Save the updated count to the DB
        }

        // 6. Return the AI's reply
        return aiResponse;
    }
}