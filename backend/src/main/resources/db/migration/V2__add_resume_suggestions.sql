CREATE TABLE resume_suggestions (
    id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    resume_score INTEGER,
    missing_keywords JSONB,
    improvement_suggestions JSONB,
    optimized_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resume_suggestions_resume_id ON resume_suggestions(resume_id);
