package com.airesumeanalyzer.service;

import com.airesumeanalyzer.dto.CandidateSearchDto;
import com.airesumeanalyzer.model.AnalysisResult;
import com.airesumeanalyzer.model.Resume;
import com.airesumeanalyzer.repository.AnalysisResultRepository;
import com.airesumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final ResumeRepository resumeRepository;
    private final AnalysisResultRepository analysisResultRepository;

    public List<CandidateSearchDto> searchCandidates(String skillsFilter, Integer minAtsScore) {
        List<Resume> resumes = resumeRepository.findAll();

        return resumes.stream()
                .map(resume -> {
                    var lastAnalysis = analysisResultRepository.findFirstByResume_IdOrderByCreatedAtDesc(resume.getId());
                    Integer atsScore = lastAnalysis.map(AnalysisResult::getAtsScore).orElse(null);
                    if (minAtsScore != null && (atsScore == null || atsScore < minAtsScore)) {
                        return null;
                    }
                    String text = resume.getExtractedText();
                    if (skillsFilter != null && !skillsFilter.isBlank()) {
                        String[] terms = skillsFilter.toLowerCase().split("\\s*,\\s*");
                        boolean hasSkill = false;
                        for (String term : terms) {
                            if (text != null && text.toLowerCase().contains(term.trim())) {
                                hasSkill = true;
                                break;
                            }
                        }
                        if (!hasSkill && terms.length > 0 && !terms[0].isBlank()) {
                            return null;
                        }
                    }
                    String preview = text != null && text.length() > 300 ? text.substring(0, 300) + "..." : text;
                    return CandidateSearchDto.builder()
                            .resumeId(resume.getId())
                            .userId(resume.getUser().getId())
                            .email(resume.getUser().getEmail())
                            .fileName(resume.getFileName())
                            .extractedTextPreview(preview)
                            .lastAtsScore(atsScore)
                            .skills(lastAnalysis.map(AnalysisResult::getMatchedSkills).orElse(List.of()))
                            .uploadedAt(resume.getUploadedAt())
                            .build();
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}
