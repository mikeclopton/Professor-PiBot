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

def solve_problem_with_hint(problem, hint_number=1, previous_messages=None):
    if previous_messages is None:
        previous_messages = []
        
    hint_prompt = f"""You are a math tutor. The student needs hint #{hint_number} for this problem.
    For hint #{hint_number}:
    - Do NOT solve the problem completely
    - Give just enough information to help them progress
    - Focus on the next step they should think about
    - Be encouraging but don't give away the solution
    
    Problem: {problem}"""
        
    conversation_history = [
        {'role': 'system', 'content': hint_prompt}
    ]
    
    # Add relevant previous messages
    for msg in previous_messages:
        if 'hint' in str(msg.get('text', '')).lower():  # Only include previous hint-related messages
            role = 'assistant' if msg['sender'] == 'ai' else 'user'
            conversation_history.append({
                'role': role,
                'content': msg['text']
            })
    
    try:
        response = requests.post(
            api_url,
            headers=headers,
            json={
                'model': 'gpt-4o',
                'messages': conversation_history,
                'max_tokens': 750,
                'temperature': 0.7
            }
        )
        
        return response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
    except Exception as e:
        print(f"Error in AI request: {e}")
        return "Error processing hint request."
    
def solve_problem_with_full_answer(problem, previous_messages=None):
    if previous_messages is None:
        previous_messages = []
        
    conversation_history = [
        {'role': 'system', 'content': """You are a math tutor. Provide a complete 
        step-by-step solution to this problem. Break down your explanation into clear steps."""}
    ]
    
    # Add previous messages to conversation history
    for msg in previous_messages:
        role = 'assistant' if msg['sender'] == 'ai' else 'user'
        conversation_history.append({
            'role': role,
            'content': msg['text']
        })
    
    # Add current request
    conversation_history.append({
        'role': 'user',
        'content': f"Please solve this problem: {problem}"
    })
    
    try:
        response = requests.post(
            api_url,
            headers=headers,
            json={
                'model': 'gpt-4o',
                'messages': conversation_history,
                'max_tokens': 750,
                'temperature': 0.7
            }
        )
        
        return response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
    except Exception as e:
        print(f"Error in AI request: {e}")
        return "Error processing solution request."