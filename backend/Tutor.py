import os
from langchain_groq import ChatGroq
from Prompt import get_tutor_prompt
from Validator import validate_solution  # Import the validator to check correctness

if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = "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"

# Initialize the LLM for solving problems
tutor_llm = ChatGroq(
    model="llama3-8b-8192",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

tutor_prompt = get_tutor_prompt()

def solve_problem_with_validation(problem, max_attempts=3):
    """Solve the math problem using the LLM and re-attempt if the validation fails."""
    attempt = 0
    is_valid = False
    solution = None

    while attempt < max_attempts and not is_valid:
        attempt += 1
        print(f"Attempt {attempt}: Solving problem '{problem}'")

        # Generate a solution from the tutor LLM
        result = tutor_prompt | tutor_llm
        solution = result.invoke({"problem": problem}).content
        print(f"Tutor LLM solution: {solution}")

        # Validate the solution
        validation_response = validate_solution(problem, solution)
        print(f"Validation result: {validation_response}")

        if "correct" in validation_response.lower():
            is_valid = True
        else:
            print(f"Solution was incorrect. Tutor will attempt again...")

    if is_valid:
        return solution  # Return the correct solution
    else:
        return f"Could not solve the problem correctly after {max_attempts} attempts."
