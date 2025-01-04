from flask import Flask, request, jsonify
from flask_cors import CORS
from lib.authentication import Authentication

app = Flask(__name__)
CORS(app)

auth = Authentication()

@app.route('/api/signup', methods=['POST'])
def signup_request():
    if auth.create_account(request.json['username'], request.json['password']):
        return jsonify({
            'result': 0, 
            "message": "OK"
        })
    return jsonify({
        'result': 1, 
        "message": "Account already exists"
    })

@app.route('/api/login', methods=['POST'])
def login_request():
    code, message = auth.verify_account(request.json['username'], request.json['password'])
    return jsonify({
        'result': code, 
        "message": message
    })

if __name__ == '__main__':
    app.run(debug=True, port=8080)