const { app, BrowserWindow, globalShortcut, shell } = require('electron')
const { OverlayController, OVERLAY_WINDOW_OPTS } = require('electron-overlay-window')
const fs = require('fs')
const path = require('path')
const merge = require('merge-deep')

app.disableHardwareAcceleration()

let window

const defaultConfig = {
  url: 'https://github.com/hans00/game-overlay/blob/main/README.md',
  hookWindowTitle: '',
  keymap: {
    exit: 'CmdOrCtrl + Shift + X',
    restart: 'CmdOrCtrl + Shift + R',
    mouse: 'CmdOrCtrl + Shift + M',
    hide: 'CmdOrCtrl + Shift + H',
    config: 'CmdOrCtrl + Shift + C',
  }
}

const configFile = path.join(app.getPath('userData'), 'config.json')

let config = defaultConfig

if (!fs.existsSync(configFile)) {
  fs.mkdirSync(app.getPath('userData'), { recursive: true })
  fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 4))
} else {
  try {
    config = merge(config, JSON.parse(fs.readFileSync(configFile)))
  } catch {} // eslint-disable-line no-empty
}

const {
  keymap: {
    exit: exitKey,
    restart: restartKey,
    mouse: toggleMouseKey,
    hide: toggleShowKey,
    config: showConfigKey,
  },
} = config

const isOverlay = !!config.hookWindowTitle

function createWindow () {
  const windowOpts = {
    width: 800,
    height: 600,
    webPreferences: {
      preload: require.resolve('./preload'),
    },
  }

  window = new BrowserWindow(
    isOverlay ? { ...windowOpts, ...OVERLAY_WINDOW_OPTS } : windowOpts
  )

  window.loadURL(config.url)

  if (process.env.NODE_ENV === 'development') {
    // NOTE: if you close Dev Tools overlay window will lose transparency
    window.webContents.openDevTools({ mode: 'detach', activate: false })
  }

  makeInteractive()

  if (isOverlay)
    OverlayController.attachByTitle(
      window,
      config.hookWindowTitle,
      { hasTitleBarOnMac: true }
    )
}

function makeInteractive () {
  let isInteractable = false

  function exitApp () {
    app.exit()
  }

  function restartApp () {
    app.relaunch()
    app.exit()
  }

  function toggleOverlayState () {
    if (isInteractable) {
      isInteractable = false
      OverlayController.focusTarget()
    } else {
      isInteractable = true
      OverlayController.activateOverlay()
    }
  }

  window.on('blur', () => {
    isInteractable = false
  })

  globalShortcut.register(exitKey, exitApp)

  globalShortcut.register(restartKey, restartApp)

  if (isOverlay) {
    globalShortcut.register(toggleMouseKey, toggleOverlayState)

    globalShortcut.register(toggleShowKey, () => {
      window.webContents.send('visibility-change', false)
    })
  }

  globalShortcut.register(showConfigKey, () => {
    shell.showItemInFolder(configFile)
  })
}

app.on('ready', () => {
  setTimeout(
    createWindow,
    process.platform === 'linux' ? 1000 : 0 // https://github.com/electron/electron/issues/16809
  )
})
