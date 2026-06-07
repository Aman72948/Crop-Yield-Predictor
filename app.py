from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import requests

app = Flask(__name__)
# CORS को कॉन्फ़िगर किया ताकि रिएक्ट ऐप (port 5173/3000) बिना किसी एरर के कनेक्ट हो सके
CORS(app, resources={r"/*": {"origins": "*"}})

model = joblib.load('model.pkl')

YIELD_DATA = {
    'rice': 4.5, 'wheat': 3.8, 'maize': 5.2,
    'cotton': 2.1, 'sugarcane': 65, 'banana': 28,
    'tomato': 22, 'soybean': 2.4, 'bajra': 2.0,
    'paddy': 4.2, 'mango': 8, 'coconut': 14,
    'coffee': 0.9, 'jute': 2.8, 'grapes': 15,
    'apple': 10, 'orange': 12, 'papaya': 30,
    'watermelon': 25, 'muskmelon': 18,
    'blackgram': 1.1, 'lentil': 1.5,
    'chickpea': 1.8, 'kidneybeans': 1.6,
    'pigeonpeas': 1.3, 'mothbeans': 1.0,
    'mungbean': 1.2, 'pomegranate': 12
}

CROP_INFO = {
    'rice':        {'icon': '🌾', 'season': 'Kharif',  'water': 'High'},
    'wheat':       {'icon': '🌿', 'season': 'Rabi',    'water': 'Medium'},
    'maize':       {'icon': '🌽', 'season': 'Kharif',  'water': 'Medium'},
    'cotton':      {'icon': '☁️', 'season': 'Kharif',  'water': 'Medium'},
    'sugarcane':   {'icon': '🎋', 'season': 'Annual',  'water': 'Very High'},
    'banana':      {'icon': '🍌', 'season': 'Annual',  'water': 'High'},
    'bajra':       {'icon': '🌾', 'season': 'Kharif',  'water': 'Low'},
    'paddy':       {'icon': '🌾', 'season': 'Kharif',  'water': 'High'},
    'mango':       {'icon': '🥭', 'season': 'Summer',  'water': 'Medium'},
    'coconut':     {'icon': '🥥', 'season': 'Annual',  'water': 'High'},
    'coffee':      {'icon': '☕', 'season': 'Annual',  'water': 'Medium'},
    'apple':       {'icon': '🍎', 'season': 'Winter',  'water': 'Medium'},
    'orange':      {'icon': '🍊', 'season': 'Winter',  'water': 'Medium'},
    'grapes':      {'icon': '🍇', 'season': 'Annual',  'water': 'Medium'},
    'watermelon':  {'icon': '🍉', 'season': 'Summer',  'water': 'Medium'},
    'papaya':      {'icon': '🍈', 'season': 'Annual',  'water': 'Medium'},
    'muskmelon':   {'icon': '🍈', 'season': 'Summer',  'water': 'Low'},
    'jute':        {'icon': '🌿', 'season': 'Kharif',  'water': 'High'},
    'lentil':      {'icon': '🫘', 'season': 'Rabi',    'water': 'Low'},
    'blackgram':   {'icon': '🫘', 'season': 'Kharif',  'water': 'Low'},
    'chickpea':    {'icon': '🫘', 'season': 'Rabi',    'water': 'Low'},
    'kidneybeans': {'icon': '🫘', 'season': 'Kharif',  'water': 'Medium'},
    'pigeonpeas':  {'icon': '🫘', 'season': 'Kharif',  'water': 'Low'},
    'mothbeans':   {'icon': '🫘', 'season': 'Kharif',  'water': 'Low'},
    'mungbean':    {'icon': '🫘', 'season': 'Kharif',  'water': 'Low'},
    'pomegranate': {'icon': '🍎', 'season': 'Annual',  'water': 'Low'},
}

def validate_inputs(data):
    errors = []
    try:
        N = float(data.get('N', 0))
        P = float(data.get('P', 0))
        K = float(data.get('K', 0))
        temp = float(data.get('temperature', 0))
        humidity = float(data.get('humidity', 0))
        ph = float(data.get('ph', 0))
        rainfall = float(data.get('rainfall', 0))
    except (ValueError, TypeError):
        return ["Sabhi inputs numbers hone chahiye!"]

    if N == 0 and P == 0 and K == 0:
        errors.append("NPK values zero nahi ho sakti!")
    if not 10 <= N <= 140:
        errors.append("Nitrogen 10-140 ke beech hona chahiye!")
    if not 5 <= P <= 145:
        errors.append("Phosphorus 5-145 ke beech hona chahiye!")
    if not 10 <= K <= 205:
        errors.append("Potassium 10-205 ke beech hona chahiye!")
    if not 4 <= ph <= 9:
        errors.append("pH 4-9 ke beech hona chahiye!")
    if not 8 <= temp <= 45:
        errors.append("Temperature 8-45 ke beech hona chahiye!")
    if not 14 <= humidity <= 100:
        errors.append("Humidity 14-100 ke beech hona chahiye!")
    if not 20 <= rainfall <= 500:
        errors.append("Rainfall 20-500 ke beech hona chahiye!")
    return errors

WEATHER_API_KEY = "APNI_KEY_YAHAN_DAALO"

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', 'Delhi')
    try:
        url = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            'q': city,
            'appid': WEATHER_API_KEY,
            'units': 'metric'
        }
        res = requests.get(url, params=params, timeout=5)
        data = res.json()
        return jsonify({
            'temp':     round(data['main']['temp'], 1),
            'humidity': data['main']['humidity'],
            'city':     data['name']
        })
    except:
        return jsonify({'error': 'City not found'}), 400

@app.route('/recommend', methods=['POST'])
def recommend():
    body = request.json
    if not body:
        return jsonify({'error': True, 'messages': ['No data provided']}), 400
        
    errors = validate_inputs(body)
    if errors:
        return jsonify({
            'error': True,
            'messages': errors
        }), 400

    features = [[
        float(body['N']),
        float(body['P']),
        float(body['K']),
        float(body['temperature']),
        float(body['humidity']),
        float(body['ph']),
        float(body['rainfall'])
    ]]

    top_crop = model.predict(features)[0]
    probs = model.predict_proba(features)[0]
    classes = model.classes_

    ranked = sorted(
        [{'crop': c, 'score': round(p*100, 1)}
         for c, p in zip(classes, probs)],
        key=lambda x: x['score'],
        reverse=True
    )[:8]

    for item in ranked:
        info = CROP_INFO.get(item['crop'].lower(), {})
        item['icon']   = info.get('icon', '🌱')
        item['season'] = info.get('season', '-')
        item['water']  = info.get('water', '-')

    # Yield Calculation call directly backend se logic append kar rahe hain
    crop_lower = top_crop.lower()
    base_yield = YIELD_DATA.get(crop_lower, 3.0)
    m = 1.0
    if float(body['N']) > 80:               m += 0.15
    elif float(body['N']) > 50:             m += 0.08
    if float(body['P']) > 50:               m += 0.10
    if float(body['K']) > 50:               m += 0.08
    if 100 < float(body['rainfall']) < 200: m += 0.12
    
    estimated_yield = round(base_yield * m, 2)
    area = float(body.get('area', 1))

    return jsonify({
        'top_crop': top_crop,
        'ranked':   ranked,
        'yield_data': {
            'yield': estimated_yield,
            'total': round(estimated_yield * area, 2)
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)