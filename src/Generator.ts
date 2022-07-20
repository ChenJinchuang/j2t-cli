import fs from "fs";
import path from "path";

class Generator {
    public static generate(exportFileName: string, data: { code: string }[], output: string) {
        const isExist = fs.existsSync(output)
        if (!isExist) {
            fs.mkdirSync(output, { recursive: true })
        }
        for (const item of data) {
            fs.writeFileSync(path.join(output, `${ exportFileName }.d.ts`),
                `${ item.code }\n\n`,
                { encoding: "utf8", flag: 'a' })
        }
    }
}

export default Generator
