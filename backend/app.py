from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from supabase import create_client
import os
from dotenv import load_dotenv
from MathTutorValidator import validate_solution, solve_problem

load_dotenv()

app = Flask(__name__, static_folder='../frontend/dist')
CORS(app)

# Supabase setup
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
supabase = create_client(supabase_url, supabase_key)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print(f"Requested path: {path}")
    print(f"Static folder: {app.static_folder}")
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/process', methods=['POST'])
def process_input():
    data = request.json
    user_input = data.get('input', '')
    print("Received input from frontend:", user_input)

    submission_type = data.get('submissionType', '')
    
    # Store input in Supabase
    try:
        response = supabase.table('inputs').insert({'text': user_input, 'type': submission_type}).execute()
        print("Input stored in Supabase:", response)
    except Exception as e:
        print("Error storing input in Supabase:", str(e))
    
    # # Placeholder response until OpenAI is integrated
    # ai_response = f"OpenAI API not configured. Your {submission_type} input was: {user_input}" 
    
     
    solution = solve_problem(user_input)

    validation = validate_solution(user_input, solution)
    
    return jsonify({
        'response':solution
    })

    # return jsonify({'response': ai_response})

if __name__ == '__main__':
    app.run(debug=True)