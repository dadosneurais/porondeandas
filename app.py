from flask import Flask, render_template, request, jsonify
import subprocess
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.sherlock
collection = db.sherlock_search

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return render_template("index.html")
    return render_template("index.html")

@app.route("/search", methods=["POST"])
def search():
    username = request.json.get("username")

    try:
        # Executar o Sherlock
        result = subprocess.run(
            ["python", "sherlock.py", username],
            capture_output=True, text=True, check=True
        )
        output = result.stdout

        search_data = {
            "username": username,
            "output": output,
            "timestamp": datetime.utcnow()
        }

        collection.insert_one(search_data)

        return jsonify({"status": "success", "output": output})

    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": f"Erro ao executar Sherlock: {e}"})

if __name__ == "__main__":
    app.run(debug=True)
