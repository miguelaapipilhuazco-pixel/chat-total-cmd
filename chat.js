import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import SysTray from "systray2";

const app = express();
app.use(express.json());

let config = { nombreIA: "ia" };
if (fs.existsSync("config.json")) {
  try { config = JSON.parse(fs.readFileSync("config.json", "utf8")); } catch(e){}
}

const tagIA = config.nombreIA || "ia";
let sistemaEncendido = true;

const trayConfig = {
  menu: {
    icon: fs.existsSync("logo.ico") ? fs.readFileSync("logo.ico", "base64") : "",
    title: tagIA,
    tooltip: tagIA,
    items: [
      { title: "Encender / Apagar (Activo)", checked: false, enabled: true }
    ]
  }
};

const systray = new SysTray.default(trayConfig);

systray.onClick(action => {
  if (action.item.title.includes("Encender") || action.item.title.includes("Apagar")) {
    sistemaEncendido = !sistemaEncendido;
    if (sistemaEncendido) {
      exec("start /b npx electron main.cjs");
    } else {
      exec("taskkill /f /im electron.exe ");
    }
    action.item.title = sistemaEncendido ? "Encender / Apagar (Activo)" : "Encender / Apagar (Inactivo)";
    systray.sendAction({ type: "update-item", item: action.item });
  }
});

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{background:transparent;margin:0;padding:20px;font-family:system-ui;display:flex;flex-direction:column;align-items:center;gap:25px;overflow:hidden;user-select:none;}.circle-menu{width:160px;height:160px;background:rgba(30,30,30,0.95);border:1px solid rgba(255,255,255,0.08);border-radius:50%;position:relative;display:flex;align-items:center;justify-content:center;}.center-node{width:36px;height:36px;background:#4f46e5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#fff;font-size:10px;}.tool{position:absolute;color:rgba(255,255,255,0.7);font-size:16px;cursor:pointer;}.top-points{top:15px;font-size:20px;color:rgba(255,255,255,0.4);}.left-hand{left:20px;}.right-text{right:20px;font-weight:bold;}.bottom-mic{bottom:15px;font-size:18px;}.text-panel{width:280px;background:rgba(30,30,30,0.96);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:15px;box-sizing:border-box;color:#fff;}.panel-title{font-size:11px;font-weight:bold;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:4px;}.panel-sub{font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:15px;}.input-box{display:flex;background:rgba(20,20,20,0.5);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:4px 10px;align-items:center;}input{flex:1;background:transparent;border:none;color:#fff;font-family:system-ui;font-size:12px;outline:none;padding:8px 0;}.send-btn{color:#38bdf8;font-size:14px;cursor:pointer;margin-left:8px;font-weight:bold;}</style></head><body><div class="circle-menu"><div class="tool top-points">&#10247;</div><div class="tool left-hand">&#9995;</div><div class="tool right-text">TT</div><div class="center-node">${tagIA}</div><div class="tool bottom-mic">&#127908;</div></div><div class="text-panel"><div class="panel-title">CANAL DE TEXTO RESIDENTE</div><div class="panel-sub">[IA] Sistema en línea. Escribe una orden, Administrador...</div><div class="input-box"><input type="text" placeholder="Enviar directiva..."><div class="send-btn">&#10004;</div></div></div></body></html>`);
});

app.listen(7860, "0.0.0.0", () => {
  exec("start /b npx electron main.cjs");
});