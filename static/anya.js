// ================= ANYA INTERACTION + POSITION CONTROLLER =================

const DOUBLE_CLICK_TIME = 300;
let clickCount = 0;
let clickTimer = null;

function bindAnyaEvents() {
    const anya = document.getElementById("anya-container");
    const chatUI = document.getElementById("chat-ui");

    if (!anya || !chatUI) {
        setTimeout(bindAnyaEvents, 200);
        return;
    }

    console.log("Astra controller loaded with position + voice mode logic");

    // 🔹 Default position: CENTER
    anya.classList.add("center-position");
    anya.classList.remove("corner-position");

    anya.addEventListener("pointerdown", () => {
        clickCount++;

        // ================= SINGLE CLICK =================
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                console.log("Astra single click → voice mode ON");

                // 🎤 Enable FORCE voice mode
                if (typeof forceVoiceMode !== "undefined") {
                    forceVoiceMode = true;
                    voiceEnabled = true;
                }

                // Start mic
                if (typeof startVoiceInput === "function") {
                    startVoiceInput();
                }

                clickCount = 0;
            }, DOUBLE_CLICK_TIME);
        }

        // ================= DOUBLE CLICK =================
        else if (clickCount === 2) {
            console.log("Astra double click → chat mode (voice OFF)");

            clearTimeout(clickTimer);
            clickTimer = null;
            clickCount = 0;

            // 🔇 Disable voice in chat mode
            if (typeof forceVoiceMode !== "undefined") {
                forceVoiceMode = false;
                voiceEnabled = false;
            }

            // Reset button UI
            const btn = document.getElementById("voice-toggle");
            if (btn) {
                btn.innerText = "🔇 Voice OFF";
            }

            // Move Astra to top-right corner
            anya.classList.remove("center-position");
            anya.classList.add("corner-position");

            // Toggle chat UI
            chatUI.classList.toggle("hidden");
        }
    });
}

// Initialize safely
bindAnyaEvents();