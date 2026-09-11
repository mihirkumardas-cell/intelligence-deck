from flask import Blueprint, render_template, request
from app.services.code_generator import generate_code
from app.services.logic_explainer import explain_logic
from app.services.error_solver import solve_error

code_bp = Blueprint('code', __name__)

def sanitize(text):
    """Strip any characters that can't survive Windows charmap encoding."""
    if not text:
        return text
    return text.encode('utf-8', errors='replace').decode('utf-8')

@code_bp.route('/', methods=['GET', 'POST'])
def home():
    response = ''

    if request.method == 'POST':
        try:
            user_input = request.form['prompt']
            mode = request.form['mode']

            if mode == 'generate':
                response = sanitize(generate_code(user_input))
            elif mode == 'explain':
                response = sanitize(explain_logic(user_input))
            elif mode == 'debug':
                response = sanitize(solve_error(user_input))
        except Exception as e:
            response = f"⚠ Engine error: {str(e)}"

    return render_template('index.html', response=response)
