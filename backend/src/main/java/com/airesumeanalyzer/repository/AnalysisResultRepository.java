package com.airesumeanalyzer.repository;

import com.airesumeanalyzer.model.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {

    List<AnalysisResult> findByResumeIdOrderByCreatedAtDesc(Long resumeId);

    Optional<AnalysisResult> findFirstByResumeIdOrderByCreatedAtDesc(Long resumeId);
}
