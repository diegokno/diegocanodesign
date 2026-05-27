const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const siteHeader = document.querySelector(".site-header");
const heroScroll = document.querySelector(".hero-scroll");
const heroPhrases = [...document.querySelectorAll(".hero-phrase")];
const heroModel = document.querySelector("#hero-model");
const modelDebug = document.querySelector("#model-debug");
const heroSticky = document.querySelector(".hero-sticky");
const cursorDot = document.querySelector(".cursor-dot");
const cursorFollower = document.querySelector(".cursor-follower");
const workCards = [...document.querySelectorAll(".projects:not(.legacy-projects) .work-card")];
const projectModal = document.querySelector("#project-modal");
const projectModalTitle = document.querySelector("#project-modal-title");
const projectModalBody = document.querySelector("#project-modal-body");
const projectModalCloseButtons = [...document.querySelectorAll("[data-modal-close]")];
const whatIdoScroll = document.querySelector(".whatido-scroll");
const whatIdoIntro = document.querySelector("#whatido-intro");
const whatIdoServiceEntries = [...document.querySelectorAll(".whatido-service-entry")];
const whatIdoShapes = [...document.querySelectorAll(".whatido-shape")];
const approachScroll = document.querySelector(".approach-scroll");
const approachLines = [...document.querySelectorAll(".approach-line")];
const contactSection = document.querySelector(".contact-section");
const contactHeading = document.querySelector("#contact-heading");
const contactLinks = document.querySelector(".contact-links");
const languageToggle = document.querySelector(".language-toggle");
const languageCurrent = document.querySelector(".language-current");
const languageNext = document.querySelector(".language-next");

const heroModelSettings = {
  environmentImage: "https://modelviewer.dev/shared-assets/environments/moon_1k.hdr",
  exposure: 0.82,
  environmentIntensity: 1.8,
  shadowIntensity: 0,
  shadowSoftness: 0,
  orientation: { x: 0, y: 0, z: 180 },
  fieldOfView: 18,
  cameraOrbit: { x: 0, y: 0 },
  cameraTarget: { x: 0, y: 0, z: 0 },
};

function getResponsiveHeroModelSettings() {
  return {
    ...heroModelSettings,
    cameraTarget: {
      ...heroModelSettings.cameraTarget,
      x: heroModelSettings.cameraTarget.x,
    },
  };
}

function applyHeroModelSettings() {
  if (!heroModel) {
    return;
  }

  const settings = getResponsiveHeroModelSettings();
  heroModel.setAttribute("environment-image", settings.environmentImage);
  heroModel.setAttribute("exposure", String(settings.exposure));
  heroModel.setAttribute("environment-intensity", String(settings.environmentIntensity));
  heroModel.setAttribute("shadow-intensity", String(settings.shadowIntensity));
  heroModel.setAttribute("shadow-softness", String(settings.shadowSoftness));
  heroModel.setAttribute("field-of-view", `${settings.fieldOfView}deg`);
  heroModel.setAttribute(
    "camera-target",
    `${settings.cameraTarget.x}m ${settings.cameraTarget.y}m ${settings.cameraTarget.z}m`
  );
}

const whatIdoStates = [
  [
    { x: 56, y: 55.6, scale: 1, opacity: 1, fill: 0, stroke: 1 },
    { x: 65.8, y: 55.6, scale: 1, opacity: 1, fill: 0, stroke: 1 },
    { x: 75.6, y: 55.6, scale: 1, opacity: 1, fill: 0, stroke: 1 },
    { x: 85.4, y: 55.6, scale: 1, opacity: 1, fill: 0, stroke: 1 },
  ],
  [
    { x: -12, y: 22, scale: 3.92, opacity: 1, fill: 1, stroke: 0 },
    { x: 65.8, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
    { x: 76.5, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
    { x: 87.2, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
  ],
  [
    { x: -36, y: 32, scale: 2.5, opacity: 0.06, fill: 1, stroke: 0 },
    { x: -12, y: 22, scale: 3.92, opacity: 1, fill: 1, stroke: 0 },
    { x: 65.8, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
    { x: 76.5, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
  ],
  [
    { x: -48, y: 35, scale: 2.1, opacity: 0, fill: 1, stroke: 0 },
    { x: -36, y: 32, scale: 2.5, opacity: 0.06, fill: 1, stroke: 0 },
    { x: -12, y: 22, scale: 3.92, opacity: 1, fill: 1, stroke: 0 },
    { x: 65.8, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
  ],
  [
    { x: -50, y: 35, scale: 2.1, opacity: 0, fill: 1, stroke: 0 },
    { x: -48, y: 35, scale: 2.1, opacity: 0, fill: 1, stroke: 0 },
    { x: -36, y: 32, scale: 2.5, opacity: 0.06, fill: 1, stroke: 0 },
    { x: -12, y: 22, scale: 3.92, opacity: 1, fill: 1, stroke: 0 },
  ],
];

const whatIdoSmallQueueStates = [
  { x: 56, y: 55.6, scale: 1, opacity: 1, fill: 0, stroke: 1 },
  { x: 65.8, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
  { x: 65.8, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
  { x: 65.8, y: 55.6, scale: 1.05, opacity: 1, fill: 0, stroke: 1 },
];

let pointerOrbit = { x: 0, y: 0 };
let currentOrbit = { x: 0, y: 0 };
let pointerOrientation = { x: 0, y: 0 };
let currentOrientation = { x: 0, y: 0 };
let cursorTarget = { x: -100, y: -100 };
let cursorCurrent = { x: -100, y: -100 };
let isNativePointer = false;
let cardTargetSquash = 0;
let cardCurrentSquash = 0;
let lastScrollY = window.scrollY;
let scrollStopTimeout = null;
let contactTarget = { x: 0, y: 0 };
let contactCurrent = { x: 0, y: 0 };
let contactVelocity = { x: 0, y: 0 };
let contactFollowStrength = 0;

const workCardStates = new Map(
  workCards.map((card) => [card, { hover: false, tiltX: 0, tiltY: 0 }])
);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax - inMin === 0) {
    return outMin;
  }

  const t = (value - inMin) / (inMax - inMin);
  return outMin + (outMax - outMin) * t;
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function smoothstep(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - (2 * t));
}

function intersects(rectA, rectB) {
  return !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );
}

function getSectionProgress(section) {
  if (!section) {
    return 0;
  }

  const rect = section.getBoundingClientRect();
  const total = Math.max(section.offsetHeight - window.innerHeight, 1);
  return clamp(-rect.top / total, 0, 1);
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    siteHeader?.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      siteHeader?.classList.remove("is-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

function getHeroProgress() {
  return getSectionProgress(heroScroll);
}

function isCompactMotionViewport() {
  return window.innerWidth <= 760
    || (window.matchMedia("(hover: none) and (pointer: coarse) and (max-width: 900px) and (orientation: portrait)").matches);
}

function isTabletLandscapeViewport() {
  return window.matchMedia("(hover: none) and (pointer: coarse) and (min-width: 901px) and (orientation: landscape)").matches;
}

const pinnedScenes = [
  { section: heroScroll, sticky: heroSticky },
  { section: whatIdoScroll, sticky: document.querySelector(".whatido-sticky") },
  { section: approachScroll, sticky: document.querySelector(".approach-sticky") },
].filter(({ section, sticky }) => section && sticky);

function updateTabletLandscapePinning() {
  if (!pinnedScenes.length) {
    return;
  }

  const shouldPin = isTabletLandscapeViewport();
  pinnedScenes.forEach(({ section, sticky }) => {
    if (!shouldPin) {
      sticky.classList.remove("is-js-pinned", "is-js-ended");
      return;
    }

    const rect = section.getBoundingClientRect();
    const isInsideScene = rect.top <= 0 && rect.bottom >= window.innerHeight;
    const isPastScene = rect.bottom < window.innerHeight;

    sticky.classList.toggle("is-js-pinned", isInsideScene);
    sticky.classList.toggle("is-js-ended", isPastScene);
  });
}

function getSceneIndex(progress) {
  if (progress < 1 / 3) {
    return 0;
  }

  if (progress < 2 / 3) {
    return 1;
  }

  return 2;
}

function getWhatIdoStageData(progress) {
  const segments = [
    { active: 0, start: 0.18, morphEnd: 0.34, holdEnd: 0.48, queueEnd: 0.54 },
    { active: 1, start: 0.43, morphEnd: 0.59, holdEnd: 0.73, queueEnd: 0.79 },
    { active: 2, start: 0.68, morphEnd: 0.84, holdEnd: 0.94, queueEnd: 0.98 },
    { active: 3, start: 0.86, morphEnd: 1, holdEnd: 1, queueEnd: 1 },
  ];

  let index = 0;
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
    if (progress >= segments[segmentIndex].start) {
      index = segmentIndex;
    }
  }

  const segment = segments[index];
  return {
    active: segment.active,
    introFade: smoothstep(mapRange(progress, 0.1, 0.28, 0, 1)),
    morphProgress: smoothstep(mapRange(progress, segment.start, segment.morphEnd, 0, 1)),
    holdProgress: smoothstep(mapRange(progress, segment.morphEnd, segment.holdEnd, 0, 1)),
    queueProgress: smoothstep(mapRange(progress, segment.holdEnd, segment.queueEnd, 0, 1)),
  };
}

function updateTextScene(progress) {
  const sceneIndex = getSceneIndex(progress);
  heroPhrases.forEach((phrase, index) => {
    phrase.classList.toggle("is-active", index === sceneIndex);
  });

  document.documentElement.style.setProperty("--hero-copy-shift", `${-102 * progress}px`);
}

function updateModelScene(progress) {
  if (!heroModel) {
    return;
  }

  const totalDuration = Number(heroModel.duration) || 0;
  if (totalDuration > 0) {
    heroModel.pause();
    const finalSafeTime = Math.max(totalDuration - (1 / 60), 0);
    heroModel.currentTime = Math.min(progress * totalDuration, finalSafeTime);
  }
}

function updateWhatIdoScene(progress) {
  if (!whatIdoShapes.length) {
    return;
  }

  if (isCompactMotionViewport()) {
    const mobileFloat = clamp(progress * 4.45, 0, 4);
    const introReveal = smoothstep(clamp(1 - Math.abs(mobileFloat) / 0.72, 0, 1));

    if (whatIdoIntro) {
      whatIdoIntro.style.opacity = introReveal.toFixed(4);
      whatIdoIntro.style.filter = `blur(${((1 - introReveal) * 16).toFixed(2)}px)`;
      whatIdoIntro.style.transform = `translate3d(0, ${((1 - introReveal) * -18).toFixed(2)}px, 0)`;
    }

    const introShapes = [
      { x: "2vw", y: "39svh", size: 184 },
      { x: "42vw", y: "39svh", size: 184 },
      { x: "0vw", y: "56svh", size: 198 },
      { x: "43vw", y: "56svh", size: 198 },
    ];

    const activeServiceIndex = clamp(Math.round(mobileFloat - 1), 0, whatIdoShapes.length - 1);
    const activeDistance = Math.abs(mobileFloat - (activeServiceIndex + 1));
    const serviceShapeReveal = smoothstep(clamp(1 - activeDistance / 0.72, 0, 1));

    whatIdoShapes.forEach((shape, index) => {
      if (mobileFloat < 0.75) {
        const introShape = introShapes[index];
        shape.style.setProperty("--shape-x", introShape.x);
        shape.style.setProperty("--shape-y", introShape.y);
        shape.style.setProperty("--shape-center-x", "0px");
        shape.style.setProperty("--shape-size", `${introShape.size}px`);
        shape.style.setProperty("--shape-opacity", introReveal.toFixed(4));
        shape.style.setProperty("--fill-opacity", "0");
        shape.style.setProperty("--stroke-opacity", introReveal.toFixed(4));
        return;
      }

      const isActiveShape = index === activeServiceIndex;
      const shapeSize = Math.min(window.innerWidth * 0.78, 360);
      const shapeParentLeft = shape.parentElement?.getBoundingClientRect().left || 0;
      const viewportCenterX = window.innerWidth / 2;
      shape.style.setProperty("--shape-x", `${viewportCenterX - shapeParentLeft}px`);
      shape.style.setProperty("--shape-y", "8svh");
      shape.style.setProperty("--shape-center-x", "-50%");
      shape.style.setProperty("--shape-size", `${shapeSize}px`);
      shape.style.setProperty("--shape-opacity", isActiveShape ? serviceShapeReveal.toFixed(4) : "0");
      shape.style.setProperty("--fill-opacity", isActiveShape ? serviceShapeReveal.toFixed(4) : "0");
      shape.style.setProperty("--stroke-opacity", "0");
    });

    whatIdoServiceEntries.forEach((entry) => {
      const index = whatIdoServiceEntries.indexOf(entry);
      const distance = Math.abs(mobileFloat - (index + 1));
      const reveal = smoothstep(clamp(1 - distance / 0.92, 0, 1));
      entry.style.opacity = reveal.toFixed(4);
      entry.style.filter = `blur(${((1 - reveal) * 18).toFixed(2)}px)`;
      entry.style.transform = `translate3d(0, ${((1 - reveal) * 18).toFixed(2)}px, 0)`;
    });
    return;
  }

  const stageData = getWhatIdoStageData(progress);
  const activeIndex = stageData.active;

  whatIdoShapes.forEach((shape, index) => {
    const fromState = whatIdoStates[activeIndex][index];
    const toState = whatIdoStates[Math.min(activeIndex + 1, whatIdoStates.length - 1)][index];
    const activeStartState = whatIdoSmallQueueStates[index] || fromState;
    let x = fromState.x;
    let y = fromState.y;
    let scale = fromState.scale;
    let opacity = fromState.opacity;
    let rawFill = fromState.fill;
    let rawStroke = fromState.stroke;

    if (index === activeIndex) {
      x = lerp(activeStartState.x, toState.x, stageData.morphProgress);
      y = lerp(activeStartState.y, toState.y, stageData.morphProgress);
      scale = lerp(activeStartState.scale, toState.scale, stageData.morphProgress);
      opacity = lerp(activeStartState.opacity, toState.opacity, stageData.morphProgress);
      rawFill = stageData.morphProgress;
      rawStroke = 1 - smoothstep(mapRange(stageData.morphProgress, 0.02, 0.22, 0, 1));
    } else if (index > activeIndex) {
      const queueSlot = index - activeIndex - 1;
      const previousX = 65.8 + queueSlot * 10.7;
      const nextX = 65.8 + (queueSlot - 1) * 10.7;
      x = lerp(previousX, nextX, stageData.morphProgress);
      y = 55.6;
      scale = 1.04;
      opacity = 1;
      rawFill = 0;
      rawStroke = 1;
    } else {
      const exitProgress = Math.max(stageData.morphProgress, stageData.queueProgress);
      x = lerp(fromState.x, toState.x, exitProgress);
      y = lerp(fromState.y, toState.y, exitProgress);
      scale = lerp(fromState.scale, toState.scale, exitProgress);
      opacity = lerp(fromState.opacity, toState.opacity, exitProgress);
      rawFill = 1;
      rawStroke = 0;
    }

    const strokeVisibility = rawFill > 0.22 ? 0 : rawStroke * (1 - smoothstep(mapRange(rawFill, 0.04, 0.22, 0, 1)));
    shape.style.setProperty("--shape-x", `${x}vw`);
    shape.style.setProperty("--shape-y", `${y}vh`);
    const responsiveScale = window.innerWidth <= 1280 ? 0.84 : 1;
    shape.style.setProperty("--shape-size", `${212 * scale * responsiveScale}px`);
    shape.style.setProperty("--shape-opacity", opacity.toFixed(4));
    shape.style.setProperty("--fill-opacity", rawFill.toFixed(4));
    shape.style.setProperty("--stroke-opacity", clamp(strokeVisibility, 0, 1).toFixed(4));
  });

  if (whatIdoIntro) {
    const introFade = 1 - stageData.introFade;
    const introBlur = stageData.introFade * 16;
    const introLift = -64 + stageData.introFade * -24;
    whatIdoIntro.style.opacity = clamp(introFade, 0, 1).toFixed(4);
    whatIdoIntro.style.filter = `blur(${introBlur.toFixed(2)}px)`;
    whatIdoIntro.style.transform = `translate3d(0, calc(-50% + ${introLift.toFixed(2)}px), 0)`;
  }

  whatIdoServiceEntries.forEach((entry, index) => {
    const isActive = index === activeIndex;
    const reveal = isActive
      ? smoothstep(mapRange(stageData.morphProgress, 0.18, 0.5, 0, 1))
      : 0;
    const hold = isActive ? 1 - stageData.queueProgress * 0.18 : 0;
    const opacity = reveal * hold;
    const blur = (1 - opacity) * 14;
    const shift = (1 - opacity) * 8;
    entry.style.opacity = opacity.toFixed(4);
    entry.style.filter = `blur(${blur.toFixed(2)}px)`;
    entry.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
  });
}

function updateApproachScene(progress) {
  if (!approachLines.length) {
    return;
  }

  const fadeIn = smoothstep(mapRange(progress, 0, 0.15, 0, 1));
  const contactTop = contactSection?.getBoundingClientRect().top ?? window.innerHeight;
  const contactReveal = smoothstep(mapRange(contactTop, window.innerHeight * 0.55, window.innerHeight * 0.02, 0, 1));
  contactFollowStrength = smoothstep(mapRange(contactTop, window.innerHeight * 0.42, window.innerHeight * 0.06, 0, 1));
  const bgAlpha = clamp(fadeIn * (1 - contactReveal), 0, 1);
  document.documentElement.style.setProperty("--approach-bg-alpha", bgAlpha.toFixed(4));
  document.documentElement.style.setProperty("--contact-transition-alpha", bgAlpha.toFixed(4));
  document.documentElement.style.setProperty("--approach-points-opacity", clamp(mapRange(progress, 0.1, 0.28, 0, 1), 0, 1).toFixed(4));
  document.documentElement.style.setProperty("--approach-points-shift", `${(1 - fadeIn) * 28}px`);
  siteHeader?.classList.toggle("is-dark", bgAlpha > 0.42);

  const focusPosition = clamp(mapRange(progress, 0.02, 0.82, 0, approachLines.length), 0, approachLines.length);
  approachLines.forEach((line, index) => {
    const intensity = clamp(focusPosition - index, 0, 1);
    const opacity = 0.34 + intensity * 0.66;
    const blur = (1 - intensity) * 12;
    line.style.opacity = opacity.toFixed(3);
    line.style.filter = `blur(${blur.toFixed(2)}px)`;
    line.style.color = intensity > 0.82 ? "#ffffff" : "rgba(255,255,255,0.52)";
    line.classList.toggle("is-active", intensity > 0.82);
  });
}

function syncScenes() {
  updateTabletLandscapePinning();
  const heroProgress = getHeroProgress();
  updateTextScene(heroProgress);
  updateModelScene(heroProgress);
  updateWhatIdoScene(getSectionProgress(whatIdoScroll));
  updateApproachScene(getSectionProgress(approachScroll));
}

window.addEventListener("scroll", syncScenes, { passive: true });
window.addEventListener("resize", () => {
  applyHeroModelSettings();
  syncScenes();
});

if (heroModel) {
  heroModel.addEventListener("load", () => {
    modelDebug.hidden = true;
    applyHeroModelSettings();
    heroModel.setAttribute(
      "camera-orbit",
      `${heroModelSettings.cameraOrbit.x}deg ${heroModelSettings.cameraOrbit.y}deg auto`
    );
    heroModel.setAttribute(
      "orientation",
      `${heroModelSettings.orientation.x}deg ${heroModelSettings.orientation.y}deg ${heroModelSettings.orientation.z}deg`
    );
    if (Array.isArray(heroModel.availableAnimations) && heroModel.availableAnimations.length > 0) {
      heroModel.animationName = heroModel.availableAnimations[0];
    }
    heroModel.pause();
    heroModel.currentTime = 0;
    syncScenes();
  });

  heroModel.addEventListener("error", () => {
    if (modelDebug) {
      modelDebug.hidden = false;
    }
  });
}

if (heroSticky && heroModel) {
  heroSticky.addEventListener("pointermove", (event) => {
    const rect = heroSticky.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) - 0.5;
    const y = ((event.clientY - rect.top) / rect.height) - 0.5;
    pointerOrbit.x = x * 6;
    pointerOrbit.y = y * -5;
    pointerOrientation.y = x * 20;
    pointerOrientation.x = y * -14;
  });

  heroSticky.addEventListener("pointerleave", () => {
    pointerOrbit.x = 0;
    pointerOrbit.y = 0;
    pointerOrientation.x = 0;
    pointerOrientation.y = 0;
  });
}

function isInteractiveCursorTarget(target) {
  return Boolean(
    target?.closest?.("a, button, input, textarea, select, summary, [role='button'], .work-card")
  );
}

function updateCursorVisibility(target) {
  isNativePointer = isInteractiveCursorTarget(target);
  cursorDot?.classList.toggle("is-hidden", isNativePointer);
  cursorFollower?.classList.toggle("is-hidden", isNativePointer);
}

if (cursorDot || cursorFollower) {
  window.addEventListener("pointermove", (event) => {
    cursorTarget.x = event.clientX;
    cursorTarget.y = event.clientY;
    cursorDot?.style.setProperty(
      "transform",
      `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    );
    updateCursorVisibility(event.target);
  });

  window.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) {
      cursorDot?.classList.add("is-hidden");
      cursorFollower?.classList.add("is-hidden");
    }
  });
}

workCards.forEach((card) => {
  const state = workCardStates.get(card);
  card.addEventListener("pointermove", (event) => {
    const visual = card.querySelector(".project-visual") || card;
    const rect = visual.getBoundingClientRect();
    const x = event.clientX - rect.left;
    state.tiltX = 0;
    state.tiltY = 0;
    card.style.setProperty("--card-glow-x", `${(x / rect.width) * 100}%`);
  });

  card.addEventListener("pointerenter", () => {
    state.hover = true;
  });

  card.addEventListener("pointerleave", () => {
    state.hover = false;
    state.tiltX = 0;
    state.tiltY = 0;
  });
});

function closeProjectModal() {
  if (!projectModal || !projectModalBody) {
    return;
  }

  if (activeProjectViewerCleanup) {
    activeProjectViewerCleanup();
    activeProjectViewerCleanup = null;
  }

  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  projectModalBody.innerHTML = "";
}

let activeProjectViewerCleanup = null;

function setActiveProjectSlide(slides, dots, index) {
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
    dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
  });
}

function buildProjectGallery(gallery, title) {
  const viewer = document.createElement("div");
  viewer.className = "project-viewer";

  const track = document.createElement("div");
  track.className = "project-slide-track";

  const pagination = document.createElement("div");
  pagination.className = "project-pagination";
  pagination.setAttribute("aria-label", "Project pages");

  const slides = gallery.map((src, index) => {
    const slide = document.createElement("section");
    slide.className = `project-slide${index === 0 ? " is-active" : ""}`;
    slide.setAttribute("aria-label", `${title} image ${index + 1}`);

    const media = document.createElement("div");
    media.className = "project-slide-media";

    const image = document.createElement("img");
    image.src = src;
    image.alt = `${title} image ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";

    media.appendChild(image);
    slide.appendChild(media);
    track.appendChild(slide);
    return slide;
  });

  const dots = gallery.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);
    if (index === 0) {
      dot.classList.add("is-active");
      dot.setAttribute("aria-current", "true");
    }
    dot.addEventListener("click", () => {
      snapToProjectSlide(index);
    });
    pagination.appendChild(dot);
    return dot;
  });

  let scrollFrame = 0;
  let currentIndex = 0;
  let wheelLocked = false;

  const getSlideTop = (slide) => (
    slide.offsetTop - ((track.clientHeight - slide.offsetHeight) / 2)
  );

  const snapToProjectSlide = (index) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
    currentIndex = nextIndex;
    track.scrollTo({ top: getSlideTop(slides[nextIndex]), behavior: "smooth" });
    setActiveProjectSlide(slides, dots, nextIndex);
  };

  const syncActiveSlide = () => {
    scrollFrame = 0;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.top + trackRect.height / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    currentIndex = closestIndex;
    setActiveProjectSlide(slides, dots, closestIndex);
  };

  const onScroll = () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(syncActiveSlide);
    }
  };

  const onWheel = (event) => {
    const delta = event.deltaY;
    if (Math.abs(delta) < 8) {
      return;
    }

    event.preventDefault();
    if (wheelLocked) {
      return;
    }

    wheelLocked = true;
    snapToProjectSlide(currentIndex + (delta > 0 ? 1 : -1));
    window.setTimeout(() => {
      wheelLocked = false;
    }, 540);
  };

  track.addEventListener("scroll", onScroll, { passive: true });
  track.addEventListener("wheel", onWheel, { passive: false });
  viewer.append(track, pagination);
  window.requestAnimationFrame(() => {
    snapToProjectSlide(0);
  });

  activeProjectViewerCleanup = () => {
    track.removeEventListener("scroll", onScroll);
    track.removeEventListener("wheel", onWheel);
    if (scrollFrame) {
      window.cancelAnimationFrame(scrollFrame);
    }
  };

  return viewer;
}

function normalizeVimeoUrl(src) {
  if (!src) {
    return "";
  }

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}title=0&byline=0&portrait=0`;
}

function buildProjectVideo(card) {
  const wrap = document.createElement("div");
  wrap.className = "project-video-wrap";

  if (card.dataset.embed) {
    const iframe = document.createElement("iframe");
    iframe.src = normalizeVimeoUrl(card.dataset.embed);
    iframe.title = card.dataset.title || "Project video";
    iframe.allow = "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
  } else if (card.dataset.video) {
    const player = document.createElement("video");
    player.src = card.dataset.video;
    player.controls = true;
    player.playsInline = true;
    player.preload = "metadata";
    wrap.appendChild(player);
  }

  if (card.dataset.site) {
    const siteLink = document.createElement("a");
    siteLink.className = "project-site-link";
    siteLink.href = card.dataset.site;
    siteLink.target = "_blank";
    siteLink.rel = "noreferrer";
    siteLink.textContent = "Visit site";
    projectModalBody.appendChild(siteLink);
  }

  return wrap;
}

function openProjectModal(card) {
  if (!projectModal || !projectModalTitle || !projectModalBody) {
    return;
  }

  const title = card.dataset.title || "Project";
  const gallery = card.dataset.gallery?.split("|").filter(Boolean) || [];
  const video = card.dataset.video;
  const embed = card.dataset.embed;

  projectModalTitle.textContent = title;
  projectModalBody.innerHTML = "";

  if (gallery.length > 0) {
    projectModalBody.appendChild(buildProjectGallery(gallery, title));
  } else if (video || embed) {
    projectModalBody.appendChild(buildProjectVideo(card));
  }

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

workCards.forEach((card) => {
  card.querySelectorAll("[data-project-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      openProjectModal(card);
    });
  });

  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      return;
    }

    if (card.dataset.external) {
      window.open(card.dataset.external, "_blank", "noopener,noreferrer");
      return;
    }

    if (card.dataset.gallery || card.dataset.video || card.dataset.embed) {
      openProjectModal(card);
    }
  });
});

projectModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeProjectModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("is-open")) {
    closeProjectModal();
  }
});

const translationPairs = [
  ["About", "Sobre mí"],
  ["Work", "Trabajo"],
  ["What I Do", "Lo que hago"],
  ["Approach", "Approach"],
  ["Contact", "Contacto"],
  ["Hey, I'm", "Hola, soy"],
  ["Hey, I'm ", "Hola, soy "],
  [",", ","],
  [", ", ", "],
  ["a multidisciplinary product designer", "un product designer multidisciplinario"],
  [" bringing life to ", " que da vida a "],
  ["bringing life to", "que da vida a"],
  ["digital products and AI experiences.", "productos digitales y experiencias con IA."],
  ["Selected work", "Trabajos seleccionados"],
  [" across product, AI, web, motion, and visual design.", " en product design, IA, web, motion y visual design."],
  ["across product, AI, web, motion, and visual design.", "en product design, IA, web, motion y visual design."],
  ["View project →", "Ver proyecto →"],
  ["Watch demo →", "Ver demo →"],
  ["Watch reel →", "Ver reel →"],
  ["Watch concept →", "Ver concepto →"],
  ["Open website →", "Abrir sitio →"],
  ["Visit site", "Visitar sitio"],
  ["Product", "Product"],
  ["Web Experience", "WEB EXPERIENCE"],
  ["Reel", "Reel"],
  ["AI Product Concept", "AI PRODUCT CONCEPT"],
  ["Personal Site", "PERSONAL SITE"],
  ["Adventure Brand", "ADVENTURE BRAND"],
  ["Organic Brand", "ORGANIC BRAND"],
  ["Mia AI - App", "Mia AI - App"],
  ["Mia AI - Website", "Mia AI - Website"],
  ["Variate Sizzle Reel", "Variate Sizzle Reel"],
  ["Arya OS Concept", "Concepto Arya OS"],
  ["My Wedding Website", "Website de Mi boda"],
  ["MotoXperience", "MotoXperience"],
  ["Ikara", "Ikara"],
  ["A voice-first AI companion experience designed to make emotional support feel simple, immediate, and human.", "Una experiencia de AI companion voice-first diseñada para hacer que el apoyo emocional se sienta simple, inmediato y humano."],
  ["A digital experience built to communicate Mia's mission through web, motion, 3D elements, and scroll-based storytelling.", "Una experiencia digital creada para comunicar la misión de Mia a través de web, motion, elementos 3D y una narrativa basada en scroll."],
  ["A homepage reel made to condense a broad portfolio into a clear, fast, and polished first impression.", "Un reel para homepage creado para condensar un portafolio amplio en una primera impresión clara, ágil y pulida."],
  ["A speculative voice interface concept exploring how an AI assistant could feel present, proactive, and cinematic.", "Concepto de interfaz por voz que explora cómo un asistente con IA podría sentirse presente, proactivo e inmersivo."],
  ["An intimate wedding site designed as a practical invitation for a private celebration surrounded by nature.", "Una wedding website íntima, diseñada como una invitación práctica para una celebración privada con un estilo natural."],
  ["A motorcycle tourism identity built around routes, challenge, and the feeling of moving through the open road.", "Una identidad para turismo en moto construida alrededor de rutas, desafío y la sensación de avanzar por un camino por descubrir."],
  ["A cacao-based brand built from naming to packaging, with a visual world inspired by origin, ritual, and nature.", "Una marca basada en cacao construida desde el naming hasta el packaging, con un universo visual inspirado en origen, ritual y naturaleza."],
  ["Product Design", "Product Design"],
  ["AI Interaction", "AI Interaction"],
  ["Mobile Experience", "Mobile Experience"],
  ["Onboarding", "Onboarding"],
  ["Web Design", "Web Design"],
  ["Motion Design", "Motion Design"],
  ["3D Elements", "3D Elements"],
  ["Scroll Section", "Scroll Section"],
  ["Video Editing", "Video Editing"],
  ["Art Direction", "Art Direction"],
  ["AI Concept", "AI Concept"],
  ["Voice UX", "Voice UX"],
  ["3D Environment", "Entorno 3D"],
  ["Event Flow", "Event Flow"],
  ["Personal Identity", "Personal Identity"],
  ["Brand Identity", "Brand Identity"],
  ["Visual System", "Visual System"],
  ["Tourism Experience", "Tourism Experience"],
  ["Web Direction", "Web Direction"],
  ["Naming", "Naming"],
  ["Packaging System", "Packaging System"],
  ["Brand Story", "Brand Story"],
  ["I help turn digital ideas into clear, usable, and", "Ayudo a convertir ideas digitales en experiencias claras, útiles y"],
  ["meaningful experiences.", "con sentido."],
  ["I help turn digital ideas into clear, usable, and meaningful experiences.", "Ayudo a convertir ideas digitales en experiencias claras, útiles y con sentido."],
  ["Product Experiences", "Product Experiences"],
  ["I design flows, screens, and interactions that help people move through a digital product without friction.", "Diseño flujos, pantallas e interacciones que ayudan a las personas a moverse por un producto digital sin fricción."],
  ["AI Interaction Design", "AI Interaction Design"],
  ["I shape how AI shows up in a product, from conversational flows to onboarding, insights, and emotional interfaces.", "Doy forma a cómo aparece la IA dentro de un producto, desde flujos conversacionales hasta onboarding, insights e interfaces emocionales."],
  ["Visual Systems", "Visual Systems"],
  ["I create visual languages that make websites, apps, campaigns, and digital products feel coherent and memorable.", "Creo lenguajes visuales para que webs, apps, campañas y productos digitales se sientan coherentes y memorables."],
  ["Motion Prototypes", "Motion & Prototypes"],
  ["Motion & Prototypes", "Motion & Prototypes"],
  ["I use motion to test ideas, explain behavior, and make interactions feel more intentional before they are built.", "Uso motion, video, conceptos de interacción y visuales apoyados en 3D para explorar ideas y hacerlas más fáciles de entender."],
  ["I use motion, video, interaction concepts, and 3D-assisted visuals to explore ideas and make them easier to understand.", "Uso motion, video, conceptos de interacción y visuales apoyados en 3D para explorar ideas y hacerlas más fáciles de entender."],
  ["Before deciding how something", "Antes de decidir cómo algo"],
  ["should look, I focus on what it", "debería verse, me enfoco en qué"],
  ["needs to say, what should feel", "necesita decir, qué debería"],
  ["easier, and what should stay", "sentirse más fácil y qué debería"],
  ["with people after.", "quedarse en las personas después."],
  ["Before deciding how something should look, I focus on what it needs to say, what should feel easier, and what should stay with people after.", "Antes de decidir cómo algo debería verse, me enfoco en qué necesita decir, qué debería sentirse más fácil y qué debería quedarse en las personas después."],
  ["What it needs to say", "Qué necesita decir"],
  ["How it should feel", "Cómo debería sentirse"],
  ["Where people should go", "Hacia dónde debería guiar"],
  ["What should stay with them", "Qué debería trascender"],
  ["Drop me a message!", "Escríbeme un mensaje"],
  ["Email me", "Email"],
  ["Whatsapp", "Whatsapp"],
  ["Linkedin", "Linkedin"],
  ["Instagram", "Instagram"],
  ["Designed and built by me 🤓", "Diseñado y construido por mí 🤓"],
];

const translations = {
  enToEs: new Map(translationPairs),
  esToEn: new Map(translationPairs.map(([english, spanish]) => [spanish, english])),
};

[
  ["View project →", "Ver proyecto →"],
  ["Watch demo →", "Ver demo →"],
  ["Watch reel →", "Ver reel →"],
  ["Watch concept →", "Ver concepto →"],
  ["Open website →", "Abrir sitio →"],
  ["Designed and built by me 🤓", "Diseñado y construido por mí 🤓"],
].forEach(([english, spanish]) => {
  translations.enToEs.set(english, spanish);
  translations.esToEn.set(spanish, english);
});

let currentLanguage = "en";
const scrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function scrambleTextNode(node, targetText) {
  const original = node.nodeValue;
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";
  let frame = 0;
  const frames = 12;

  const tick = () => {
    const progress = frame / frames;
    const stableLength = Math.floor(targetText.length * progress);
    const unstable = [...targetText.slice(stableLength)].map((character) => {
      if (character === " ") {
        return " ";
      }
      return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
    }).join("");

    node.nodeValue = `${leading}${targetText.slice(0, stableLength)}${unstable}${trailing}`;
    frame += 1;

    if (frame <= frames) {
      window.setTimeout(tick, 18);
    } else {
      node.nodeValue = `${leading}${targetText}${trailing}`;
    }
  };

  tick();
}

function translatePage(language) {
  const map = language === "es" ? translations.enToEs : translations.esToEn;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      if (node.parentElement?.closest("script, style, model-viewer")) {
        return NodeFilter.FILTER_REJECT;
      }
      if (node.parentElement?.closest("#contact-heading")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const trimmed = node.nodeValue.trim();
    const target = map.get(trimmed);
    if (target && target !== trimmed) {
      scrambleTextNode(node, target);
    }
  });

  const contactHeadingTarget = map.get(
    language === "es" ? "Drop me a message!" : "Escríbeme un mensaje"
  );
  if (contactHeadingTarget) {
    prepareContactHeading(contactHeadingTarget, true);
  }

  document.documentElement.lang = language;
  currentLanguage = language;
  if (languageCurrent && languageNext && languageToggle) {
    languageCurrent.textContent = language.toUpperCase();
    languageNext.textContent = language === "en" ? "ES" : "EN";
    languageToggle.setAttribute("aria-pressed", language === "es" ? "true" : "false");
  }
}

languageToggle?.addEventListener("click", () => {
  translatePage(currentLanguage === "en" ? "es" : "en");
});

window.addEventListener(
  "scroll",
  () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    cardTargetSquash = Math.min(delta / 720, 0.12);
    window.clearTimeout(scrollStopTimeout);
    scrollStopTimeout = window.setTimeout(() => {
      cardTargetSquash = 0;
    }, 160);
  },
  { passive: true }
);

function prepareContactHeading(nextText = contactHeading?.textContent || "", force = false) {
  if (!contactHeading || (!force && contactHeading.dataset.prepared === "true")) {
    return;
  }

  const text = nextText;
  const breakAfter = text.startsWith("Drop") ? "Drop\u00A0me" : "Escríbeme";
  contactHeading.textContent = "";

  [...text].forEach((character) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = character === " " ? "\u00A0" : character;
    contactHeading.appendChild(span);

    if (contactHeading.textContent === breakAfter) {
      const lineBreak = document.createElement("span");
      lineBreak.className = "mobile-break";
      lineBreak.innerHTML = "<br>";
      contactHeading.appendChild(lineBreak);
    }
  });

  contactHeading.dataset.prepared = "true";
}

prepareContactHeading();

if (contactSection) {
  contactSection.addEventListener("pointermove", (event) => {
    const rect = contactSection.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    contactTarget.x = x + 110;
    contactTarget.y = y - 24;
  });

  contactSection.addEventListener("pointerleave", () => {
    contactTarget.x = 0;
    contactTarget.y = 0;
  });
}

function animate() {
  if (heroModel) {
    currentOrbit.x += (pointerOrbit.x - currentOrbit.x) * 0.08;
    currentOrbit.y += (pointerOrbit.y - currentOrbit.y) * 0.08;
    currentOrientation.x += (pointerOrientation.x - currentOrientation.x) * 0.08;
    currentOrientation.y += (pointerOrientation.y - currentOrientation.y) * 0.08;
    heroModel.setAttribute(
      "camera-orbit",
      `${currentOrbit.x.toFixed(2)}deg ${currentOrbit.y.toFixed(2)}deg auto`
    );
    heroModel.setAttribute(
      "orientation",
      `${(heroModelSettings.orientation.x + currentOrientation.x).toFixed(2)}deg ${(heroModelSettings.orientation.y + currentOrientation.y).toFixed(2)}deg ${heroModelSettings.orientation.z}deg`
    );
  }

  if (cursorFollower) {
    cursorCurrent.x += (cursorTarget.x - cursorCurrent.x) * 0.05;
    cursorCurrent.y += (cursorTarget.y - cursorCurrent.y) * 0.05;
    cursorFollower.style.transform = `translate3d(${cursorCurrent.x}px, ${cursorCurrent.y}px, 0)`;
  }

  cardCurrentSquash += (cardTargetSquash - cardCurrentSquash) * 0.07;

  workCardStates.forEach((state, card) => {
    const hoverLift = state.hover ? -8 : 0;
    const scale = 1 - cardCurrentSquash;
    card.style.setProperty("--card-lift", `${hoverLift}px`);
    card.style.setProperty("--card-scale", scale.toFixed(4));
    card.style.setProperty("--card-tilt-x", "0deg");
    card.style.setProperty("--card-tilt-y", "0deg");
  });

  if (contactHeading) {
    contactCurrent.x += (contactTarget.x - contactCurrent.x) * 0.11;
    contactCurrent.y += (contactTarget.y - contactCurrent.y) * 0.11;
    contactVelocity.x += (contactTarget.x - contactCurrent.x - contactVelocity.x) * 0.14;
    contactVelocity.y += (contactTarget.y - contactCurrent.y - contactVelocity.y) * 0.14;

    const skewX = clamp(contactVelocity.x * 0.16, -16, 16);
    const rotate = clamp(contactVelocity.x * 0.042, -8, 8);
    const skewY = clamp(contactVelocity.y * -0.08, -7, 7);
    const followX = contactCurrent.x * contactFollowStrength;
    const followY = contactCurrent.y * contactFollowStrength;
    const headingTransform = `translate3d(calc(-50% + ${followX.toFixed(2)}px), calc(-50% + ${followY.toFixed(2)}px), 0) skewX(${skewX.toFixed(2)}deg) skewY(${skewY.toFixed(2)}deg) rotate(${rotate.toFixed(2)}deg)`;
    contactHeading.style.transform = headingTransform;

    const chars = [...contactHeading.querySelectorAll(".char")];
    chars.forEach((char, index) => {
      const normalized = index / Math.max(chars.length - 1, 1);
      const arc = Math.sin(normalized * Math.PI);
      const bend = contactVelocity.y * arc * 0.84;
      const sway = contactVelocity.x * (normalized - 0.5) * 0.38;
      const drift = contactVelocity.x * arc * 0.1;
      char.style.transform = `translate3d(${drift.toFixed(2)}px, ${bend.toFixed(2)}px, 0) rotate(${sway.toFixed(2)}deg)`;
    });
  }

  window.requestAnimationFrame(animate);
}

syncScenes();
animate();
