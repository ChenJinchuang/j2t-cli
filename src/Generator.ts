import fs from "fs";
import path from "path";

class Generator {
    public static generate(exportFileName: string, data: { code: string }[], output: string) {
        const isExist = fs.existsSync(output)
        if (!isExist) {
            fs.mkdirSync(output, { recursive: true })
        }
        for (const item of data) {
            fs.writeFile(path.join(output, `${ exportFileName }.d.ts`),
                `${ item.code }\n\n`,
                { encoding: "utf8", flag: 'a' },
                (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
        }
    }
}

export default Generator
