import sqlite3

def init_db():
    conn = sqlite3.connect("astra.db")
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)

    # Chats table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT,
            role TEXT,
            message TEXT
        )
    """)

    conn.commit()
    conn.close()


# ================= USER FUNCTIONS =================

def add_user(email, password):
    conn = sqlite3.connect("astra.db")
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, password)
        )
        conn.commit()
    except:
        conn.close()
        return False

    conn.close()
    return True


def validate_user(email, password):
    conn = sqlite3.connect("astra.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (email, password)
    )

    user = cursor.fetchone()
    conn.close()

    return user


# ================= CHAT FUNCTIONS =================

def save_chat(user_email, role, message):
    conn = sqlite3.connect("astra.db")
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO chats (user_email, role, message) VALUES (?, ?, ?)",
        (user_email, role, message)
    )

    conn.commit()
    conn.close()


def get_user_chats(user_email):
    conn = sqlite3.connect("astra.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT role, message FROM chats WHERE user_email=?",
        (user_email,)
    )

    chats = cursor.fetchall()
    conn.close()

    return chats