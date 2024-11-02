# from langchain.prompts import PromptTemplate
# import os

# if "GROQ_API_KEY" not in os.environ:
#     os.environ["GROQ_API_KEY"] = "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"

# from langchain_groq import ChatGroq

# # Initialize the LLM
# llm = ChatGroq(
#     model="llama3-8b-8192",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
# )

# # Define the tutor prompt
# tutor_template = """
# You are a math tutor. Solve the following math problem: {problem}
# """
# tutor_prompt = PromptTemplate(template=tutor_template, input_variables=["problem"])

# # Define the validation prompt
# validation_template = """
# You are a math validator. Verify if the solution to the following problem is correct.
# Problem: {problem} 
# Solution: {solution}
# """
# validation_prompt = PromptTemplate(template=validation_template, input_variables=["problem", "solution"])

# # Create chains for solving and validating
# tutor_chain = tutor_prompt | llm
# validation_chain = validation_prompt | llm

# def solve_problem(problem):
#     """Solve the math problem using the LLM"""
#     result = tutor_chain.invoke({"problem": problem})
#     return result.content

# def validate_solution(problem, solution):
#     """Validate the solution using the LLM"""
#     validation_result = validation_chain.invoke({"problem": problem, "solution": solution})
#     return validation_result.content
