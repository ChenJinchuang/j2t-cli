import _ from 'lodash';
import { Schedule } from "./index";

export type ScheduleNode = {
    nodeName: string,
    nodeType: string,
    child: ScheduleNode[],
}
export type ScheduleRootNode = {
    exportTypeName: string,
    rootNodeType: string,
    nodes: ScheduleNode[]
}

export type ASTTree = {
    exportFileName: string,
    scheduleNodes: ScheduleRootNode[]
}

export class Parser {

    public static parse(schedule: Schedule): ASTTree[] {
        const astTrees: ASTTree[] = []
        for (const exportFileName in schedule) {
            const tree: ASTTree = {
                exportFileName: exportFileName,
                scheduleNodes: Parser.extractScheduleNode(schedule[exportFileName]),
            }
            astTrees.push(tree)
        }
        return astTrees
    }

    private static extractScheduleNode(schedule: { [symbol: string]: { [symbol: string]: any } }[]): ScheduleRootNode[] {
        const rootNodes: ScheduleRootNode[] = []
        for (const scheduleElement of schedule) {
            for (const exportTypeName in scheduleElement) {
                const nodes = Parser.extractNode(scheduleElement[exportTypeName])
                const node: ScheduleRootNode = {
                    exportTypeName: exportTypeName,
                    rootNodeType: _.isArray(scheduleElement[exportTypeName]) ? "array" : "object",
                    nodes
                }
                rootNodes.push(node)
            }
        }

        return rootNodes
    }

    private static extractNode(data: any) {
        const nodes: ScheduleNode[] = []
        if (_.isArray(data)) {
            const node = {
                nodeName: "",
                nodeType: "array",
                child: Parser.extractNode(data[0])
            }
            nodes.push(node)
            return nodes;
        }

        for (const key in data) {
            const isArray = _.isArray(data[key]);
            let node: ScheduleNode
            if (isArray) {
                node = {
                    nodeName: key,
                    nodeType: "array",
                    child: typeof data[key][0] === "object"
                        ? Parser.extractNode(data[key][0])
                        : [{ nodeName: "", nodeType: "string", child: [] }]
                }
            } else {
                let nodeType = ""
                nodeType = data[key] === null ? "null" : typeof data[key]
                node = {
                    nodeName: key,
                    nodeType: nodeType === "object" ? isArray ? "array" : "object" : nodeType,
                    child: []
                }
                node.child = typeof data[key] === "object" ? Parser.extractNode(data[key]) : []
            }
            nodes.push(node)

        }

        return nodes;
    }

}
