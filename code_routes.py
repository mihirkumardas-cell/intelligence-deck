from flask import Blueprint,render_template,request
from app.services.code_generator import generate_code
from app.services.logic_explainer import explain_logic
from app.services.error_solver import solve_error   

code_bp = Blueprint('code', __name__)#magic method __name__
#static method is used to get the name of the current module or package. It is a built-in variable in Python that holds the name of the current module or package as a string. In this case, it is used to specify the name of the blueprint when creating it.  
@code_bp.route('/', methods=['GET', 'POST'])
def home():
    response=''

    if request.method == 'POST':
        user_input = request.form['prompt']
        mode=request.form['mode']

        if mode=='generate':
            response=generate_code(user_input)
        elif mode=='explain':
            response=explain_logic(user_input)
        elif mode=='debug':
            response=solve_error(user_input)
    return render_template('index.html', response=response)

