package com.airesumeanalyzer.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.stream.Collectors;

@Service
public class ResumeTextExtractor {

    public String extractText(InputStream inputStream, String fileName) throws IOException {
        if (fileName.toLowerCase().endsWith(".pdf")) {
            return extractFromPdf(inputStream);
        } else if (fileName.toLowerCase().endsWith(".docx")) {
            return extractFromDocx(inputStream);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Use PDF or DOCX.");
        }
    }

    private String extractFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document).trim();
        }
    }

    private String extractFromDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            return document.getParagraphs().stream()
                    .map(XWPFParagraph::getText)
                    .collect(Collectors.joining("\n"))
                    .trim();
        }
    }
}
