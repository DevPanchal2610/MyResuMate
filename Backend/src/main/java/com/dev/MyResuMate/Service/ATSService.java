package com.dev.MyResuMate.Service;

import com.dev.MyResuMate.DTO.AtsAnalysisResult;
import com.dev.MyResuMate.DTO.FullAnalysisResponse;
import com.dev.MyResuMate.Util.InvalidResumeException;
import org.apache.commons.io.IOUtils;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class ATSService {

    @Autowired
    private AtsScoreService atsScoreService;

    @Autowired
    private GeminiSuggestionService geminiSuggestionService;

    public AtsAnalysisResult analyzeResume(MultipartFile file) throws Exception {

        String extractedText;
        try {
            extractedText = extractTextFromPdf(file);
        } catch (IOException e) {
            throw new InvalidResumeException("Could not read the uploaded PDF file. It may be corrupt.");
        }

        if (!isLikelyResume(extractedText)) {
            throw new InvalidResumeException("The uploaded file does not appear to be a resume. Please upload a valid resume.");
        }
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

    /**
     * Extracts all text from an uploaded PDF file.
     */
    private String extractTextFromPdf(MultipartFile file) throws IOException {
        // ✅ NEW: Read the file into a byte array first
        try (InputStream inputStream = file.getInputStream()) {
            byte[] fileBytes = IOUtils.toByteArray(inputStream);

            // ✅ THEN, load the document from the byte array
            try (PDDocument document = Loader.loadPDF(fileBytes)) {

                if (document.isEncrypted()) {
                    throw new InvalidResumeException("The uploaded PDF is encrypted and cannot be read.");
                }

                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            }
        }
    }

    /**
     * Checks if the extracted text contains enough resume-like keywords.
     */
    private boolean isLikelyResume(String text) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }

        String lowerCaseText = text.toLowerCase();

        // ✅ --- NEW DISQUALIFICATION STEP ---
        // First, check for common programming keywords. If these exist,
        // it's almost certainly a code file, not a resume.
        List<String> codeKeywords = Arrays.asList(
                "import {", "const ", "public class", "package com.dev",
                "use client", "useeffect", "usestate", "componentdidmount"
        );

        boolean isCodeFile = codeKeywords.stream().anyMatch(lowerCaseText::contains);
        if (isCodeFile) {
            return false; // REJECT: This is a code file.
        }
        // ✅ --- END NEW STEP ---


        // --- EXISTING QUALIFICATION STEP ---
        // If it's not a code file, *then* check for resume keywords.
        List<String> resumeKeywords = Arrays.asList(
                "experience", "education", "skills", "summary", "objective",
                "projects", "certifications", "work history", "employment"
        );

        // Count how many of these keywords are present
        long matchCount = resumeKeywords.stream()
                .filter(lowerCaseText::contains)
                .count();

        // Must have at least 2 to be considered a resume
        return matchCount >= 2;
    }
}