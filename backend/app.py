from flask import Flask, send_from_directory, request, jsonify, session, make_response
from flask_cors import CORS
from flask_session import Session
from supabase import create_client
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
from dotenv import load_dotenv
from Tutor import solve_problem_with_validation
import requests
import sympy
from sympy.parsing.latex import parse_latex

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/dist')
CORS(app, supports_credentials=True)

# Secret key for session management
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Supabase setup
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
supabase = create_client(supabase_url, supabase_key)

mathpix_url = os.getenv('MATHPIX_APP_ID')
mathpix_key = os.getenv('MATHPIX_API_KEY')

def normalize_math_expression(expr):
    """Normalize a mathematical expression for comparison"""
    try:
        # Remove whitespace and convert to lowercase
        expr = ''.join(expr.lower().split())
        
        # Replace common variants
        replacements = {
            '×': '*',
            '÷': '/',
            '−': '-',
            '=': '',  # Remove equals signs for comparison
            '{': '',
            '}': '',
            '\\': '',  # Remove LaTeX backslashes
        }
        
        for old, new in replacements.items():
            expr = expr.replace(old, new)
            
        return expr
    except Exception as e:
        print(f"Error normalizing expression: {str(e)}")
        return expr

def validate_mathematical_expressions(user_input, correct_answer, input_type='latex'):
    """
    Compare two mathematical expressions for equivalence
    """
    try:
        # First try basic string comparison after normalization
        user_normalized = normalize_math_expression(user_input)
        correct_normalized = normalize_math_expression(correct_answer)
        
        if user_normalized == correct_normalized:
            return True
            
        # For numerical answers, try converting to float and compare
        try:
            user_float = float(user_normalized)
            correct_float = float(correct_normalized)
            return abs(user_float - correct_float) < 1e-6  # Allow small numerical differences
        except ValueError:
            pass

        # For symbolic expressions, try using sympy
        try:
            if input_type == 'latex':
                user_expr = parse_latex(user_input)
                correct_expr = parse_latex(correct_answer)
            else:
                user_expr = sympy.sympify(user_normalized)
                correct_expr = sympy.sympify(correct_normalized)
            
            difference = sympy.simplify(user_expr - correct_expr)
            return difference == 0
        except Exception as e:
            print(f"Symbolic comparison error: {str(e)}")
            pass

        return False
    except Exception as e:
        print(f"Validation error: {str(e)}")
        return False


# Serve the frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print(f"Requested path: {path}")
    print(f"Static folder: {app.static_folder}")
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Register a new user
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Hash the password before storing it
        hashed_password = generate_password_hash(password)

        # Store the user in the 'users' table in Supabase
        response = supabase.table('users').insert({
            'username': username,
            'email': email,
            'password': hashed_password
        }).execute()

        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        print('Error during registration:', str(e))
        return jsonify({'error': 'An error occurred during registration'}), 500


# Login a user
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Fetch the user from Supabase
        result = supabase.table('users').select('*').eq('email', email).single().execute()
        user = result.data

        if user and check_password_hash(user['password'], password):
            # Save the user id in the session
            session['user_id'] = user['id']
            return jsonify({'message': 'Login successful', 'user_id': user['id']}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        print('Error during login:', str(e))
        return jsonify({'error': 'An error occurred during login'}), 500


# Get user info from the session (API for frontend to use)
@app.route('/api/user', methods=['GET'])
def get_user_info():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    try:
        # Fetch the user from Supabase
        user_result = supabase.table('users').select('id, username, email').eq('id', user_id).single().execute()
        user = user_result.data

        if user:
            # Fetch progress for the user
            progress_result = supabase.table('progress').select('module_id, progress, completion_status').eq('user_id', user_id).execute()
            progress_data = progress_result.data or []

            # Map progress data to include module names
            module_ids = [item['module_id'] for item in progress_data]
            modules_result = supabase.table('modules').select('id, module_name').in_('id', module_ids).execute()
            modules = {module['id']: module['module_name'] for module in modules_result.data or []}

            for item in progress_data:
                item['module_name'] = modules.get(item['module_id'], 'Unknown Module')
                item['completion_percentage'] = int(item['progress'] * 100)

            return jsonify({'user': user, 'progress': progress_data}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print('Error fetching user info:', str(e))
        return jsonify({'error': 'An error occurred'}), 500


# Logout user
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove the user from the session
    return jsonify({'message': 'Logout successful'}), 200



@app.route('/api/getmodule', methods=['GET'])
def get_module():
    module_number = request.args.get('module')
    try:
        # Construct the path to the module file
        module_path = os.path.join('modules', f'Module_{module_number}.json')
        
        print(f"Fetching module from: {module_path}")  # Debugging line

        # Open and load the module JSON file
        with open(module_path) as f:
            module_data = json.load(f)
            questions = module_data.get("modules", {}).get(module_number, {}).get("questions", [])
            title = module_data.get("modules", {}).get(module_number, {}).get("title", "Module")

            if not questions:
                return jsonify({'error': 'Module not found'}), 404
            
            # Return the module title and questions directly
            module_info = {
                'title': title,
                'questions': questions
            }
            return jsonify(module_info), 200
    except FileNotFoundError:
        print("File not found")  # Debugging line
        return jsonify({'error': 'Module not found'}), 404
    except Exception as e:
        print(f"Error loading module: {e}")  # Debugging line
        return jsonify({'error': 'An error occurred while loading the module'}), 500




@app.route('/api/get_tutor_response', methods=['GET'])
def get_tutor_response():
    module = request.args.get('module')
    part = request.args.get('part')

    print(f"Received Module: {module}, Part: {part}")  # Debugging line

    try:
        file_path = f'modules/Module_{module}.json'
        print(f"Attempting to open: {file_path}")  # Debugging line
        with open(file_path) as f:
            data = json.load(f)
            
            # Access the module and part dynamically to get questions
            questions = data.get("modules", {}).get(module, {}).get("parts", {}).get(part, {}).get("questions", [])

            if not questions:
                return jsonify({'error': 'Module or part not found'}), 404
            
            # Return the entire part information for navigation
            part_info = {
                'title': data['modules'][module]['title'],
                'questions': questions
            }
            return jsonify(part_info), 200
    except FileNotFoundError:
        return jsonify({'error': 'Module or part not found'}), 404


@app.route('/api/process', methods=['POST'])
def process_input():
    data = request.json
    user_input = data.get('input', '')
    submission_type = data.get('submissionType', '')
    context = data.get('context', None)

    if submission_type == 'chat':
        try:
            # Build prompt with context if available
            prompt = user_input
            if context:
                prompt = f"""Previous topic: {context.get('topic', '')}
                Last question: {context.get('lastQuestion', '')}
                Last response: {context.get('lastResponse', '')}
                
                Current question: {user_input}"""

            # Get response from your AI processing function
            solution = solve_problem_with_validation(prompt)
            
            # Try to identify the topic being discussed
            topic = "mathematics"  # You can make this more sophisticated
            
            return jsonify({
                'response': solution,
                'topic': topic
            })
        except Exception as e:
            print(f"Error in chat processing: {str(e)}")
            return jsonify({
                'response': 'I apologize, but I had trouble processing that question. Could you rephrase it?'
            })

    if submission_type == 'validation':
        correct_answer = data.get('correctAnswer', '')
        input_type = data.get('inputType', 'latex')
        
        print(f"Comparing - User Input: '{user_input}' with Correct Answer: '{correct_answer}'")  # Add this debug line
        
        # Simple direct comparison first
        if str(user_input).strip() == str(correct_answer).strip():
            return jsonify({'isCorrect': True})
            
        return jsonify({'isCorrect': False})

    try:
        # Store input in Supabase for record-keeping
        response = supabase.table('inputs').insert({
            'text': user_input,
            'type': submission_type
        }).execute()
        print("Input stored in Supabase:", response)
    except Exception as e:
        print("Error storing input in Supabase:", str(e))
    
    # Process the input using the MathTutorValidator
    solution = solve_problem_with_validation(user_input)

    return jsonify({'response': solution})


@app.route('/api/update_user_info', methods=['PUT'])
def update_user_info():
    user_id = session.get('user_id')
    data = request.json

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    username = data.get('username')
    email = data.get('email')

    if not username or not email:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Update the user in the 'users' table in Supabase
        response = supabase.table('users').update({
            'username': username,
            'email': email
        }).eq('id', user_id).execute()

        return jsonify({'message': 'User info updated successfully'}), 200
    except Exception as e:
        print('Error updating user info:', str(e))
        return jsonify({'error': 'An error occurred during update'}), 500


@app.route('/api/process-drawing', methods=['POST'])
def process_drawing_endpoint():
    data = request.get_json()
    print(f"Received data: {data}")  # Debugging line
    image_src = data.get('src')
    formats = data.get('formats', [])
    data_options = data.get('data_options', {})

    try:
        # Call to MathPix API
        mathpix_response = requests.post('https://api.mathpix.com/v3/text', json={
            'src': image_src,
            'formats': formats,
            'data_options': data_options
        }, headers={
            'Content-Type': 'application/json',
            'app_id': mathpix_url,
            'app_key': mathpix_key
        })
        
        print(f"MathPix response: {mathpix_response.text}")  # Debugging line
        
        if mathpix_response.status_code == 200:
            return jsonify(mathpix_response.json())
        else:
            return jsonify({'error': 'Failed to process drawing', 'status_code': mathpix_response.status_code}), 500
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Debugging line
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/update-progress', methods=['POST'])
def update_progress():
    data = request.json
    user_id = data.get('user_id')
    module_id = data.get('module_id')
    progress = data.get('progress')  # Progress will be passed as a percentage (e.g., 0.5 for 50%)

    if not user_id or not module_id or progress is None:
        print(f"Missing data - User ID: {user_id}, Module ID: {module_id}, Progress: {progress}")
        return jsonify({'error': 'Missing required data'}), 400

    try:
        # Check if the user already has progress in this module
        result = supabase.table('progress').select('*').eq('user_id', user_id).eq('module_id', module_id).execute()
        existing_progress = result.data

        if existing_progress:
            # Update existing progress
            supabase.table('progress').update({
                'progress': progress,
                'completion_status': progress >= 1.0
            }).eq('user_id', user_id).eq('module_id', module_id).execute()
        else:
            # Insert new progress record
            supabase.table('progress').insert({
                'user_id': user_id,
                'module_id': module_id,
                'progress': progress,
                'completion_status': progress >= 1.0  # If progress is 100%, mark as complete
            }).execute()

        return jsonify({'message': 'Progress updated successfully'}), 200
    except Exception as e:
        print(f"Error updating progress: {str(e)}")
        return jsonify({'error': 'An error occurred while updating progress'}), 500



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)