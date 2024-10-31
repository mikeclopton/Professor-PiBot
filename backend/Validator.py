import requests
from Prompt import get_validation_prompt

api_key = 'e1SfwpX1wtZ8NnfjThENLSbV13NhhdP2XinEXILOoc5aAdSm'
api_url = 'https://fauengtrussed.fau.edu/provider/generic/chat/completions'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

def validate_solution(problem, solution):
    """Validate the solution using Trussed AI."""
    # Use validation prompt template
    conversation_history = [
        {'role': 'system', 'content': get_validation_prompt().format(problem=problem, solution=solution)}
    ]
    data = {
        'model': 'gpt-4o',
        'messages': conversation_history,
        'max_tokens': 500,
        'temperature': 0.5
    }

    response = requests.post(api_url, headers=headers, json=data)
    if response.status_code == 200:
        validation_feedback = response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
        print(f"Validation feedback: {validation_feedback}")
        return validation_feedback
    else:
        print(f"Failed to get response from validator LLM: {response.status_code} - {response.text}")
        return "Error in validator LLM feedback."
