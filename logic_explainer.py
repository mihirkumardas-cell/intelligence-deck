from app.models.groq_model import load_llm
from app.prompts.logic_prompts import logic_explainer_prompt

llm=load_llm()

def explain_logic(user_input):
    prompt = logic_explainer_prompt(user_input)
    result=llm.invoke(prompt)
    return result.content