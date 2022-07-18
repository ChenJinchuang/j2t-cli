import _ from "lodash";
import { ScheduleNode, ScheduleRootNode } from "./parser";

class Transform {
    public static transform(parsedData: ScheduleRootNode[]): { code: string }[] {
        const transformed: { code: string }[] = []
        for (let i = 0; i < parsedData.length; i++) {
            const code = Transform.genCode(parsedData[i])
            const codegenDesc = {
                code
            }
            transformed.push(codegenDesc)
        }
        return transformed
    }

    private static genCode(rootNode: ScheduleRootNode): string {
        let code = ""
        code += this.genTypeDeclareHeader(rootNode.exportTypeName)
        for (const node of rootNode.nodes) {
            code += this.genTypeDeclareBody(node)
        }

        if (rootNode.rootNodeType === "object") {
            const reg = new RegExp("=", "g")
            code = code.replace(reg, "= {")
            code += ` }`
        }

        const reg = new RegExp(", }", "g")
        code = code.replace(reg, " }")

        return code
    }

    private static genTypeDeclareHeader(exportTypeName: string) {
        const typeName = Transform.genExportTypeName(exportTypeName)
        return `declare type ${ typeName } =`
    }

    private static genTypeDeclareBody(node: ScheduleNode): string {
        let body: string = ""
        switch (node.nodeType) {
            case "array":
                if (node.child.length === 0) {
                    body += node.nodeName === "" ? `unknown[]` : ` ${ node.nodeName }: unknown[],`
                    break
                }
                if (node.child[0].nodeName === "") {
                    body += ` ${ node.nodeName }: ${ node.child[0].nodeType }[],`
                    break
                }

                let arrayItemObject = ""
                for (const arrayItem of node.child) {
                    arrayItemObject += Transform.genTypeDeclareBody(arrayItem)
                }
                arrayItemObject = `{${ arrayItemObject }}`
                body += node.nodeName === "" ? ` ${ arrayItemObject }[]` : ` ${ node.nodeName }: ${ arrayItemObject }[],`
                break
            case "object":
                let itemObject = ""
                for (const item of node.child) {
                    itemObject += Transform.genTypeDeclareBody(item)
                }
                if (itemObject) {
                    itemObject = `${ node.nodeName }: { ${ itemObject } }`
                } else {
                    itemObject = `${ node.nodeName }: object`
                }
                body += ` ${ itemObject },`
                break
            case "null":
                body += ` ${ node.nodeName }?: unknown,`
                break
            default:
                body += ` ${ node.nodeName }: ${ node.nodeType },`
        }
        return body
    }

    private static genExportTypeName(name: string): string {
        return _.upperFirst(name);
    }

}

export default Transform
