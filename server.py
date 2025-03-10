from flask import Flask, request, jsonify
from flask_cors import CORS  # Allows frontend to communicate with backend

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin Resource Sharing (CORS)

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.get_json()  # Receive JSON data from frontend
        
        # Debugging: Print received data in Flask console
        print("Received Data:", data)

        if not data or 'score' not in data:
            print("Error: No score found in request data.")
            return jsonify({"error": "Invalid data received"}), 400

        score = data.get('score', 0)  # Extract the score safely

        # Process the score and determine risk profile
        if score <= -10:
            profile = "Highly Risk-Averse"
        elif score >= 10:
            profile = "Highly Risk-Tolerant"
        else:
            profile = "Balanced Risk"

        response = {
            "message": "Data received successfully",
            "risk_profile": profile,
            "score": score
        }

        print("Processed Response:", response)  # Log the response
        return jsonify(response)  # Send JSON response back to frontend

    except Exception as e:
        print("Server Error:", str(e))  # Print error details in the console
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
