/**
 * Spot-check CMS + Analytics wireframe auto-stacks in Design Hub.
 * Usage: node scripts/spot-check-cms-wireframes.mjs [baseURL]
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const baseURL = process.argv[2] ?? "http://localhost:4000";
const persist = JSON.parse(readFileSync("/tmp/nezam-hub-persist.json", "utf8"));

const EXPECTED = {
  cms: {
    "/contact": [
      "Nav_TopBar",
      "Layout_PageHeader",
      "Content_ContactSplit",
      "Content_ContactChannels",
      "Nav_Footer",
    ],
    "/about": [
      "Nav_TopBar",
      "Content_AboutHero",
      "Content_AboutValues",
      "Content_AboutTimeline",
      "Art_Team_Portraits",
      "Nav_Footer",
    ],
    "/dashboard/users": [
      "Nav_Sidebar",
      "Layout_PageHeader",
      "Content_UserInvite",
      "Data_UserTable",
    ],
    "/dashboard/settings": [
      "Nav_Sidebar",
      "Layout_SettingsShell",
      "Form_SettingsSections",
      "Content_DangerZone",
    ],
  },
  analytics: {
    overview: [
      "Nav_Sidebar",
      "Data_AnalyticsToolbar",
      "Data_AnalyticsOverview",
      "Data_AnalyticsChartGrid",
      "Data_Table",
    ],
  },
};

const CMS_ROUTES = {
  "/contact": EXPECTED.cms["/contact"],
  "/about": EXPECTED.cms["/about"],
  "/dashboard/users": EXPECTED.cms["/dashboard/users"],
  "/dashboard/settings": EXPECTED.cms["/dashboard/settings"],
};

const CMS_LABELS = {
  "/contact": "Contact",
  "/about": "About",
  "/dashboard/users": "Users",
  "/dashboard/settings": "Settings",
};

const ANALYTICS_LABELS = {
  "/": "Overview",
};

async function readBlockStack(page) {
  await page.waitForTimeout(500);
  const types = await page
    .locator("p.truncate.font-mono.text-\\[10px\\]")
    .allTextContents();
  return types.map((t) => t.trim()).filter(Boolean);
}

async function selectPage(page, profileKey, route, label) {
  const byRoute = page.locator(`[title="${route}"]`).first();
  if ((await byRoute.count()) > 0) {
    await byRoute.click();
    return;
  }
  const byLabel = page.getByText(label, { exact: true }).first();
  if ((await byLabel.count()) > 0) {
    await byLabel.click();
    return;
  }
  throw new Error(`page row not found (${profileKey}: ${route} / ${label})`);
}

async function checkProfile(browser, profileKey, routes, labelsByRoute) {
  const results = [];
  const context = await browser.newContext();
  await context.addInitScript((data) => {
    localStorage.setItem("nezam-design-hub-v7", JSON.stringify(data));
  }, persist[profileKey]);

  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1500);

  const wireframesTab = page.getByRole("button", { name: /^Wireframes$/i });
  if ((await wireframesTab.count()) > 0) {
    await wireframesTab.click();
    await page.waitForTimeout(500);
  }

  for (const [route, expected] of Object.entries(routes)) {
    try {
      await selectPage(page, profileKey, route, labelsByRoute[route]);
    } catch (e) {
      results.push({
        profile: profileKey,
        route,
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      });
      continue;
    }
    const actual = await readBlockStack(page);
    const ok =
      actual.length === expected.length &&
      actual.every((t, i) => t === expected[i]);
    results.push({
      profile: profileKey,
      route,
      ok,
      expected,
      actual,
    });
  }

  await context.close();
  return results;
}

const browser = await chromium.launch({ headless: true });
try {
  const all = [
    ...(await checkProfile(browser, "cms", CMS_ROUTES, CMS_LABELS)),
    ...(await checkProfile(browser, "analytics", { "/": EXPECTED.analytics.overview }, ANALYTICS_LABELS)),
  ];

  console.log(JSON.stringify({ baseURL, results: all }, null, 2));

  const failed = all.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} spot-check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll spot-checks passed.");
} finally {
  await browser.close();
}
