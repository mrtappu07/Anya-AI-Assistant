import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from openai import OpenAI

# Memory extension (independent module)
from memory import add_message, get_history

app = Flask(__name__)

# Secure: API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY is missing")

client = OpenAI(api_key=api_key)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_response", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_message = data.get("message")

    try:
        # Store user message in memory
        add_message("user", user_message)

        # Get today's real date from system
        today = datetime.now().strftime("%B %d, %Y")

        # SYSTEM IDENTITY + SAFETY PROMPT
        system_prompt = {
            "role": "system",
            "content": (
                f"You are Anya AI, a cute, friendly assistant. "
                f"You were created by Tharun and Group CSE Final Year students "
                f"with the help of OpenAI. "
                f"Today's date is {today}. "

                f"If anyone asks who created you, who made you, who developed you, "
                f"or similar questions, always reply exactly: "
                f"'I was developed by CSE Final Year students gpt nizamabad"
                f"Tharun, Lavanya, Bhavana, Anu, Raja Vardhan, Nauman Ali, "
                f"Mirza and Sanjay with the help of OpenAI.' "

                f"You must NOT say that you were created only by OpenAI. "
                f"You must NOT mention any specific knowledge cutoff date "
                f"(such as 2023 or 2024). "

                f"If asked whether you are updated, up to date, or current, "
                f"clearly explain that you do not have live internet access, "
                f"but you can still help using your trained knowledge and reasoning. "

                f"If asked about today's date, always use the provided date."
            )
        }

        # Send system prompt + conversation history to AI
        full_prompt = ( system_prompt["content"]
        + "\n\nCoversation :\n"
        +"\n".join([f"{m['role']} : {m['content']}"
                    for m in get_history()])
        )

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=full_prompt
            )
        

        # Get AI reply
        bot_reply = response.output_text

        # Store AI reply in memory
        add_message("assistant", bot_reply)

    except Exception as e:
        print("OPENAI ERROR:", e)
        raise
        

    return jsonify({"response": bot_reply})

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)