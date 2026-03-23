import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from openai import OpenAI
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth

# Load env
load_dotenv()

# ✅ DATABASE
from database import init_db, add_user, validate_user, save_chat, get_user_chats

# Memory
from memory import add_message, get_history

app = Flask(__name__)
app.secret_key = "astra_secret_key"

# ✅ INIT DATABASE
init_db()

# ================= GOOGLE OAUTH =================
oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)

# ================= OPENROUTER =================
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

# ================= SIGNUP =================
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        if add_user(email, password):
            return redirect("/login")
        else:
            return "User already exists"

    return render_template("signup.html")


# ================= LOGIN =================
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        if validate_user(email, password):
            session["user"] = email
            return redirect("/")
        else:
            return "Invalid credentials"

    return render_template("login.html")


# ================= GOOGLE LOGIN =================
@app.route("/login/google")
def google_login():
    return google.authorize_redirect(url_for("callback", _external=True))


# ================= CALLBACK =================
@app.route("/callback")
def callback():
    try:
        token = google.authorize_access_token()
        user_info = token.get("userinfo")

        if not user_info:
            return "Failed to fetch user info"

        email = user_info["email"]

        # ✅ Auto register if not exists
        add_user(email, "google_login")

        session["user"] = email
        return redirect("/")

    except Exception as e:
        print("GOOGLE LOGIN ERROR:", e)
        return "Google login failed"


# ================= LOGOUT =================
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


# ================= HOME =================
@app.route("/")
def home():
    if "user" not in session:
        return redirect("/login")

    chats = get_user_chats(session["user"])
    return render_template("index.html", chats=chats)


# ================= CHAT =================
@app.route("/get_response", methods=["POST"])
def chatbot():
    if "user" not in session:
        return jsonify({"response": "Please login first."})

    data = request.get_json()
    user_message = data.get("message")
    user_email = session["user"]

    try:
        # ✅ Save user message
        save_chat(user_email, "user", user_message)
        add_message("user", user_message)

        today = datetime.now().strftime("%B %d, %Y")

        # 🔥 STRONG SYSTEM PROMPT (FIXED)
        system_prompt = {
            "role": "system",
            "content": (
                f"You are Astra AI, a friendly assistant. "
                f"You were developed by CSE Final Year students gpt nizamabad "
                f"Tharun, Lavanya, Bhavana, Anu, Raja Vardhan, Nauman Ali, "
                f"Mirza and Sanjay with the help of OpenAI. "

                f"If anyone asks who created you, ALWAYS reply EXACTLY with this sentence: "
                f"'I was developed by CSE Final Year students gpt nizamabad Tharun, Lavanya, Bhavana, Anu, Raja Vardhan, Nauman Ali, Mirza and Sanjay with the help of OpenAI.' "

                f"Do NOT change names. Do NOT summarize. Do NOT shorten. "

                f"You can respond in both text and voice naturally. "
                f"Today's date is {today}."
            )
        }

        # 🔥 INCLUDE CURRENT MESSAGE (VERY IMPORTANT FIX)
        messages = [system_prompt] + get_history() + [
            {"role": "user", "content": user_message}
        ]

        response = client.responses.create(
            model="openai/gpt-3.5-turbo",
            input=messages
        )

        bot_reply = response.output_text

        # ✅ Save bot reply
        save_chat(user_email, "assistant", bot_reply)
        add_message("assistant", bot_reply)

    except Exception as e:
        print("ERROR:", e)
        bot_reply = "AI connection failed."

    return jsonify({"response": bot_reply})


# ================= RUN =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))