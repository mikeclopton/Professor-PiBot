import os
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = "https://fauengtrussed.fau.edu"
API_KEY = "e1SfwpX1wtZ8NnfjThENLSbV13NhhdP2XinEXILOoc5aAdSm"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}
