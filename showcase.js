// Every project maps to its folder. `path` is URL-encoded where needed so
// folders with spaces (e.g. "Quiz APP") resolve correctly.
const projects = [
  { title: "Color Scheme Switcher", dir: "colorChanger", icon: "🎨", cat: "ui",
    desc: "Flip the whole page between color schemes with a click." },
  { title: "BMI Calculator", dir: "BMICalculator", icon: "⚖️", cat: "tools",
    desc: "Enter height and weight, get your body mass index instantly." },
  { title: "Digital Clock", dir: "DigitalClock", icon: "🕒", cat: "ui",
    desc: "A live ticking clock showing your local time." },
  { title: "Guess The Number", dir: "GuessTheNumber", icon: "🎯", cat: "games",
    desc: "Classic higher-or-lower number guessing game." },
  { title: "Keyboard Event Codes", dir: "keyboard", icon: "⌨️", cat: "tools",
    desc: "Press any key and inspect its live event key codes." },
  { title: "Page Scroll Indicator", dir: "scroll", icon: "📜", cat: "ui",
    desc: "A progress bar that tracks how far you've scrolled." },
  { title: "Custom Cursor Effect", dir: "mouseCircle", icon: "🖱️", cat: "ui",
    desc: "A trailing circle that follows your mouse around." },
  { title: "Random Emojis", dir: "emoji", icon: "😄", cat: "api",
    desc: "Fetch and display a fresh batch of random emojis." },
  { title: "Random Image Feed", dir: "randomImage", icon: "🖼️", cat: "api",
    desc: "Pull random images on demand into an endless feed." },
  { title: "Chuck Norris Jokes", dir: "jokes", icon: "🥋", cat: "api",
    desc: "Fetch one-liner jokes from an API with promises." },
  { title: "Random Cat Images", dir: "cats", icon: "🐱", cat: "api",
    desc: "Because the internet always needs more cats." },
  { title: "CRUD Book List", dir: "crudDom", icon: "📚", cat: "tools",
    desc: "Add, read and delete books — DOM-driven CRUD." },
  { title: "Debounced Search", dir: "debounce", icon: "⏱️", cat: "tools",
    desc: "See debouncing tame a rapid-fire search input." },
  { title: "Text Formatter", dir: "textEditor", icon: "✍️", cat: "tools",
    desc: "A mini rich-text editor with formatting controls." },
  { title: "Auto Typer", dir: "typer", icon: "⌨️", cat: "ui",
    desc: "Animated typewriter text that types itself out." },
  { title: "Quiz App", dir: "Quiz APP", icon: "❓", cat: "games",
    desc: "Answer multiple-choice questions and score yourself." },
  { title: "To-Do List", dir: "TO-DO List", icon: "✅", cat: "tools",
    desc: "Add, check off and manage tasks — saved as you go." },
  { title: "Weather App", dir: "Weather APP", icon: "⛅", cat: "api",
    desc: "Search any city and see live weather conditions." },
  { title: "Faulty Calculator", dir: "Faulty Calculator", icon: "🧮", cat: "games",
    desc: "A calculator with a mischievous twist. Can you beat it?" },
];

const CATEGORY_LABEL = {
  games: "Game",
  tools: "Tool",
  ui: "UI / Effect",
  api: "API / Fetch",
};

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("search");
const resultCount = document.getElementById("result-count");
const chips = Array.from(document.querySelectorAll(".chip"));

let activeFilter = "all";
let query = "";

function href(dir) {
  // Encode each path segment so spaces and special chars work.
  return dir.split("/").map(encodeURIComponent).join("/") + "/index.html";
}

function matches(p) {
  const inCategory = activeFilter === "all" || p.cat === activeFilter;
  const q = query.trim().toLowerCase();
  const inSearch =
    !q ||
    p.title.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.cat.toLowerCase().includes(q);
  return inCategory && inSearch;
}

function render() {
  const visible = projects.filter(matches);
  grid.innerHTML = "";

  visible.forEach((p, i) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "card";
    a.href = href(p.dir);
    a.style.animationDelay = `${Math.min(i * 40, 400)}ms`;
    a.setAttribute("aria-label", `${p.title} — ${p.desc}`);

    a.innerHTML = `
      <span class="card__icon" aria-hidden="true">${p.icon}</span>
      <span class="card__tag">${CATEGORY_LABEL[p.cat] || p.cat}</span>
      <h2 class="card__title">${p.title}</h2>
      <p class="card__desc">${p.desc}</p>
      <span class="card__go" aria-hidden="true">Open project →</span>
    `;
    li.appendChild(a);
    grid.appendChild(li);
  });

  empty.hidden = visible.length !== 0;
  resultCount.textContent =
    visible.length === projects.length
      ? `Showing all ${projects.length} projects`
      : `${visible.length} of ${projects.length} projects`;
}

searchInput.addEventListener("input", (e) => {
  query = e.target.value;
  render();
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => {
      c.classList.remove("is-active");
      c.setAttribute("aria-pressed", "false");
    });
    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");
    activeFilter = chip.dataset.filter;
    render();
  });
});

render();
