from __future__ import annotations

import json
from pathlib import Path
from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "static" / "data"

app = Flask(__name__)


def load_projects() -> list[dict]:
    projects_path = DATA_DIR / "projects.json"
    if not projects_path.exists():
        return []
    with projects_path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    return data.get("projects", [])


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/api/projects")
def api_projects():
    # Serve project cards from local JSON so content is easy to edit.
    return jsonify({"projects": load_projects()})


@app.post("/api/chat")
def api_chat():
    # Simple rule-based assistant; no external API needed.
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip().lower()

    responses = {
        "projects": "I build automation tools, dashboards, and full-stack web apps. Check out the Projects section for details.",
        "technologies": "My core stack is Python, Flask, JavaScript, HTML, CSS, and automation tooling with APIs.",
        "contact": "You can reach me via the Email Me button or at yourname@example.com.",
    }

    if any(keyword in message for keyword in ["project", "portfolio", "work"]):
        reply = responses["projects"]
    elif any(keyword in message for keyword in ["tech", "stack", "language", "framework"]):
        reply = responses["technologies"]
    elif any(keyword in message for keyword in ["contact", "email", "reach"]):
        reply = responses["contact"]
    else:
        reply = (
            "I can help with projects, technologies, or contact details. "
            "Try asking: 'What projects did you build?'"
        )

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)
