from langchain.llms.base import LLM
from typing import Optional, List
import requests
from config import API_BASE_URL, API_KEY

class CustomLLM(LLM):
    def __init__(self, model_id: str):
        self.model_id = model_id
        self.headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        url = f"{API_BASE_URL}/api/llm/generate"
        payload = {
            "model_id": self.model_id,
            "prompt": prompt,
            "stop": stop,
        }
        response = requests.post(url, headers=self.headers, json=payload)
        if response.status_code == 200:
            return response.json().get("generated_text", "")
        else:
            raise Exception(f"LLM API call failed: {response.status_code}, {response.text}")

    @property
    def _identifying_params(self):
        return {"model_id": self.model_id}

    @property
    def _llm_type(self) -> str:
        return "custom_llm"
