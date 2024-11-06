import requests
from Prompt import get_tutor_prompt
from Validator import validate_solution

api_key = 'e1SfwpX1wtZ8NnfjThENLSbV13NhhdP2XinEXILOoc5aAdSm'
api_url = 'https://fauengtrussed.fau.edu/provider/generic/chat/completions'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

def solve_problem_with_validation(problem):
    """Gets the tutor's solution and then validates it."""
    
    # First get the tutor's explanation
    tutor_solution = get_tutor_solution(problem)
    
    # Then get validation
    validation_result = validate_solution(problem, tutor_solution)
    
    # Only retry if validation fails
    if "incorrect" in validation_result.lower():
        print("Solution was incorrect, validator feedback:", validation_result)
        # Could implement retry logic here
        return tutor_solution + "\n\nNote: Solution needs review."
    
    return tutor_solution

def get_tutor_solution(problem):
    """Get only the tutor's solution using a teaching-focused model."""
    conversation_history = [
        {'role': 'system', 'content': get_tutor_prompt().format(problem=problem)}
    ]
    
    data = {
        'model': 'gpt-4o',  # Could use a different model optimized for teaching
        'messages': conversation_history,
        'max_tokens': 500,
        'temperature': 0.7  # Higher temperature for more creative explanations
    }

    response = requests.post(api_url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
    else:
        return "Error getting tutor response."