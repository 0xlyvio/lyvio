// ---------- Config extracted from the original guns.lol profile ----------
const USERNAME = "lyvio";

const TAGLINES = [
  "Don't ever test me, yh? Or I will straight up mess u, ur whole fam and ur relatives up, u wasteman",
  "English Avenue til I die fam. Come get some if you've got the minerals, you mug.",
  "Not here for the online squeakers =)"
];

const TRACKS = [
  {
    url: "https://r2.guns.lol/41a82ace-adba-44cb-8b54-16234df6f2ef.mp3",
    title: "HPC 24/7 fam no cap",
    cover: "https://r2.guns.lol/031380a8-e1c8-49ae-980e-5d1dad1dac39.webp"
  },
  {
    url: "https://r2.guns.lol/7a27508d-a2d0-4e81-8b84-795d0c5444c6.mp3",
    title: "HPC 24/7 fam no cap",
    cover: "https://r2.guns.lol/7a709b03-4220-48de-b321-1fefebad25f5.webp"
  },
  {
    url: "https://r2.guns.lol/4138ad8e-046f-4973-ba98-d27f42eba3bc.mp3",
    title: "unset HISTFILE && exec bash",
    cover: "https://r2.guns.lol/7ce937bd-a76e-48a0-8a55-4b751eda4731.webp"
  },
  {
    url: "https://r2.guns.lol/82caef25-abf2-4f8a-bb70-f35f1dabf814.mp3",
    title: "unset HISTFILE && exec bash",
    cover: "https://r2.guns.lol/af132b86-55e4-4517-b466-017b51cd51d9.webp"
  }
];

// ---------- Typewriter effect ----------
function typewriter(el, text, { typeSpeed = 55, deleteSpeed = 35, hold = 1400 } = {}) {
  let i = 0;
  let deleting = false;

  function tick() {
    if (!deleting) {
      i++;
      el.textContent = text.slice(0, i);
      if (i === text.length) {
        setTimeout(() => { deleting = true; tick(); }, hold);
        return;
      }
    } else {
      i--;
      el.textContent = text.slice(0, i);
      if (i === 0) {
        deleting = false;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }
  tick();
}

function cycleTypewriter(el, phrases, opts) {
  let idx = 0;
  function next() {
    typewriterOnce(el, phrases[idx], opts, () => {
      idx = (idx + 1) % phrases.length;
      setTimeout(next, 400);
    });
  }
  next();
}

function typewriterOnce(el, text, { typeSpeed = 55, deleteSpeed = 30, hold = 1600 } = {}, done) {
  let i = 0;
  let deleting = false;

  function tick() {
    if (!deleting) {
      i++;
      el.textContent = text.slice(0, i);
      if (i === text.length) {
        setTimeout(() => { deleting = true; tick(); }, hold);
        return;
      }
    } else {
      i--;
      el.textContent = text.slice(0, i);
      if (i === 0) {
        done && done();
        return;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }
  tick();
}

document.addEventListener("DOMContentLoaded", () => {
  typewriter(document.getElementById("typewriterName"), USERNAME, { typeSpeed: 140, hold: 999999 });
  cycleTypewriter(document.getElementById("typewriterTagline"), TAGLINES);

  setupAudioPlayer();
  setupVolume();
  setupCopyButton();
  setupParticles();
  setupTabTitleTypewriter();
  setupCardParallax();
});

// ---------- Audio player ----------
function setupAudioPlayer() {
  const player = document.getElementById("player");
  const cover = document.getElementById("audioCover");
  const title = document.getElementById("audioTitle");
  const progress = document.getElementById("audioProgress");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let current = TRACKS.length - 1; // last track was "selected" in original config
  let playing = false;

  const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
  const ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

  function load(idx, autoplay) {
    current = idx;
    const t = TRACKS[current];
    cover.src = t.cover;
    title.textContent = t.title;
    player.src = t.url;
    progress.style.width = "0%";
    if (autoplay) play();
  }

  function play() {
    player.play().then(() => {
      playing = true;
      playIcon.outerHTML = `<svg id="playIcon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">${ICON_PAUSE}</svg>`;
    }).catch(() => {});
  }

  function pause() {
    player.pause();
    playing = false;
    document.getElementById("playIcon").outerHTML = `<svg id="playIcon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">${ICON_PLAY}</svg>`;
  }

  playBtn.addEventListener("click", () => (playing ? pause() : play()));
  prevBtn.addEventListener("click", () => load((current - 1 + TRACKS.length) % TRACKS.length, true));
  nextBtn.addEventListener("click", () => load((current + 1) % TRACKS.length, true));

  player.addEventListener("timeupdate", () => {
    if (player.duration) {
      progress.style.width = `${(player.currentTime / player.duration) * 100}%`;
    }
  });
  player.addEventListener("ended", () => load((current + 1) % TRACKS.length, true));

  load(current, false);
}

// ---------- Volume ----------
function setupVolume() {
  const range = document.getElementById("volumeRange");
  const video = document.querySelector(".bg-video");
  const player = document.getElementById("player");

  const apply = (v) => {
    const vol = v / 100;
    video.volume = vol;
    player.volume = vol;
  };
  apply(100);
  range.addEventListener("input", (e) => apply(e.target.value));
}

// ---------- Copy custom URL ----------
function setupCopyButton() {
  const btn = document.getElementById("copyUrlBtn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const text = btn.dataset.copyText || window.location.href;
    try {
      await navigator.clipboard.writeText(text);
      btn.dataset.tip = "Copied!";
      setTimeout(() => (btn.dataset.tip = "Copy Custom URL"), 1200);
    } catch (e) {
      /* clipboard blocked (e.g. file:// origin) — ignore silently */
    }
  });
}

// ---------- Particle cursor trail ----------
function setupParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        life: 1,
        size: Math.random() * 2 + 1
      });
    }
  });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter((p) => p.life > 0);
    requestAnimationFrame(loop);
  }
  loop();
}

// ---------- Browser tab title typewriter ----------
function setupTabTitleTypewriter() {
  const text = `@${USERNAME}`;
  let i = 0;
  let deleting = false;

  function tick() {
    if (!deleting) {
      i++;
      document.title = text.slice(0, i) || "\u200B"; // keep tab from looking blank at 0 chars
      if (i === text.length) {
        setTimeout(() => { deleting = true; tick(); }, 2000);
        return;
      }
    } else {
      i--;
      document.title = text.slice(0, i) || "\u200B";
      if (i === 0) {
        deleting = false;
      }
    }
    setTimeout(tick, deleting ? 90 : 140);
  }
  tick();
}

// ---------- Card parallax / tilt following the mouse ----------
function setupCardParallax() {
  const card = document.querySelector(".card");
  if (!card) return;

  const maxTilt = 6; // degrees
  const maxShift = 8; // px

  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateY = relX * maxTilt * 2;
    const rotateX = -relY * maxTilt * 2;
    const shiftX = relX * maxShift;
    const shiftY = relY * maxShift;

    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${shiftX}px, ${shiftY}px)`;
  }

  function onLeave() {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translate(0, 0)";
  }

  function enable() {
    // Only enable on devices with a real pointer (skip touch-only devices)
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    }
  }

  // Wait for the CSS "unfold" entrance animation to finish so the parallax
  // transform doesn't fight it while the card is still animating in.
  card.addEventListener("animationend", enable, { once: true });
  // Fallback in case the animation is skipped (e.g. reduced motion).
  setTimeout(enable, 1200);
}