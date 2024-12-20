from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET', 'POST'])
def return_home():
    if request.method == 'POST':
        print(request.json)
    return jsonify({
        'message': 'Welcome to the Gin Rummy Twist API!'
    })

if __name__ == '__main__':
    app.run(debug=True, port=8080)