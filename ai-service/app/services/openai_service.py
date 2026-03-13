import openai

class OpenAIService:
    def __init__(self, api_key):
        openai.api_key = api_key

    def extract_skills(self, resume):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Extract skills from the following resume: {resume}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def get_ats_score(self, resume, job_description):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Calculate ATS score for this resume against the job description: {job_description}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def generate_questions(self, job_description):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Generate interview questions for the following job description: {job_description}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def compare_job_description(self, resume, job_description):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Compare this resume with the job description: {job_description}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def get_resume_suggestions(self, resume):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Provide suggestions to improve the following resume: {resume}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def analyze_resume_match(self, resume, job_description):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Analyze the match between this resume and the job description: {job_description}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def improve_resume(self, resume):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'How can I improve this resume? {resume}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def generate_interview_questions(self, job_description):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Create interview questions for this job description: {job_description}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def mock_interview_evaluate(self, responses):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Evaluate the following mock interview responses: {responses}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def get_job_recommendations(self, resume):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': f'Provide job recommendations based on this resume: {resume}'}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']

    def resume_chat(self, query):
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': query}],
            temperature=0.3
        )
        return response['choices'][0]['message']['content']
