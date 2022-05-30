"use strict";
const fs = require("fs");
const merge = require("deepmerge").all;
const exec = ([c]) => require("child_process").execSync(c, { stdio: "ignore" });
const read = (p) => eval(`(${fs.readFileSync(p)})`);
const write = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj));
const walk = (obj, fn) => {
  for (const [k, v] of Object.entries(obj))
    if (typeof v === "string" && v.startsWith("#")) obj[k] = fn(v);
    else if (typeof v === "object") walk(v, fn);
};
const walker = (c /* #rgb #rgba #rrggbb #rrggbbaa */) => {
  const p = (i, l = 1) => {
    let v = parseInt(c.substr(i, l), 16);
    v = Math.min(16 ** l - 1, v * 1.1);
    return Math.round(v).toString(16).padStart(l, 0);
  };
  const rgb = c.length < 6 ? [p(1), p(2), p(3)] : [p(1, 2), p(3, 2), p(5, 2)];
  const alpha = c.length < 6 ? c.substr(4, 1) : c.substr(7, 2);
  return "#" + rgb.join("") + alpha;
};
if (!fs.existsSync("temp")) {
  console.log("download:", ["dark_plus.json", "dark_vs.json"]);
  fs.mkdirSync("temp", { recursive: true });
  exec`curl -o temp/dark_plus.json https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_plus.json`;
  exec`curl -o temp/dark_vs.json https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_vs.json`;
}
console.log("generate:", ["theme.dist.json"]);
const theme = merge(["temp/dark_vs.json", "temp/dark_plus.json"].map(read));
walk(theme, walker);
const patch = {
  name: "Sharpen",
  include: undefined,
  colors: {
    "editor.background": "#000",
    "editorWidget.background": "#000",
    "editorGroupHeader.tabsBackground": "#000",
    "tab.border": "#000",
    "tab.inactiveBackground": "#000",
    "activityBar.background": "#000",
    "titleBar.activeBackground": "#000",
    "sideBar.background": "#000",
    "statusBar.background": "#000",
    "statusBar.noFolderBackground": "#000",
    "statusBar.debuggingBackground": "#000",
    "statusBar.offlineBackground": "#000",
    "statusBarItem.remoteBackground": "#000",
    "debugToolBar.background": "#000",
    "menu.background": "#000",
    "dropdown.background": "#000",
    "input.background": "#000",
    "button.background": "#094771",
  },
};
write("theme.dist.json", merge([theme, patch]));
