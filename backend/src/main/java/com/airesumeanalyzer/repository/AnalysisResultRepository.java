package com.airesumeanalyzer.repository;

import com.airesumeanalyzer.model.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {

    List<AnalysisResult> findByResume_IdOrderByCreatedAtDesc(Long resumeId);

    Optional<AnalysisResult> findFirstByResume_IdOrderByCreatedAtDesc(Long resumeId);
}
