from langchain.prompts import PromptTemplate

# Define the tutor prompt
tutor_template = """
You are an expert in Discrete Mathematics and a dedicated tutor. Your task is to help students solve the following problem step by step. 
Choose the most efficient method to solve the problem.

Problem: {problem}

Answer with clear, well-structured steps.
"""
tutor_prompt = PromptTemplate(template=tutor_template, input_variables=["problem"])

# Define the validation prompt
validation_template = """
You are an expert validator of Discrete Mathematics problems. Your task is to verify whether the following solution is correct. 
If the solution is incorrect, provide a detailed explanation of the mistake, and suggest how the problem should be solved correctly.

Problem: {problem}
Solution: {solution}

Validation Result: 
- State whether the solution is correct.
- If incorrect, explain what is wrong and provide the correct solution.
"""
validation_prompt = PromptTemplate(template=validation_template, input_variables=["problem", "solution"])

def get_tutor_prompt():
    """Return the tutor prompt template."""
    return tutor_prompt

def get_validation_prompt():
    """Return the validation prompt template."""
    return validation_prompt
