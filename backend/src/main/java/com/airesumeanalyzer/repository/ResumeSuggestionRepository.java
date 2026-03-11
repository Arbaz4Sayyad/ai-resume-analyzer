package com.airesumeanalyzer.repository;

import com.airesumeanalyzer.model.ResumeSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeSuggestionRepository extends JpaRepository<ResumeSuggestion, Long> {

    List<ResumeSuggestion> findByResume_IdOrderByCreatedAtDesc(Long resumeId);
}
