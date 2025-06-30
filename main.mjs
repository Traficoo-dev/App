import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import RPC from 'discord-rpc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const clientId = '1353091469334020168'; // Remplace par ton ID

const rpc = new RPC.Client({ transport: 'ipc' });

async function checkDiscordAndStartRPC() {
  const psList = (await import('ps-list')).default;
  const processes = await psList();
  const discordRunning = processes.some(p => p.name.toLowerCase().includes('discord'));

  if (discordRunning) {
    rpc.login({ clientId }).catch(console.error);

    rpc.on('ready', () => {
      rpc.setActivity({
        details: 'Sur Traficoo',
        state: 'Exploration en cours...',
        startTimestamp: new Date(),
        largeImageKey: 'traficoo',
        largeImageText: 'Traficoo',
        instance: false,
      });
    });
  }
}

function createWindow() {
  const loading = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
  });

  loading.loadFile(path.join(__dirname, 'loading.html'));
  loading.once('ready-to-show', () => loading.show());

  setTimeout(() => {
    loading.close();

    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
      }
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer.html'));
  }, 3000);
}

app.whenReady().then(() => {
  createWindow();
  checkDiscordAndStartRPC();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
