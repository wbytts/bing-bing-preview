#!/usr/bin/env node
import { createServer } from 'vite'
import path from 'path'
import fs from 'fs'
import { cac } from 'cac'
import colors from 'picocolors'

const version = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json')).toString(),
).version

const modulePath = fs.existsSync(path.resolve(__dirname, '../node_modules/'))
    ? path.resolve(__dirname, '../node_modules/')
    : path.resolve(__dirname, '../../')

interface ServeOptions {
    host?: string
    port?: number
    type?: string
    preflight: boolean
}

function getTypeByExt(filepath: string) {
    const ext = path.extname(filepath)
    if (ext === '.vue') {
        return 'vue'
    }
    throw new Error('错啦，这是不识别的扩展名')
}

async function serve(filename: string, options: ServeOptions) {
    try {
        const filepath = path.resolve(filename).replaceAll("\\", "/")
        console.log(colors.cyan(`\n解析文件完整地址: ${filepath}`))
        const type = options.type || getTypeByExt(filepath)
        const module = await import(`./${type}.js`)
        const server = await createServer({
            root: modulePath,
            optimizeDeps: {
                include: module.prebundles,
            },
            server: {
                host: options.host,
                port: options.port,
                watch: {
                    ignored: ['/'],
                },
            },
            plugins: [
                await module.loadPlugins(filepath),
            ],
        })
        server.watcher.add(`${path.dirname(filepath)}/**`)

        await server.listen()

        console.log(
            colors.cyan(`\n  冰冰超级预览 v${version}`) +
            `   正在运行: ` +
            colors.green(filename) +
            ` at:\n`,
        )

        server.printUrls()
    } catch (e) {
        console.error(
            colors.red(`启动服务器出错啦 :\n${(e as Error).stack}`),
            { error: e },
        )
        process.exit(1)
    }
}

const cli = cac('bing-bing-preview')

cli
    .command('<path>', `开启一个本地服务展示你的组件`)
    .option('--host [host]', `[字符串类型] 指定地址`)
    .option('--port <port>', `[数字类型] 指定端口`)
    .option(
        '-t, --type <type>',
        `[string] 组件类型 (目前仅支持vue3单文件组件)`,
    )
    .action(serve)

cli.help()
cli.version(version)

cli.parse()
