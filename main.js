const path = require("path");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const os = require("os");
const fs = require("fs");

const isDev = process.env.NODE_ENV !== "development";

const isMac = process.platform === "darwin";

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Task Manager",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //open devtools if in dev env

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/signup.html"));

  ipcMain.on("open-new-window", () => {
    createSignInWindow();
    mainWindow.close();
  });
  ipcMain.on("open-home", () => {
    createHomeWindow();
    mainWindow.close();
  });
}

function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About Task Manager",
    width: 300,
    height: 300,
  });

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

function createSignInWindow() {
  const signInWindow = new BrowserWindow({
    title: "Task Manager",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  signInWindow.loadFile("./renderer/signin.html");
}

function createHomeWindow() {
  const HomeWindow = new BrowserWindow({
    title: "Task Manager",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  HomeWindow.loadFile("./renderer/home.html");
}

app.whenReady().then(() => {
  createMainWindow();

  //implement menu

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  //remove mainWindow from memory on close
  mainWindow.on("close", () => (mainWindow = null));

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

//menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
