package com.dev.MyResuMate.Service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    @Autowired
    private TemplateEngine templateEngine; // Spring Boot auto-configures this

    /**
     * Generates a PDF from a Thymeleaf template.
     *
     * @param templateName The name of the HTML file in /templates/
     * @param context      The Thymeleaf context containing all variables for the template
     * @return A byte array containing the PDF data
     */
    public byte[] generatePdfFromHtml(String templateName, Context context) throws IOException {
        // 1. Process the Thymeleaf template into a plain HTML string
        String html = templateEngine.process(templateName, context);

        // 2. Use openhtmltopdf to render the HTML into a PDF
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.withHtmlContent(html, null); // We set baseUri to null
        builder.toStream(outputStream);
        builder.run();

        return outputStream.toByteArray();
    }
}