// 🎤 Voice system loaded
console.log("voice.js loaded");

// 🔊 VOICE CONTROL
let voiceEnabled = false;
let forceVoiceMode = false;

// Load voices
let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    console.log("Voices loaded:", voices);
};


// 🔘 TOGGLE BUTTON
function toggleVoice() {
    voiceEnabled = !voiceEnabled;

    const btn = document.getElementById("voice-toggle");

    if (voiceEnabled) {
        btn.innerText = "🔊 Voice ON";

        // 🔥 Speak last assistant message
        const messages = document.querySelectorAll(".message.assistant");

        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1].innerText;
            speakText(lastMsg);
        }

    } else {
        btn.innerText = "🔇 Voice OFF";
        speechSynthesis.cancel();
    }
}


// ---------- 🎤 SPEECH TO TEXT ----------
let recognition;
let isListening = false;

function startVoiceInput() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition not supported");
        return;
    }

    if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;

            const input = document.getElementById("user-input");
            input.value = text;

            sendMessage();
        };
    }

    recognition.start();
}


// ---------- 🔊 TEXT TO SPEECH ----------
function speakText(text) {

    if (!voiceEnabled && !forceVoiceMode) return;

    const cleanText = text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF])/g,
        ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // 🔥 Better voice selection
    let selectedVoice =
        voices.find(v => v.name.includes("Google")) ||
        voices.find(v => v.lang === "en-US");

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log("Using voice:", selectedVoice.name);
    }

    // 🗣 Avatar animation
    utterance.onstart = () => {
        const avatar = document.getElementById("anya-avatar");
        if (avatar) {
            avatar.src = "/static/anya_talk.gif";
        }
    };

    utterance.onend = () => {
        const avatar = document.getElementById("anya-avatar");
        if (avatar) {
            avatar.src = "/static/anya_idle.gif";
        }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}


// ---------- 🔥 AUTO SPEAK FIX ----------
const originalAppend = window.appendMessage;

window.appendMessage = function (role, text) {

    originalAppend(role, text);

    // ✅ FIX: assistant instead of bot
    if (role === "assistant") {
        if (voiceEnabled || forceVoiceMode) {
            speakText(text);
        }
    }
};