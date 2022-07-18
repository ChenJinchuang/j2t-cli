// noinspection RequiredAttributes

import colors from "colors/safe"
import { Command } from "commander";
import fs from "fs";
import path from "path";
import JSONToType from "./index";

const program = new Command();

program.name("JSON-to-Type")
    .description("根据 json 内容生成 d.ts 文件")
    .version("0.1.0")

program
    .option('-p, --path <path>', '指定 schedule 文件路径，默认是当前运行的目录', process.cwd())
    .option('-n, --name <name>', '指定 schedule 的文件名，默认是schedule.json', 'schedule.json')
    .option('-o, --output <output>', '指定 d.ts 文件的导出路径，默认是当前运行的目录下 typings 目录', path.join(process.cwd(), "typings"))
program.showHelpAfterError('(add --help for additional information)');

const optionMap = {
    path: 'path',
    name: 'name',
    output: 'output',
}
program.parse(process.argv)
const opts = program.opts();

const scheduleFilePath = path.join(opts[optionMap.path], opts[optionMap.name])
const exists = fs.existsSync(scheduleFilePath);
if (!exists) {
    program.error(colors.red(`\nError: 当前目录:${ opts[optionMap.path] } 下找不到 ${ opts[optionMap.name] } 文件\r`))
}

try {
    new JSONToType().rename(opts[optionMap.name])
        .path(opts[optionMap.path])
        .output(opts[optionMap.output])
        .run()

    console.log(colors.green(`\n √ Success! d.ts created in: ${ opts[optionMap.output] }`))
} catch (e) {
    program.error(colors.red(`${ (e as Error).toString() }\r`))
}
