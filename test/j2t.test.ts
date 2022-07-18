import fs from "fs";
import _ from "lodash";
import path from "path";
import JSONToType from "../src/index";

const inputPath = __dirname
const outputPath = path.join(__dirname, "typings")

const data = {
    "index": [
        {
            "demo1": {
                "id": 1,
                "name": "qinchen",
                "list": [
                    {
                        "id": 1,
                        "color": "red"
                    }
                ]
            }
        }
    ],
    "demo": [
        {
            "demo2": {
                "id": 1,
                "name": "qinchen",
                "list": [
                    {
                        "id": 1,
                        "color": "red"
                    }
                ]
            }
        }
    ]
}

test('Test generate', () => {
    new JSONToType().schedule(data).output(outputPath).run()

    for (const dataKey in data) {
        const fileName = `${ _.kebabCase(dataKey) }.d.ts`
        const exists = fs.existsSync(path.join(outputPath, fileName));
        expect(exists).toBe(true);
        fs.rmdir(path.join(outputPath, fileName), { recursive: true }, (err) => {
            if (err) {
                console.log(err)
            }
        });
    }
});

test('Test schedule not found', () => {
    expect(() => {
        new JSONToType()
            .output(outputPath)
            .run()
    }).toThrowError(Error);
});

test('Test input illegal schedule ', () => {
    expect(() => {
        new JSONToType()
            .schedule({})
            .output(outputPath)
            .run()
    }).toThrowError(Error);

    expect(() => {
        new JSONToType()
            // @ts-ignore
            .schedule({ a: "" })
            .output(outputPath)
            .run()
    }).toThrowError(Error);

    expect(() => {
        new JSONToType()
            // @ts-ignore
            .schedule(null)
            .path(inputPath)
            .output(outputPath)
            .run()
    }).toThrowError(Error);
});

test('Test rename schedule file ', () => {
    new JSONToType()
        .rename("test.json")
        .path(inputPath)
        .output(outputPath)
        .run()

    for (const dataKey in data) {
        const fileName = `${ _.kebabCase(dataKey) }.d.ts`
        const exists = fs.existsSync(path.join(outputPath, fileName));
        expect(exists).toBe(true);
    }
});
