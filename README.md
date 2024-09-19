# Professor PiBot

Professor PiBot is a discrete mathematics tutor application with a Flask backend and React frontend.

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed Python 3.7+
* You have installed Node.js and npm
* You have a Windows machine

## Installing Professor PiBot

To install Professor PiBot, follow these steps:

1. Clone the repository:

git clone https://github.com/mikeclopton/Professor-PiBot.git

cd Professor-PiBot

2. Set up the backend:

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

3. Set up the frontend:

cd ../frontend

npm install

## Using Professor PiBot

To use Professor PiBot, follow these steps. Type directly into terminal:

1. Build the frontend:

cd frontend

npm run build

cd ..

2. Start the backend server:

cd backend

venv\Scripts\activate

python app.py

3. Open a web browser and navigate to `http://127.0.0.1:5000`

## Contributing to Professor PiBot

To contribute to Professor PiBot, follow these steps:

Access the Repository:

1. Go to the GitHub repository page https://github.com/mikeclopton/Professor-PiBot

2. Ensure You're on the Latest Version:

On the repository page, make sure you're on the main branch (usually shown in a dropdown near the top-left).

Look for a message that says "This branch is up to date with main" to confirm you're seeing the latest version.

3. Download the Code:

Click the green "Code" button near the top-right of the repository page.

Select "Download ZIP" from the dropdown menu.

Save and extract the ZIP file on your local machine.

4. Make Your Changes:

Open the extracted files in your preferred code editor.

Make the desired changes to the code.

5. Create a New Branch and Upload Changes:

Return to the GitHub repository page in your web browser.

Click on the branch dropdown (usually says "main" or "master").

In the text box, type a new branch name (e.g., "feature-login-update" or "bugfix-database-connection").

Click "Create branch: [your-branch-name]" to create the new branch.


6. Upload Your Changed Files:

You should now be on your new branch's page.

Click "Add file" near the top-right, then select "Upload files".

Drag and drop your modified files into the upload area, or click "choose your files" to select them.

In the "Commit changes" section at the bottom:

--Add a brief description of your changes in the first text box.
--(Optional) Add a more detailed description in the larger text box.

Ensure "Commit directly to the [your-branch-name] branch" is selected.

Click "Commit changes".

7. Create a Pull Request (Optional):

After uploading, you'll see a prompt to "Compare & pull request". Click this button.

Add any necessary comments about your changes.

Click "Create pull request" to submit your changes for review.



Important Notes:

Always create a new branch for your changes. Don't commit directly to the main branch.

Be descriptive in your commit messages and pull request descriptions.

If you're working on a specific issue, reference the issue number in your commit message or pull request (e.g., "Fixes #123").

Make sure you're only uploading files you've changed or added. Don't re-upload the entire project unless necessary.

If you're unsure about any steps, ask for help from Mike Clopton.
