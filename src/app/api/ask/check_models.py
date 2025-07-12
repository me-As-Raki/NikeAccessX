import requests

# ✅ Only the API key here, NOT the full URL
API_KEY = 'AIzaSyAmAixF69dmV8C_JrbCQFxCtstzBX5dfbE'

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
