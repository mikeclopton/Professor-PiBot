from langchain.prompts import PromptTemplate

# Define the tutor prompt
tutor_template = """
You are a Discrete math tutor. Solve the following math problem: {problem}
"""
tutor_prompt = PromptTemplate(template=tutor_template, input_variables=["problem"])

# Define the validation prompt
validation_template = """
You are a Discrete math validator. Verify if the solution to the following problem is correct.
Problem: {problem}
Solution: {solution}
"""
validation_prompt = PromptTemplate(template=validation_template, input_variables=["problem", "solution"])

def get_tutor_prompt():
    """Return the tutor prompt template."""
    return tutor_prompt

def get_validation_prompt():
    """Return the validation prompt template."""
    return validation_prompt
