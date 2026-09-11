from app.models.groq_model import load_llm
from app.prompts.error_prompt import error_solver_prompt

llm=load_llm()
def solve_error(user_input):
    prompt = error_solver_prompt(user_input)
    result = llm.invoke(prompt)
    return result.content