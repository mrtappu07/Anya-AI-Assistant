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

    console.log("Anya controller loaded with position logic");

    // 🔹 Default position: CENTER
    anya.classList.add("center-position");
    anya.classList.remove("corner-position");

    anya.addEventListener("pointerdown", () => {
        clickCount++;

        if (clickCount === 1) {
            // Wait to check for double click
            clickTimer = setTimeout(() => {
                // SINGLE CLICK → MIC ONLY (POSITION UNCHANGED)
                console.log("Anya single click → mic ON (stay center)");

                if (typeof startVoiceInput === "function") {
                    startVoiceInput();
                }

                clickCount = 0;
            }, DOUBLE_CLICK_TIME);
        }

        else if (clickCount === 2) {
            // DOUBLE CLICK → CHAT + MOVE TO CORNER
            console.log("Anya double click → chat + move to corner");

            clearTimeout(clickTimer);
            clickTimer = null;
            clickCount = 0;

            // Move Anya to top-right corner
            anya.classList.remove("center-position");
            anya.classList.add("corner-position");

            // Toggle chat UI
            chatUI.classList.toggle("hidden");
        }
    });
}

// Initialize safely
bindAnyaEvents();