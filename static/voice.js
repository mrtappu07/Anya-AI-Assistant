speechSynthesis.onvoiceschanged = () => {
    console.log("Voices loaded:", speechSynthesis.getVoices());
};
console.log("voice.js loaded");

// ---------- SPEECH TO TEXT (MIC) ----------
let recognition;
let isListening = false;

function startVoiceInput() {
    console.log("Mic button clicked");

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser");
        return;
    }

    if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening = true;
            console.log("🎤 Listening...");
        };

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            console.log("🎤 Heard:", text);

            const input = document.getElementById("user-input");
            if (input) {
                input.value = text;
                sendMessage(); // send automatically
            }
        };

        recognition.onerror = (e) => {
            console.error("Mic error:", e);
        };

        recognition.onend = () => {
            isListening = false;
            console.log("🎤 Mic stopped");
        };
    }

    if (!isListening) {
        recognition.start();
    }
}

// ---------- TEXT TO SPEECH ----------
function speakText(text) {
    if (!text) return;

    // Remove emojis but KEEP math symbols
    const cleanedText = text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF])/g,
        ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    const femaleVoice =
        voices.find(v => v.name.toLowerCase().includes("zira")) ||
        voices.find(v => v.name.toLowerCase().includes("female")) ||
        voices.find(v => v.name.toLowerCase().includes("google us english")) ||
        voices.find(v => v.name.toLowerCase().includes("google")) ||
        voices.find(v => v.lang === "en-US");

    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
        console.log("🔊 Speaking");
        if (window.currentAnyaEmotion) {
            document.getElementById("anya-avatar").src = "/static/anya_talk.gif";
        }
    };

    utterance.onend = () => {
        console.log("🔊 Done speaking");
        if (window.currentAnyaEmotion) {
            setAnyaEmotion(window.currentAnyaEmotion);
        }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

// ---------- AUTO SPEAK BOT MESSAGE ----------
const originalAddMessage = window.addMessage;
window.addMessage = function (text, sender) {
    originalAddMessage(text, sender);

    if (sender === "bot") {
        speakText(text);
    }
};