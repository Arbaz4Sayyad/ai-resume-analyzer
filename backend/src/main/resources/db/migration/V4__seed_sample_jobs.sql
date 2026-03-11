-- Sample jobs for recommendations (when AI returns empty)
INSERT INTO jobs (title, company, description, required_skills) VALUES
('Senior Software Engineer', 'Tech Corp', 'Build scalable backend systems', '["Java", "Spring Boot", "PostgreSQL", "Docker"]'::jsonb),
('Full Stack Developer', 'StartupXYZ', 'Develop web applications', '["React", "Node.js", "TypeScript", "MongoDB"]'::jsonb),
('DevOps Engineer', 'Cloud Inc', 'Manage CI/CD and infrastructure', '["Docker", "Kubernetes", "AWS", "Terraform"]'::jsonb),
('Data Engineer', 'DataCo', 'Design data pipelines', '["Python", "Spark", "SQL", "Airflow"]'::jsonb),
('Frontend Developer', 'Web Agency', 'Create responsive UIs', '["React", "Vue", "CSS", "JavaScript"]'::jsonb);
