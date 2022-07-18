import fs from "fs";
import _ from "lodash";
import path from "path";
import Generator from "./Generator";
import { ASTTree, Parser, ScheduleRootNode } from "./parser";
import Transform from "./transform";

export type Schedule = { [symbol: string]: { [symbol: string]: any } [] }

class JSONToType {
    private data!: Schedule
    private scheduleFileName: string = "schedule.json"
    private scheduleFilePath: string = process.cwd()
    private _output: string = path.join(process.cwd(), 'typings')

    public run(): void {
        this.loadSchedule()
        this.preValidate()
        const parsedData = this.parser()
        parsedData.forEach((item) => {
            const transformedData = this.transformer(item.scheduleNodes)
            this.generator(item.exportFileName, transformedData, this._output)
        })
    }

    /**
     * 自定义 schedule 内容，在run()之前调用；
     * 不调用的话默认读取项目根目录下 schedule.json 里的内容
     * @param schedule
     */
    public schedule(schedule: Schedule): this {
        if (!schedule) {
            throw Error("待解析 json 数据不能为空")
        }
        if (!_.isObject(schedule)) {
            throw Error("待解析 json 数据不是一个对象")
        }
        if (!Object.keys(schedule).length) {
            throw Error("待解析 json 数据不能为空")
        }
        this.data = schedule
        return this
    }

    /**
     * 指定 d.ts 文件输出路径
     * @param output 输出的绝对路径
     */
    public output(output: string): this {
        if (output) {
            this._output = output
        }
        return this
    }

    /**
     * 指定 schedule.json 文件的读取路径
     * @param path 文件的绝对路径
     */
    public path(path: string): this {
        if (path) {
            this.scheduleFilePath = path
        }
        return this
    }

    /**
     * 指定读取schedule时的文件名
     * @param name
     */
    public rename(name: string): this {
        if (name) {
            this.scheduleFileName = name
        }
        return this
    }

    protected loadSchedule(): void {
        if (!this.data) {
            const scheduleFilePath = path.join(this.scheduleFilePath, this.scheduleFileName)
            const exists = fs.existsSync(scheduleFilePath);
            if (!exists) {
                throw Error(`Error: 当前目录:${ this.scheduleFilePath } 下找不到 ${ this.scheduleFileName } 文件\r`)
            }
            this.data = require(path.join(this.scheduleFilePath, this.scheduleFileName))
        }
    }

    protected preValidate(): void {
        if (!this.data) {
            throw Error("待解析 json 数据不能为空")
        }

        if (!Object.keys(this.data).length) {
            throw Error("待解析 json 数据不能为空")
        }

        for (const key in this.data) {
            if (!_.isObject(this.data[key])) {
                throw Error("待解析 json 数据不是一个对象")
            }
        }
    }

    protected parser(): ASTTree[] {
        return Parser.parse(this.data)
    }

    protected transformer(parsedData: ScheduleRootNode[]): { code: string }[] {
        return Transform.transform(parsedData)
    }

    protected generator(exportFileName: string, transformedData: { code: string }[], output: string): void {
        Generator.generate(exportFileName, transformedData, output)
    }
}

export default JSONToType
