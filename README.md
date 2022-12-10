# Game Overlay

A configurable overlay window.

[![build](https://github.com/hans00/game-overlay/actions/workflows/build.yml/badge.svg)](https://github.com/hans00/game-overlay/actions/workflows/build.yml)

---

## Keymap

- `CmdOrCtrl + Shift + R`: **Restart app**
- `CmdOrCtrl + Shift + X`: **Exit app**
- `CmdOrCtrl + Shift + H`: **Show ot hide app**
- `CmdOrCtrl + Shift + M`: **Toggle mouse focus**
- `CmdOrCtrl + Shift + C`: **Open config folder**

## Config

```json
{
  "url": "Overlay window content URL",
  "hookWindowTitle": "Window title to overlay",
  "keymap": {
    "restart": "CmdOrCtrl + Shift + R",
    "exit": "CmdOrCtrl + Shift + X",
    "hide": "CmdOrCtrl + Shift + H",
    "mouse": "CmdOrCtrl + Shift + M",
    "config": "CmdOrCtrl + Shift + C",
  }
}
```
