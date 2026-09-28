/**
 * QA screenshot tool (dev-only, not saved into package.json).
 * Captures the static export at the five brief viewports, per-section on
 * desktop and key sections on smaller screens, plus reduced-motion and
 * no-JS variants. Handles the known in-app-browser quirks:
 * scrollRestoration=manual + instant scrolling.
 */
const { chromium } = require("playwright-core");
const path = require("path");
const os = require("os");
const fs = require("fs");

const EXE = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "ms-playwright",
  "chromium-1228",
  "chrome-win64",
  "chrome.exe"
);
const BASE = process.env.QA_URL || "http://127.0.0.1:4321/";
const OUT = path.join(__dirname, "..", ".qa", "v4");

const SECTIONS = [
  ["hero", null],
  ["intro", "#about"],
  ["metrics", "#metrics"],
  ["experience", "#experience"],
  ["project1", "#project-01"],
  ["project2", "#project-02"],
  ["project3", "#project-03"],
  ["research", "#research"],
  ["skills", "#skills"],
  ["education", "#education"],
  ["contact", "#contact"],
];

async function capture(browser, { width, height, tag, sections, reduceMotion, javaScriptEnabled, dark }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: reduceMotion ? "reduce" : "no-preference",
    javaScriptEnabled,
  });
  if (dark) {
    await ctx.addInitScript(() => {
      try { localStorage.setItem("theme", "dark"); } catch (e) {}
    });
  }
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    history.scrollRestoration = "manual";
  });
  // let fonts settle
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  for (const [name, sel] of sections) {
    if (sel) {
      await page.evaluate((s) => {
        const el = document.querySelector(s);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
        }
      }, sel);
      await page.waitForTimeout(1400);
    } else if (name === "hero") {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(2200);
    }
    // settle reveals: nudge 1px down/up not needed; extra wait covers transitions
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `${tag}-${name}.png`) });
  }
  await ctx.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXE });

  const dSections = SECTIONS.map(([n, s]) => [n, s]);

  await capture(browser, {
    width: 1440, height: 900, tag: "d1440", sections: dSections,
  });
  await capture(browser, {
    width: 1280, height: 720, tag: "d1280", sections: [["hero", null], ["metrics", "#metrics"], ["project1", "#projects"], ["contact", "#contact"]],
  });
  await capture(browser, {
    width: 1024, height: 768, tag: "d1024", sections: [["hero", null], ["experience", "#experience"]],
  });
  await capture(browser, {
    width: 768, height: 1024, tag: "t768", sections: [["hero", null], ["metrics", "#metrics"], ["projects", "#projects"], ["contact", "#contact"]],
  });
  await capture(browser, {
    width: 390, height: 844, tag: "m390", sections: [["hero", null], ["metrics", "#metrics"], ["experience", "#experience"], ["projects", "#projects"], ["contact", "#contact"]],
  });

  // reduced motion + no-JS sanity captures
  await capture(browser, {
    width: 1440, height: 900, tag: "rm1440", reduceMotion: true,
    sections: [["hero", null], ["metrics", "#metrics"], ["contact", "#contact"]],
  });
  await capture(browser, {
    width: 1440, height: 900, tag: "nojs1440", javaScriptEnabled: false,
    sections: [["hero", null], ["metrics", "#metrics"], ["contact", "#contact"]],
  });

  // dark mode captures
  await capture(browser, {
    width: 1440, height: 900, tag: "dk1440", dark: true,
    sections: [["hero", null], ["intro", "#about"], ["metrics", "#metrics"], ["experience", "#experience"], ["project1", "#project-01"], ["project3", "#project-03"], ["education", "#education"], ["contact", "#contact"]],
  });
  await capture(browser, {
    width: 390, height: 844, tag: "dkm390", dark: true,
    sections: [["hero", null], ["projects", "#projects"], ["contact", "#contact"]],
  });

  await browser.close();
  console.log("done ->", OUT);
})();
