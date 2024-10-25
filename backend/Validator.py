import os
from langchain_groq import ChatGroq
from Prompt import get_validation_prompt

if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = "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"

# Initialize the LLM for validating solutions
validator_llm = ChatGroq(
    model="llama3-8b-8192",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

validation_prompt = get_validation_prompt()

def validate_solution(problem, solution):
    """Validate the solution using the LLM."""
    validation_result = validation_prompt | validator_llm
    response = validation_result.invoke({"problem": problem, "solution": solution})
    return response.content
