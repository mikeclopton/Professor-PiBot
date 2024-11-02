import requests
from config import API_BASE_URL, API_KEY, HEADERS

def create_llm_instance():
    url = f"{API_BASE_URL}/api/llm/create"  # Use base URL with endpoint
    data = {
        "provider": "OpenAI",
        "name": "My_LLM_Instance",
        "models": [{"model_name": "gpt-4"}],
        "openai": {"api_key": API_KEY}
    }
    response = requests.post(url, headers=HEADERS, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to create LLM instance:", response.status_code, response.text)
        return None
    
def get_llm_instance(model_id):
    url = f"{API_BASE_URL}/api/llm/get"
    params = {"id": model_id}
    response = requests.get(url, headers=HEADERS, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch LLM instance:", response.status_code, response.text)
        return None
