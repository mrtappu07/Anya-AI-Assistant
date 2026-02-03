// 😊 Anya Emotion Detection (Frontend Only – Final Stable Version)

console.log("Anya emotion engine loaded");

const anyaEmotions = {
    idle: "/static/anya_idle.gif",
    happy: "/static/anya_happy.gif",
    thinking: "/static/anya_thinking.gif",
    surprised: "/static/anya_surprised.gif",
    sad: "/static/anya_sad.gif",
    angry: "/static/anya_angry.gif"
};

// ✅ INITIALIZE DEFAULT EMOTION (CRITICAL FIX)
window.currentAnyaEmotion = "idle";

// Detect emotion from user text
function detectEmotion(text) {
    if (!text) return "idle";

    text = text.toLowerCase();

    if (text.includes("?") || text.includes("how") || text.includes("why")) {
        return "thinking";
    }

    if (
        text.includes("wow") ||
        text.includes("amazing") ||
        text.includes("really")
    ) {
        return "surprised";
    }

    if (
        text.includes("love") ||
        text.includes("good") ||
        text.includes("great") ||
        text.includes("nice")
    ) {
        return "happy";
    }

    if (
        text.includes("sad") ||
        text.includes("cry") ||
        text.includes("lonely")
    ) {
        return "sad";
    }

    if (
        text.includes("angry") ||
        text.includes("hate") ||
        text.includes("worst")
    ) {
        return "angry";
    }

    return "idle";
}

// Change Anya avatar safely
function setAnyaEmotion(emotion) {
    const avatar = document.getElementById("anya-avatar");

    if (!avatar) {
        console.error("Anya avatar not found in DOM");
        return;
    }

    // ⭐ STORE CURRENT EMOTION GLOBALLY (CRITICAL FIX)
    window.currentAnyaEmotion = emotion;

    const newSrc = anyaEmotions[emotion] || anyaEmotions.idle;
    avatar.src = newSrc;

    console.log("Changing Anya emotion to:", emotion);
}