from flask import Flask, send_from_directory, request, jsonify, session, make_response
from flask_cors import CORS
from flask_session import Session
from supabase import create_client
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
from dotenv import load_dotenv
from MathTutorValidator import validate_solution, solve_problem


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/dist')
CORS(app, supports_credentials=True)

# Secret key for session management (required for using Flask sessions)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  # Ensure you have this set in your .env
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on the filesystem
Session(app)

# Supabase setup
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')
supabase = create_client(supabase_url, supabase_key)


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
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        print('Error during login:', str(e))
        return jsonify({'error': 'An error occurred during login'}), 500


# Logout user
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove the user from the session
    return jsonify({'message': 'Logout successful'}), 200


@app.route('/api/user', methods=['GET'])
def get_user_info():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    try:
        # Fetch the user from Supabase
        result = supabase.table('users').select('username, email').eq('id', user_id).single().execute()
        user = result.data

        if user:
            response = make_response(jsonify({'user': user, 'progress': []}))  # Add actual progress logic here
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response, 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print('Error fetching user info:', str(e))
        return jsonify({'error': 'An error occurred'}), 500



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
            
            return jsonify({'questions': questions}), 200
    except FileNotFoundError:
        return jsonify({'error': 'Module or part not found'}), 404


# Process input for AI tutoring
@app.route('/api/process', methods=['POST'])
def process_input():
    data = request.json
    user_input = data.get('input', '')
    submission_type = data.get('submissionType', '')
    print("Received input from frontend:", user_input)

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
    solution = solve_problem(user_input)
    validation = validate_solution(user_input, solution)

    return jsonify({'response': solution, 'validation': validation})


# Update user information
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




# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
