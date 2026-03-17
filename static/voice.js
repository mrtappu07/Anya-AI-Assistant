// 🎤 Voice system loaded
console.log("voice.js loaded");

// 🔊 VOICE CONTROL
let voiceEnabled = false;      // Chat UI default = OFF
let forceVoiceMode = false;   // Single-click mode = FORCE ON

// Load voices
let voices = [];
speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    console.log("Voices loaded:", voices);
};

// 🔘 TOGGLE BUTTON FUNCTION
function toggleVoice() {
    voiceEnabled = !voiceEnabled;

    const btn = document.getElementById("voice-toggle");

    if (voiceEnabled) {
        btn.innerText = "🔊 Voice ON";
    } else {
        btn.innerText = "🔇 Voice OFF";
    }
}

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

    const cleanedText = text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF])/g,
        ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = "en-US";

    // 🔥 Male + Sweet voice tuning
    utterance.rate = 0.9;
    utterance.pitch = 0.85;
    utterance.volume = 1;

    let maleVoice =
        voices.find(v => v.name.toLowerCase().includes("david")) ||
        voices.find(v => v.name.toLowerCase().includes("alex")) ||
        voices.find(v => v.name.toLowerCase().includes("male")) ||
        voices.find(v => v.name.toLowerCase().includes("english")) ||
        voices.find(v => v.lang === "en-US");

    if (maleVoice) {
        utterance.voice = maleVoice;
        console.log("Using voice:", maleVoice.name);
    }

    // 🗣 Talking animation
    utterance.onstart = () => {
        console.log("🔊 Speaking");

        const avatar = document.getElementById("anya-avatar");
        if (avatar) {
            avatar.src = "/static/anya_talk.gif";
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

// ---------- CONTROLLED AUTO SPEAK ----------
const originalAddMessage = window.addMessage;

window.addMessage = function (text, sender) {
    originalAddMessage(text, sender);

    if (sender === "bot") {
        // 🔥 KEY LOGIC
        if (voiceEnabled || forceVoiceMode) {
            speakText(text);
        }
    }
};