package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.AtsAnalysisResult;
import com.dev.MyResuMate.DTO.FullAnalysisResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class ATSService {

    @Autowired
    private AtsScoreService atsScoreService;

    @Autowired
    private GeminiSuggestionService geminiSuggestionService;

    public AtsAnalysisResult analyzeResume(MultipartFile file) throws Exception {
        // Step 1: Call Python microservice
        String pythonUrl = "http://localhost:8000/analyze";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<FullAnalysisResponse> response = restTemplate.postForEntity(pythonUrl, requestEntity, FullAnalysisResponse.class);
        FullAnalysisResponse parsedData = response.getBody();
        if (parsedData == null) {
            throw new Exception("Failed to get parsed data from Python service.");
        }

        // Step 2: Get score and detailed feedback from our new diagnostic engine
        AtsScoreService.ScoreWithFeedback scoreAndFeedback = atsScoreService.analyzeAndScore(parsedData.content(), parsedData.design());

        // Step 3: Get high-level AI suggestions
        List<String> aiSuggestions = geminiSuggestionService.getSuggestions(parsedData.content());

        // Step 4: Combine everything into the final result
        return new AtsAnalysisResult(
                parsedData.content(),
                parsedData.design(),
                scoreAndFeedback.score(),
                scoreAndFeedback.feedback(),
                aiSuggestions
        );
    }
}