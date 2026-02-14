function nextPage() {

    // Start background music on first user interaction
    if (bgMusic && bgMusic.paused) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(err => console.warn('BGM play failed:', err));
    }

    document.querySelector('.intro').style.display = "none";
    const page2 = document.querySelector('.page2');
    page2.classList.remove("hidden");
    setTimeout(() => page2.classList.add("show"), 50);
    startTyping();
}





/* ================= TYPING ================= */

const lines = [
    "You're the person God has gifted me....",
    "Sometimes I can't believe how lucky I am to have a partner ,a best friend a therapist all in one person.",
    "I may not be a perfect bf, sob somoy rag kori, but I promise to always try to be the best for you.",
    "Tui jei bhabe amar rag sojjo koris seta hoyeto ar keo parbe na ajker din a.",
    "I'm really lucky to have you in my life.",
    "Amar sob ta jure e tui achis , siggiri jabo kolkata tokhon oneeeeek ador korbo ❤️"
];

let lineIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingEl;

function startTyping() {
    typingEl = document.getElementById("typing-text");
    // start preloading story GIFs in background so they're ready for page3
    preloadStoryGifs().catch(() => { });
    typeLoop();
}

function typeLoop() {
    const line = lines[lineIndex];

    if (!isDeleting) {
        typingEl.textContent = line.slice(0, ++charIndex);
        if (charIndex === line.length) {
            if (lineIndex === lines.length - 1) {
                setTimeout(showStoryPage, 2000);
                return;
            }
            setTimeout(() => isDeleting = true, 1200);
        }
    } else {
        typingEl.textContent = line.slice(0, --charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            lineIndex++;
        }
    }

    setTimeout(typeLoop, isDeleting ? 30 : 60);
}

/* ================= GIF STORY PAGE ================= */
const gradients = [
    "linear-gradient(120deg, #ffd6e8, #ffe0ea, #e0aaff)",
    "linear-gradient(120deg, #ffdee9, #b5fffc)",
    "linear-gradient(120deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(120deg, #fddb92, #d1fdff)",
    "linear-gradient(120deg, #fccb90, #d57eeb)",
    "linear-gradient(120deg, #ff9a9e, #fad0c4)"
];

const storySets = [
    {
        gif: "media/gif1.gif",
        text: "This is how You manage me when i'm angry 🤧"
    },
    {
        gif: "media/gif2.webp",
        text: "This is me kissing you when we're alone 😘😘"
    },
    {
        gif: "media/gif3.gif",
        text: "Ei bhabei sarakkhon amar mathay chepe bos thakis 😵‍💫"
    },
    {
        gif: "media/gif4.webp",
        text: "Jokhon besi khabar khele tor petu fule balloon hoye jaye 🤣"
    },
    {
        gif: "media/gif5.webp",
        text: "Apni ato cute je apnake kheye felbo akdin kamre 😘"
    },
    {
        gif: "media/gif6.gif",
        text: "And I may be far away but i'll always love youuu ❤️"
    }
];

let storyIndex = 0;

function showStoryPage() {
    const page2 = document.querySelector('.page2');
    const page3 = document.querySelector('.page3');

    // Fade out page2
    page2.classList.remove("show");
    // page2.style.opacity = "0";

    setTimeout(() => {
        page2.classList.add("hidden");

        // Show page3
        page3.classList.remove("hidden");
        setTimeout(() => {
            page3.classList.add("show");
        }, 50);

        startStory();
    }, 1000); // match CSS transition
}


function startStory() {
    showStorySet();
}

// ================= PRELOAD GIFS (IMPROVES MOBILE RENDERING) =================
async function preloadStoryGifs() {
    const promises = storySets.map(async (set) => {
        try {
            const res = await fetch(set.gif, { cache: 'force-cache' });
            if (!res.ok) throw new Error('fetch failed');
            const blob = await res.blob();
            set.blobSrc = URL.createObjectURL(blob);
        } catch (e) {
            console.warn('preload failed for', set.gif, e);
        }
    });

    await Promise.all(promises);
}

function showStorySet() {
    const container = document.querySelector(".story-container");
    const gif = document.getElementById("story-gif");
    const text = document.getElementById("story-text");

    const current = storySets[storyIndex];

    const page3 = document.querySelector(".page3");
    page3.style.background = gradients[storyIndex % gradients.length];


    // Reset visibility
    container.classList.remove("show");

    // Set text and load image. Prefer preloaded blob URLs for mobile reliability
    text.textContent = current.text;
    gif.onload = null;
    gif.onerror = null;

    try { gif.loading = 'eager'; } catch (e) { }
    try { gif.decoding = 'sync'; } catch (e) { }

    if (current.blobSrc) {
        gif.src = current.blobSrc;
    } else {
        const sep = current.gif.includes('?') ? '&' : '?';
        gif.src = current.gif + sep + 'v=' + Date.now();
    }

    const reveal = () => {
        // small timeout to allow image layout to settle on mobile
        setTimeout(() => container.classList.add("show"), 80);
    };

    if (gif.complete && gif.naturalWidth > 0) {
        reveal();
    } else {
        gif.onload = reveal;
        // if loading fails, still reveal text so UI doesn't hang
        gif.onerror = reveal;
        // some mobile browsers may not fire onload for cached resources; ensure reveal after 1s as fallback
        setTimeout(() => { if (!container.classList.contains('show')) reveal(); }, 1000);
    }

    // visible duration
    setTimeout(() => {
        container.classList.remove("show");

        setTimeout(() => {
            storyIndex++;

            if (storyIndex < storySets.length) {
                showStorySet();
            } else {
                // All story GIFs finished, transition to page 4
                setTimeout(showPage4, 1000);
            }

        }, 800);

    }, 6000);
}

/* ================= PAGE 4 - AUDIO ================= */

function showPage4() {
    const page3 = document.querySelector('.page3');
    const page4 = document.querySelector('.page4');
    const storyHeading = document.querySelector('.story-heading');

    // Fade out heading + page3 together
    storyHeading.style.opacity = "0";
    page3.classList.remove("show");

    setTimeout(() => {
        page3.classList.add("hidden");
        page3.style.display = "none";

        // Reset heading opacity for replay
        storyHeading.style.opacity = "1";

        // Show page4
        page4.style.display = "block";
        setTimeout(() => {
            page4.classList.add("show");
        }, 50);

    }, 1000);
}

function createFloatingHearts() {
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";

        // Random horizontal position
        heart.style.left = Math.random() * 100 + "vw";

        // Random animation duration
        heart.style.animationDuration = (2.5 + Math.random() * 1.5) + "s";

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3500);
    }
}



let currentAudio = null;
let bgMusic = null;

document.addEventListener("DOMContentLoaded", () => {
    bgMusic = document.getElementById("bgMusic");
    if (bgMusic) {
        bgMusic.volume = 0.25; // soft ambient level
        bgMusic.loop = true;
        bgMusic.preload = "auto";
    }
});

// document.querySelectorAll(".audio-box").forEach(box => {
//     box.addEventListener("click", (event) => {

//         const src = box.getAttribute("data-audio");

//         // ❤️ CREATE HEARTS HERE
//         // createFloatingHearts(event.clientX, event.clientY);
//         createFloatingHearts();

//         // Stop currently playing audio
//         if (currentAudio) {
//             currentAudio.pause();
//             currentAudio.currentTime = 0;
//         }

//         currentAudio = new Audio(src);
//         currentAudio.play();
//     });
// });

document.querySelectorAll(".audio-box").forEach(box => {
    box.addEventListener("click", () => {

        const src = box.getAttribute("data-audio");

        createFloatingHearts();

        // Stop previous track
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Pause background music while song plays
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
        }

        currentAudio = new Audio(src);
        currentAudio.play();

        // Resume background music when song ends
        currentAudio.addEventListener("ended", () => {
            if (bgMusic) {
                bgMusic.play().catch(() => { });
            }
        });
    });
});




/* ================= PAGE 5 LOGIC ================= */

// function goToFinalPage() {
//     const page4 = document.querySelector('.page4');
//     const page5 = document.querySelector('.page5');

//     // stop audio if playing
//     if (currentAudio) {
//         currentAudio.pause();
//         currentAudio.currentTime = 0;
//     }

//     page4.classList.remove("show");
//     page4.style.opacity = "0";

//     setTimeout(() => {
//         page4.style.display = "none";

//         page5.style.display = "flex";
//         setTimeout(() => {
//             page5.classList.add("show");
//         }, 50);

//     }, 1000);
// }

function goToFinalPage() {
    const page4 = document.querySelector('.page4');
    const page5 = document.querySelector('.page5');

    const finalText = document.getElementById("finalText");
    const finalGif = document.getElementById("finalGif");
    const replayBtn = document.getElementById("replayBtn");

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch(() => { });
    }

    page4.classList.remove("show");
    page4.style.opacity = "0";

    setTimeout(() => {
        page4.style.display = "none";

        page5.style.display = "flex";
        page5.classList.add("show");

        // RESET states
        finalText.classList.remove("fade-out");
        finalText.classList.add("fade-in");

        finalGif.classList.add("hidden");
        replayBtn.classList.add("hidden");

        // STEP 1: show text only
        setTimeout(() => {
            finalText.classList.add("fade-out");
        }, 3000); // text stays for 3s

        // STEP 2: show gif + replay
        setTimeout(() => {
            finalText.style.display = "none";

            finalGif.classList.remove("hidden");
            finalGif.classList.add("fade-in");

            replayBtn.classList.remove("hidden");
            replayBtn.classList.add("fade-in");

            // ensure the replay button is clickable and above other elements
            try {
                replayBtn.style.pointerEvents = 'auto';
                replayBtn.style.zIndex = '50';
            } catch (e) { }
        }, 4500);

    }, 1000);
}


function restartExperience() {
    const intro = document.querySelector('.intro');
    const page2 = document.querySelector('.page2');
    const page3 = document.querySelector('.page3');
    const page4 = document.querySelector('.page4');
    const page5 = document.querySelector('.page5');

    const finalText = document.getElementById("finalText");
    const finalGif = document.getElementById("finalGif");
    const replayBtn = document.getElementById("replayBtn");
    const typingEl = document.getElementById("typing-text");

    // STOP any playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(err => console.warn('BGM play failed:', err));
    }


    // ===== RESET ALL GLOBAL STATE =====
    lineIndex = 0;
    charIndex = 0;
    isDeleting = false;
    storyIndex = 0;
    typingEl.textContent = "";

    // ===== CLEAR ALL PAGES =====
    // Page 2
    page2.classList.remove("show");
    page2.classList.add("hidden");
    page2.style.opacity = "";
    page2.style.display = "";

    // Page 3
    page3.classList.remove("show");
    page3.classList.add("hidden");
    page3.style.opacity = "";
    page3.style.display = "";
    page3.style.background = "";

    // Page 4
    page4.classList.remove("show");
    page4.style.opacity = "";
    page4.style.display = "none";

    // Page 5
    page5.classList.remove("show");
    page5.style.opacity = "";
    page5.style.display = "none";

    // Reset page5 elements
    finalText.style.display = "block";
    finalText.classList.remove("fade-in", "fade-out");
    finalGif.classList.add("hidden");
    finalGif.classList.remove("fade-in");
    replayBtn.classList.add("hidden");
    replayBtn.classList.remove("fade-in");

    // ===== SHOW INTRO AND TRIGGER FLOW =====
    intro.style.display = "block";

    // Small delay to ensure DOM is settled, then start the experience
    setTimeout(() => {
        try { nextPage(); } catch (e) { }
    }, 100);
}



// Fallback: ensure replay button has an event listener if inline onclick isn't firing
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('replayBtn');
    if (btn) btn.addEventListener('click', restartExperience);
});

