import requests

API_KEY = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyAmAixF69dmV8C_JrbCQFxCtstzBX5dfbE'  # <-- Replace with your Gemini API key

url = f'https://generativelanguage.googleapis.com/v1/models?key={API_KEY}'

response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    models = data.get('models', [])
    print("✅ Available Gemini Models:\n")
    for model in models:
        print(f"- {model['name']}")
else:
    print(f"❌ Failed to fetch models. Status: {response.status_code}")
    print(response.text)
