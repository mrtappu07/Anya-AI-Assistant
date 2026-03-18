function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();

    if (message === "") return;

    // 🎭 Detect emotion
    const emotion = detectEmotion(message);
    console.log("Detected Emotion:", emotion);

    // ✅ 1. SHOW EMOTION FIRST
    setAnyaEmotion(emotion);

    addMessage(message, "user");
    input.value = "";

    // ✅ 2. AFTER DELAY → TALKING
    setTimeout(() => {
        setAnyaEmotion("talking");
    }, 1200);

    fetch("/get_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    })
    .then(res => res.json())
    .then(data => {
        addMessage(data.response, "assistant");

        // 🔊 Speak response
        speak(data.response);

        // ✅ 3. AFTER RESPONSE → BACK TO EMOTION
        setTimeout(() => {
            setAnyaEmotion(emotion);
        }, 1500);

        // ✅ 4. FINALLY → IDLE
        setTimeout(() => {
            setAnyaEmotion("idle");
        }, 3000);
    });
}

// Enter key support
document.getElementById("user-input")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    window.onload = function() {
        const chatBox = 
        this.document.getElementById("chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
    };