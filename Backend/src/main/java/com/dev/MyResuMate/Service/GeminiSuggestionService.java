package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.Resume1;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiSuggestionService {

    private final WebClient webClient;
    private final String geminiApiKey;
    private final ObjectMapper mapper = new ObjectMapper(); // Re-use ObjectMapper instance

    public GeminiSuggestionService(WebClient.Builder webClientBuilder, @Value("${gemini.api.url}") String geminiApiUrl, @Value("${gemini.api.key}") String geminiApiKey) {
        this.webClient = webClientBuilder.baseUrl(geminiApiUrl).build();
        this.geminiApiKey = geminiApiKey;
    }

    public List<String> getSuggestions(Resume1 resumeContent) throws JsonProcessingException {
        String resumeJson = mapper.writeValueAsString(resumeContent);

        String prompt = "You are an expert career coach and professional resume writer. Based on the following resume data in JSON format, provide a list of 5-7 specific, actionable, and encouraging suggestions for improvement. Focus on content, clarity, and impact. Do not comment on design (like photos or fonts). Respond with only a JSON object containing a single key 'suggestions' which is an array of strings. Your response must be only the raw JSON object, starting with '{' and ending with '}'.";

        // This structure is specific to the Gemini API request format
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt + "\n\nJSON Resume Data: " + resumeJson)
                        ))
                )
        );

        String response = webClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", geminiApiKey).build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block(); // Using block for simplicity

        // Parse the response to extract the suggestions array
        JsonNode root = mapper.readTree(response);
        JsonNode textNode = root.at("/candidates/0/content/parts/0/text");

        List<String> suggestions = new ArrayList<>();
        if (textNode.isTextual()) {
            String rawText = textNode.asText();

            // --- NEW: Robust JSON Cleanup Logic ---
            // This finds the start and end of the JSON object, ignoring any surrounding text or markdown.
            int startIndex = rawText.indexOf('{');
            int endIndex = rawText.lastIndexOf('}');

            if (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
                String cleanJsonText = rawText.substring(startIndex, endIndex + 1);

                try {
                    JsonNode innerJson = mapper.readTree(cleanJsonText);
                    JsonNode suggestionArray = innerJson.get("suggestions");
                    if (suggestionArray != null && suggestionArray.isArray()) {
                        for (JsonNode node : suggestionArray) {
                            suggestions.add(node.asText());
                        }
                    }
                } catch (JsonProcessingException e) {
                    // This will catch errors if the cleaned text is still not valid JSON
                    System.err.println("Failed to parse cleaned JSON from Gemini response: " + e.getMessage());
                }
            }
            // --- End of new logic ---
        }
        return suggestions;
    }
}