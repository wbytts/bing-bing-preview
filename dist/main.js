#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const vite_1 = require("vite");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cac_1 = require("cac");
const picocolors_1 = __importDefault(require("picocolors"));
const version = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../package.json")).toString()).version;
const modulePath = fs_1.default.existsSync(path_1.default.resolve(__dirname, "../node_modules/"))
    ? path_1.default.resolve(__dirname, "../node_modules/")
    : path_1.default.resolve(__dirname, "../../");
function serve(filename, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filepath = path_1.default.resolve(filename).replaceAll("\\", "/");
            console.log(picocolors_1.default.bgGreenBright(`\n解析文件完整地址: ${filepath}`));
            const type = options.type || "vue";
            const module = yield Promise.resolve(`${`./handlers/${type}.js`}`).then(s => __importStar(require(s)));
            const server = yield (0, vite_1.createServer)({
                root: modulePath,
                optimizeDeps: {
                    include: module.prebundles,
                },
                server: {
                    host: options.host,
                    port: options.port,
                    watch: {
                        ignored: ["/"],
                    },
                },
                plugins: [yield module.loadPlugins(filepath)],
            });
            server.watcher.add(`${path_1.default.dirname(filepath)}/**`);
            // 启动服务器
            yield server.listen();
            // 打印启动信息
            console.log(picocolors_1.default.cyan(`\n  冰冰超级预览 v${version}`) +
                `   正在运行: ` +
                picocolors_1.default.green(filename) +
                ` at:\n`);
            // 打印访问地址
            server.printUrls();
        }
        catch (e) {
            console.error(picocolors_1.default.red(`启动服务器出错啦 :\n${e.stack}`), {
                error: e,
            });
            process.exit(1);
        }
    });
}
// CLI 部分
const cli = (0, cac_1.cac)("bing-bing-preview");
cli
    .command("<path>", `开启一个本地服务展示你的组件`)
    .option("--host [host]", `[字符串类型] 指定地址`)
    .option("--port <port>", `[数字类型] 指定端口`)
    .option("-t, --type <type>", `[字符串类型] 组件类型 (目前仅支持vue3单文件组件)`)
    .action(serve);
cli.help();
cli.version(version);
cli.parse();
