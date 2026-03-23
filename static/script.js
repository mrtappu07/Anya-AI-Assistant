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

    // 🎭 Emotion detection
    const emotion = detectEmotion(message);
    console.log("Detected Emotion:", emotion);

    // 1️⃣ Show emotion
    setAnyaEmotion(emotion);

    addMessage(message, "user");
    input.value = "";

    // 2️⃣ Talking animation delay
    setTimeout(() => {
        setAnyaEmotion("talking");
    }, 1200);

    fetch("/get_response", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
    })
    .then(res => res.json())
    .then(data => {

        addMessage(data.response, "assistant");

        // 🔥 FIX: CALL CORRECT FUNCTION
        if (typeof speakText === "function") {
            speakText(data.response);
        }

        // 3️⃣ Back to emotion
        setTimeout(() => {
            setAnyaEmotion(emotion);
        }, 1500);

        // 4️⃣ Back to idle
        setTimeout(() => {
            setAnyaEmotion("idle");
        }, 3000);
    });
}


// ✅ Enter key support
document.getElementById("user-input")
.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});


// ✅ Auto scroll on load
window.onload = function () {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
};