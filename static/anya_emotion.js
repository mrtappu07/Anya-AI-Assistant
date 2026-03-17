// 😊 Astra Emotion Detection (GIF Version – Final Stable)

console.log("Astra emotion engine loaded");

const anyaEmotions = {
    idle: "/static/anya_idle.gif",
    happy: "/static/anya_happy.gif",
    thinking: "/static/anya_thinking.gif",
    surprised: "/static/anya_surprised.gif",
    sad: "/static/anya_sad.gif",
    angry: "/static/anya_angry.gif"
};

// Default emotion
window.currentAnyaEmotion = "idle";

// Detect emotion
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

// Change GIF
function setAnyaEmotion(emotion) {
    const avatar = document.getElementById("anya-avatar");

    if (!avatar) {
        console.error("Astra avatar not found");
        return;
    }

    window.currentAnyaEmotion = emotion;

    const newSrc = anyaEmotions[emotion] || anyaEmotions.idle;
    avatar.src = newSrc;

    console.log("Emotion changed to:", emotion);
}