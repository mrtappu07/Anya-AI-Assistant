// 🎤 Voice system loaded
console.log("voice.js loaded");

// Load voices
let voices = [];
speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    console.log("Voices loaded:", voices);
};

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
                sendMessage();
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

// ---------- TEXT TO SPEECH (MALE VOICE) ----------
function speakText(text) {
    if (!text) return;

    // Remove emojis but KEEP math symbols
    const cleanedText = text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF])/g,
        ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = "en-US";

    // 🔥 VOICE SETTINGS (Male + Sweet)
    utterance.rate = 0.9;   // slower = smoother
    utterance.pitch = 0.85; // lower = deeper (male feel)
    utterance.volume = 1;

    // 🎯 Select best male voice
    let maleVoice =
        voices.find(v => v.name.toLowerCase().includes("david")) || // Windows
        voices.find(v => v.name.toLowerCase().includes("alex")) ||  // Mac
        voices.find(v => v.name.toLowerCase().includes("male")) ||
        voices.find(v => v.name.toLowerCase().includes("english")) ||
        voices.find(v => v.lang === "en-US");

    if (maleVoice) {
        utterance.voice = maleVoice;
        console.log("Using voice:", maleVoice.name);
    }

    // 🗣 TALKING ANIMATION
    utterance.onstart = () => {
        console.log("🔊 Speaking");

        const avatar = document.getElementById("anya-avatar");
        if (avatar) {
            avatar.src = "/static/anya_talk.gif";
        }
    };

    utterance.onend = () => {
        console.log("🔊 Done speaking");

        // Restore previous emotion
        if (window.currentAnyaEmotion) {
            setAnyaEmotion(window.currentAnyaEmotion);
        }
    };

    speechSynthesis.cancel(); // stop previous speech
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