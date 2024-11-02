import requests
from Prompt import get_tutor_prompt
from Validator import validate_solution

api_key = 'e1SfwpX1wtZ8NnfjThENLSbV13NhhdP2XinEXILOoc5aAdSm'
api_url = 'https://fauengtrussed.fau.edu/provider/generic/chat/completions'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
}

def solve_problem_with_validation(problem, max_attempts=5):
    """Solve the math problem using Trussed AI, re-attempting if validation fails."""
    attempt = 0
    is_valid = False
    solution = None
    modified_problem = problem

    while attempt < max_attempts and not is_valid:
        attempt += 1
        print(f"Attempt {attempt}: Solving problem '{modified_problem}'")

        # Use tutor prompt template
        conversation_history = [
            {'role': 'system', 'content': get_tutor_prompt().format(problem=modified_problem)}
        ]
        data = {
            'model': 'gpt-4o',
            'messages': conversation_history,
            'max_tokens': 500,
            'temperature': 0.5
        }

        response = requests.post(api_url, headers=headers, json=data)
        if response.status_code == 200:
            solution = response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
            print(f"Tutor LLM solution: {solution}")
        else:
            print(f"Failed to get response from tutor LLM: {response.status_code} - {response.text}")
            return "Error with tutor LLM."

        # Validate solution
        validation_feedback = validate_solution(problem, solution)
        print(f"Validation feedback: {validation_feedback}")

        if "incorrect" in validation_feedback.lower():
            modified_problem = f"{problem}\n\nCorrection suggested by validator:\n{validation_feedback}"
            is_valid = False
            print("Solution was incorrect. Tutor will attempt again with additional feedback.")
        else:
            is_valid = True

    return solution if is_valid else f"Could not solve the problem correctly after {max_attempts} attempts."
