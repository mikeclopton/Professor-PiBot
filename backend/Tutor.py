# Tutor.py
import requests
from Prompt import get_tutor_prompt, get_validation_prompt
from functools import lru_cache

api_key = 'e1SfwpX1wtZ8NnfjThENLSbV13NhhdP2XinEXILOoc5aAdSm'
api_url = 'https://fauengtrussed.fau.edu/provider/generic/chat/completions'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

# Cache tutor responses to prevent duplicate processing
@lru_cache(maxsize=100)
def get_ai_response(problem, role='tutor'):
    """Get AI response with caching to prevent duplicate calls"""
    prompt = get_tutor_prompt() if role == 'tutor' else get_validation_prompt()
    
    conversation_history = [
        {'role': 'system', 'content': prompt.format(
            problem=problem, 
            solution='' if role == 'tutor' else problem
        )}
    ]
    
    data = {
        'model': 'gpt-4o',
        'messages': conversation_history,
        'max_tokens': 750,
        'temperature': 0.7 if role == 'tutor' else 0.1
    }

    try:
        response = requests.post(api_url, headers=headers, json=data)
        if response.status_code == 200:
            return response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
        return "Error getting AI response."
    except Exception as e:
        print(f"Error in AI request: {e}")
        return "Error processing request."

def solve_problem_with_validation(problem, submission_type=None):
    """Optimized problem solving with validation"""
    # For chat interactions, only get tutor response
    if submission_type == 'chat':
        return get_ai_response(problem, 'tutor')
        
    # For normal problem solving, get both tutor and validation
    tutor_solution = get_ai_response(problem, 'tutor')
    validation_result = get_ai_response(problem, 'validator')
    
    if "incorrect" in validation_result.lower():
        return f"{tutor_solution}\n\nNote: Solution needs review."
    
    return tutor_solution