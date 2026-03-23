// 🎤 Voice system loaded
console.log("voice.js loaded");

// 🔊 VOICE CONTROL
let voiceEnabled = false;
let forceVoiceMode = false;

// 🎧 VOICE STORAGE
let voices = [];


// 🔥 FORCE LOAD VOICES (STABLE)
function loadVoices() {
    const v = speechSynthesis.getVoices();

    if (v.length > 0) {
        voices = v;

        console.log("✅ Voices loaded:", voices);
        console.log("🎤 Voice Names:", voices.map(v => v.name));
    } else {
        setTimeout(loadVoices, 200);
    }
}

// Run on start
loadVoices();


// 🔘 TOGGLE BUTTON
function toggleVoice() {
    voiceEnabled = !voiceEnabled;

    const btn = document.getElementById("voice-toggle");

    if (voiceEnabled) {
        btn.innerText = "🔊 Voice ON";

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

            document.getElementById("user-input").value = text;
            sendMessage();
        };
    }

    recognition.start();
}


// ---------- 🔊 TEXT TO SPEECH ----------
function speakText(text) {

    if (!voiceEnabled && !forceVoiceMode) return;

    // Clean emojis
    const cleanText = text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF][\uDC00-\uDFFF])/g,
        ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = "en-US";

    // 🔥 DEEP MALE-LIKE TUNING
    utterance.rate = 0.85;   // slower
    utterance.pitch = 0.6;   // deeper (key for male feel)
    utterance.volume = 1;

    // 🔥 FORCE BEST AVAILABLE ENGLISH VOICE
    let selectedVoice =
        voices.find(v => v.name.includes("English")) ||
        voices.find(v => v.lang === "en-US") ||
        voices[0];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log("🎙 Using voice:", selectedVoice.name);
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

    // 🔥 FIX: Ensure browser allows speech
    speechSynthesis.cancel();
    speechSynthesis.resume();
    speechSynthesis.speak(utterance);
}


// ---------- 🔥 AUTO SPEAK ----------
const originalAppend = window.appendMessage;

window.appendMessage = function (role, text) {
    originalAppend(role, text);

    if (role === "assistant") {
        if (voiceEnabled || forceVoiceMode) {
            speakText(text);
        }
    }
};