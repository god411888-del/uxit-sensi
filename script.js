const DB = {
  "Auto Detect": { dpi: "400–460" },
  "Custom Device": { dpi: "400–480" },
  "Samsung Galaxy A05": { dpi: "400–440" },
  "Samsung Galaxy A06": { dpi: "400–440" },
  "Samsung Galaxy A50": { dpi: "420–450" },
  "Tecno Spark 30C": { dpi: "400–440" },
  "Tecno Pova 4 Pro": { dpi: "420–460" },
  "Xiaomi Redmi 13C": { dpi: "400–440" },
  "Xiaomi Redmi A3": { dpi: "400–440" },
  "Xiaomi Redmi A5": { dpi: "400–440" },
  "OPPO A53": { dpi: "400–440" },
  "vivo Y21D": { dpi: "400–440" },
  "iPhone 11": { dpi: "Default" },
  "iPhone 16": { dpi: "Default" }
};

const PROFILES = {
  "Balanced": [195, 190, 184, 178, 118, 164],
  "Fast Drag": [198, 192, 185, 178, 120, 165],
  "Precise Drag": [188, 184, 178, 172, 112, 158],
  "Custom": [195, 190, 184, 178, 115, 160]
};

const LABELS = [
  "General",
  "Red Dot",
  "2X Scope",
  "4X Scope",
  "Sniper",
  "Free Look"
];

const $ = id => document.getElementById(id);

function getDevice() {
  return localStorage.getItem("uxitDevice") || "Auto Detect";
}

function getProfile() {
  return localStorage.getItem("uxitProfile") || "Balanced";
}

function getValues() {
  const saved = localStorage.getItem("uxitTuned");
  return saved ? JSON.parse(saved) : [...PROFILES[getProfile()]];
}

function renderConfig() {
  const device = getDevice();
  const profile = getProfile();
  const values = getValues();

  const deviceSelect = $("deviceSelect");
  const profileSelect = $("profileSelect");

  if (deviceSelect) {
    deviceSelect.innerHTML = Object.keys(DB)
      .map(deviceName => `<option value="${deviceName}">${deviceName}</option>`)
      .join("");

    deviceSelect.value = device;
  }

  if (profileSelect) {
    profileSelect.innerHTML = Object.keys(PROFILES)
      .map(profileName => `<option value="${profileName}">${profileName}</option>`)
      .join("");

    profileSelect.value = profile;
  }

  if ($("deviceName")) {
    $("deviceName").textContent = device;
  }

  if ($("profileName")) {
    $("profileName").textContent = profile;
  }

  if ($("dpiValue")) {
    $("dpiValue").textContent = DB[device].dpi;
  }

  if ($("sensiList")) {
    $("sensiList").innerHTML = LABELS.map((label, index) => `
      <div class="sensi-row">
        <span>${label}</span>
        <strong>${values[index]}</strong>
      </div>
    `).join("");
  }

  renderTuner(values);
}

function renderTuner(values) {
  const tuner = $("tunerSliders");

  if (!tuner) return;

  tuner.innerHTML = LABELS.map((label, index) => `
    <label class="slider-row">
      <span>${label}</span>
      <input
        type="range"
        min="0"
        max="200"
        value="${values[index]}"
        data-index="${index}"
      >
      <b>${values[index]}</b>
    </label>
  `).join("");

  tuner.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", event => {
      event.target.nextElementSibling.textContent =
        event.target.value;
    });
  });
}

function getConfigText() {
  const device = getDevice();
  const profile = getProfile();
  const values = getValues();

  const settings = LABELS.map(
    (label, index) => `${label}: ${values[index]}`
  ).join("\n");

  return `UXIT SENSI PREMIUM

Device: ${device}
Profile: ${profile}
DPI: ${DB[device].dpi}

${settings}

UXIT SENSI`;
}

async function copyConfig() {
  const text = getConfigText();

  try {
    await navigator.clipboard.writeText(text);
    alert("UXIT SENSI config copied!");
  } catch {
    prompt("Copy your UXIT SENSI config:", text);
  }
}

async function shareConfig() {
  const text = getConfigText();

  if (navigator.share) {
    try {
      await navigator.share({
        title: "UXIT SENSI PREMIUM",
        text: text
      });
    } catch {}
  } else {
    copyConfig();
  }
}

function switchView(viewName) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.remove("active");
  });

  const target = $(viewName + "View");

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === viewName
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.addEventListener("DOMContentLoaded", () => {

  renderConfig();

  $("deviceSelect")?.addEventListener("change", event => {
    localStorage.setItem(
      "uxitDevice",
      event.target.value
    );

    localStorage.removeItem("uxitTuned");

    renderConfig();
  });

  $("profileSelect")?.addEventListener("change", event => {
    localStorage.setItem(
      "uxitProfile",
      event.target.value
    );

    localStorage.removeItem("uxitTuned");

    renderConfig();
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
    });
  });

  $("copyBtn")?.addEventListener("click", copyConfig);

  $("shareBtn")?.addEventListener("click", shareConfig);

  $("saveTunerBtn")?.addEventListener("click", () => {

    const inputs =
      document.querySelectorAll("#tunerSliders input");

    const values = [...inputs].map(input =>
      Number(input.value)
    );

    localStorage.setItem(
      "uxitTuned",
      JSON.stringify(values)
    );

    renderConfig();

    alert("UXIT SENSI tuning saved!");
  });

  $("resetTunerBtn")?.addEventListener("click", () => {

    localStorage.removeItem("uxitTuned");

    renderConfig();

    alert("Tuning reset!");
  });

});
