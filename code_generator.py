from app.models.groq_model import load_llm
from app.prompts.code_prompt import code_generate_prompt

llm = load_llm()
def generate_code(user_input):
    prompt = code_generate_prompt(user_input)
    result = llm.invoke(prompt)
    return result.content