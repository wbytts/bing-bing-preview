"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prebundles = void 0;
exports.loadPlugins = loadPlugins;
const vite_1 = require("vite");
const plugin_vue_1 = __importDefault(require("@vitejs/plugin-vue"));
const plugin_vue_jsx_1 = __importDefault(require("@vitejs/plugin-vue-jsx"));
exports.prebundles = ["vue"];
function loadPlugins(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        return [
            {
                name: "index",
                configureServer: (server) => {
                    server.middlewares.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                        if (req.url !== "/")
                            return next();
                        const html = yield server.transformIndexHtml(req.url, 
                        /*html*/ `<!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8"/>
            </head>
            <body>
              <div id="app"></div>
              <script type="module">
                import { createApp } from 'vue'
                import App from '/@fs/${filepath}'
                const app = createApp(App)
                app.mount('#app')
              </script>
            </body>
            </html>`, req.originalUrl);
                        return (0, vite_1.send)(req, res, html, "html", {});
                    }));
                },
            },
            (0, plugin_vue_1.default)(),
            (0, plugin_vue_jsx_1.default)(),
        ];
    });
}
