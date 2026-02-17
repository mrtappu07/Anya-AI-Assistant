# memory.py
# This file manages conversation memory independently

conversation_history = []

def add_message(role, content):
    conversation_history.append({
        "role": role,
        "content": content
    })

def get_history():
    return conversation_history[-10:]  # keep last 10 messages only

def clear_history():
    conversation_history.clear()