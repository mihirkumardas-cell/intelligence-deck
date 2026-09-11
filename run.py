import sys
import io
# Force UTF-8 everywhere — prevents charmap crashes on Windows with Unicode LLM output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=False)