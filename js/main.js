const escapeHtml = (s) => s.replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m]);

// a group of buttons that each show the panel they aria-control and hide the rest;
// the hint retires on the first real click, not on programmatic calls to the returned show()
function showOnClick(buttons, hint, onShow) {
  const panelOf = (button) => document.getElementById(button.getAttribute("aria-controls"));
  const show = (selected) => {
    for (const button of buttons) {
      const on = button === selected;
      button.setAttribute("aria-pressed", on);
      panelOf(button).classList.toggle("on", on);
    }
    onShow?.(selected);
  };
  for (const button of buttons) {
    button.addEventListener("click", () => {
      hint.classList.add("gone");
      show(button);
    });
  }
  return show;
}

// HEADER
// slides in once the hero has scrolled out from under it
const header = document.getElementById("hdr");
new IntersectionObserver(([hero]) => header.classList.toggle("scrolled", !hero.isIntersecting), {
  rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
}).observe(document.getElementById("hero"));

// ROADMAP
// the first milestone is selected in the markup, so there's nothing to show up front
showOnClick([...document.querySelectorAll(".bar")], document.getElementById("rmHint"));

// PACMAN DIVIDER
// progress follows scroll (backwards when scrolling up); pacman is gone once the line is complete
function pacman(bar) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let length = 0; // characters that fit across the bar
  let pos = -1;
  let queued = false;

  const measure = () => {
    const probe = document.createElement("span");
    probe.textContent = "0".repeat(10);
    bar.appendChild(probe);
    const charWidth = probe.getBoundingClientRect().width / 10;
    probe.remove();
    length = Math.max(8, Math.floor(bar.clientWidth / charWidth));
  };

  const draw = () => {
    if (pos >= length - 1) {
      bar.innerHTML = `<span class="tr">${"-".repeat(length)}</span>`;
      return;
    }
    let dots = "";
    for (let i = pos + 1; i < length; i++) dots += i % 3 === 0 ? "o" : " ";
    bar.innerHTML = `<span class="tr">${"-".repeat(pos)}</span><span class="pm">${pos % 2 ? "c" : "C"}</span>${dots}`;
  };

  // 0 when the bar enters at the bottom of the screen, 1 once it's a third of the way down from the top
  const progress = () => {
    const vh = innerHeight;
    const top = bar.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, (vh - top) / ((vh * 2) / 3)));
  };

  const update = () => {
    queued = false;
    const next = reducedMotion ? length - 1 : Math.round(progress() * (length - 1));
    if (next !== pos) {
      pos = next;
      draw();
    }
  };

  const remeasure = () => {
    measure();
    pos = -1;
    update();
  };

  remeasure();
  addEventListener("resize", remeasure);
  if (!reducedMotion) {
    addEventListener(
      "scroll",
      () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
  }
}
const pacbar = document.getElementById("pacbar");
if (pacbar) pacman(pacbar);

// TERMINAL
// console.table-style box: columns sized to their widest cell
function table(head, rows) {
  const all = [head, ...rows];
  const widths = head.map((_, i) => Math.max(...all.map((r) => r[i].length)));
  const rule = (left, mid, right) => left + widths.map((w) => "─".repeat(w + 2)).join(mid) + right;
  const row = (cells) => "│" + cells.map((c, i) => " " + c.padEnd(widths[i]) + " ").join("│") + "│";
  const text = escapeHtml(
    [rule("┌", "┬", "┐"), row(head), rule("├", "┼", "┤"), ...rows.map(row), rule("└", "┴", "┘")].join("\n"),
  );
  return '<span class="tbl">' + text.replace(/[─│┌┬┐├┼┤└┴┘]+/g, (m) => "<i>" + m + "</i>") + "</span>";
}

const jobs = [
  ["Flick", "2023–25", "Rails apprentice"],
  ["BNZ", "2025–26", "mainframe wizard"],
  ["Āhau", "2026–now", "deliverer of deliverables"],
];
const projects = [
  ["fetch-plugin/", "widget for viewing PC stats on Noctalia"],
  ["scam-buster/", "URL analysis and running unknown phone numbers"],
  ["portfolio/", "you are here"],
];

// '# ...' lines are shell comments: a plain-English heading for each group
const comment = (t) => '<span class="t-c"># ' + escapeHtml(t) + "</span>";
const block = (t) => '<span class="t-b">' + escapeHtml(t) + "</span>";
const dir = (d) => '<span class="t-dir">' + escapeHtml(d) + "</span>";

// values are HTML: plain text goes through escapeHtml()
const outputs = new Map([
  [
    "cat experience.md",
    comment("where I've worked") +
      table(["where", "when", "role"], jobs) +
      // the table is too wide for phones, so a plain list of the same jobs is rendered alongside; CSS shows one
      '<span class="tbl-list">' +
      jobs.map(([co, yrs, role]) => dir(co) + " " + escapeHtml(yrs) + "\n  " + escapeHtml(role)).join("\n") +
      "</span>" +
      comment("training") +
      block("Developers Institute diploma") +
      comment("stack") +
      block(
        "JS, Node, React, Rails – and honestly anything I've been forced to run with in technical interviews.\nReluctantly agentic coding, harness engineering, and SDD\nArch linux btw.",
      ),
  ],
  [
    "ls side-projects/",
    comment("things I've built for fun") +
      '<span class="t-ls">' +
      projects.map(([d, desc]) => dir(d) + "<span>" + escapeHtml(desc) + "</span>").join("") +
      "</span>",
  ],
  ["help", escapeHtml("commands: cat experience.md, ls side-projects/, clear")],
]);

const termBody = document.getElementById("termBody");
const termOut = document.getElementById("termOut");
const termIn = document.getElementById("termIn");
let busy = false;

// each command replaces the previous output, so the box never grows
async function run(command, typeIt) {
  command = command.trim();
  if (busy || !command) return;
  busy = true;
  if (typeIt) {
    termIn.value = "";
    for (const ch of command) {
      termIn.value += ch;
      await new Promise((r) => setTimeout(r, 30));
    }
  }
  // the command stays on the prompt line above its output, like a real shell
  if (command === "clear") {
    termIn.value = "";
    termOut.innerHTML = "";
  } else {
    termOut.innerHTML =
      outputs.get(command) ?? '<span class="t-err">command not found: ' + escapeHtml(command) + "</span>  (try help)";
    termOut.scrollTop = 0;
    termBody.scrollTop = 0;
  }
  busy = false;
}

for (const button of document.querySelectorAll("#cmds button")) {
  button.addEventListener("click", () => run(button.dataset.c, true));
}
// focusing selects the last command, so typing replaces it
termIn.addEventListener("focus", () => termIn.select());
termIn.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    run(termIn.value);
  }
});
termBody.addEventListener("click", (e) => {
  if (!e.target.closest("button,a")) termIn.focus({ preventScroll: true });
});

// TIMELINE
const REEL_SECONDS = 120; // matches the ruler's 02:00
const clips = [...document.querySelectorAll(".clip")];
const editor = document.getElementById("editor");
const playhead = document.getElementById("playhead");
const timecode = document.getElementById("tc");
const monitor = document.getElementById("monitor");

// filmstrip: each clip tiles its reel/ photo along the track
for (const clip of clips) clip.style.backgroundImage = `url(${clip.dataset.img})`;

// position only: safe to call on resize without replaying the caption fade
function movePlayhead(clip) {
  const editorBox = editor.getBoundingClientRect();
  const clipBox = clip.getBoundingClientRect();
  playhead.style.left = clipBox.left - editorBox.left + 8 + "px";
  const lane = clip.parentElement.getBoundingClientRect();
  const s = Math.round(((clipBox.left - lane.left) / lane.width) * REEL_SECONDS);
  timecode.textContent = "00:0" + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0") + ":00";
}

const showClip = showOnClick(clips, document.getElementById("reelHint"), (clip) => {
  // --shot is substituted inside style.css, where a relative url() would resolve against css/,
  // so it gets an absolute URL
  monitor.style.setProperty("--shot", `url(${new URL(clip.dataset.img, document.baseURI)})`);
  movePlayhead(clip);
});
// after layout, so the playhead can measure the first clip
requestAnimationFrame(() => showClip(clips[0]));
addEventListener("resize", () => movePlayhead(clips.find((c) => c.getAttribute("aria-pressed") === "true")));
