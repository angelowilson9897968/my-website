from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin Resource Sharing (CORS)

# ✅ Home Route to Check Server Status
@app.route('/')
def home():
    return "Flask server is running!"

# ✅ Endpoint to Handle Risk Score Submission
@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.get_json()
        print("Received Data:", data)

        if not data or 'score' not in data:
            print("Error: No score found in request data.")
            return jsonify({"error": "Invalid data received"}), 400

        score = data.get('score', 0)

        # Determine risk profile based on score
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

        print("Processed Response:", response)
        return jsonify(response)

    except Exception as e:
        print("Server Error:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500

# ✅ New Endpoint to Fetch Portfolio Details Based on Risk Score
@app.route('/get-portfolio', methods=['POST'])
def get_portfolio():
    try:
        data = request.get_json()
        score = data.get('score')

        if score is None:
            return jsonify({"error": "Score is missing"}), 400

        # ✅ Connect to the Database
        conn = sqlite3.connect('portfolios.db')
        cursor = conn.cursor()

        # ✅ Fetch Portfolio Details for the Given Score
        cursor.execute('''
            SELECT id, expected_return, standard_deviation 
            FROM portfolios 
            WHERE risk_score = ?
        ''', (score,))
        portfolio = cursor.fetchone()

        if not portfolio:
            return jsonify({"error": "Portfolio not found"}), 404

        portfolio_id, expected_return, std_dev = portfolio

        # ✅ Fetch Asset Allocations for this Portfolio
        cursor.execute('''
            SELECT a.asset_name, pa.allocation_percentage 
            FROM portfolio_assets pa
            JOIN assets a ON pa.asset_id = a.id
            WHERE pa.portfolio_id = ?
        ''', (portfolio_id,))
        assets = cursor.fetchall()

        conn.close()

        # ✅ Build the Response Data
        response = {
            "score": score,
            "expected_return": f"{expected_return:.2f}%",
            "standard_deviation": f"{std_dev:.2f}%",
            "assets": [{"name": asset[0], "allocation": f"{asset[1]:.2f}%"} for asset in assets]
        }

        print("Portfolio Data:", response)
        return jsonify(response)

    except Exception as e:
        print("Server Error:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500

# ✅ Start the Flask Server
if __name__ == '__main__':
    # For local testing only. Gunicorn will be used in production.
    app.run(host='0.0.0.0', port=5000)
