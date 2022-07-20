import _ from 'lodash';

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

    private readonly astTree: ASTTree
    private readonly exportFileName: string
    private readonly scheduleData: { [symbol: string]: any }[]

    constructor(exportFileName: string, scheduleData: { [symbol: string]: any }[]) {
        this.exportFileName = exportFileName
        this.scheduleData = scheduleData
        this.astTree = Parser.createASTTree(this.exportFileName, [])
    }

    public parse(): ASTTree {
        const rootNodes = this.extractScheduleRootNode(this.scheduleData);
        this.astTree.scheduleNodes = [...this.astTree.scheduleNodes, ...rootNodes]
        return this.astTree
    }

    private extractScheduleRootNode(schedule: { [symbol: string]: { [symbol: string]: any } }[]): ScheduleRootNode[] {
        const rootNodes: ScheduleRootNode[] = []
        for (const scheduleElement of schedule) {
            for (const exportTypeName in scheduleElement) {
                const nodes = this.extractNode(scheduleElement[exportTypeName])
                const rootNodeType = _.isArray(scheduleElement[exportTypeName]) ? "array" : "object"

                const node = Parser.createScheduleRootNode(exportTypeName, rootNodeType, nodes)
                rootNodes.push(node)
            }
        }

        return rootNodes
    }

    private extractNode(data: any) {
        const nodes: ScheduleNode[] = []
        if (_.isArray(data)) {
            const node = {
                nodeName: "",
                nodeType: "array",
                child: this.extractNode(data[0])
            }
            nodes.push(node)
            return nodes;
        }
        for (const key in data) {
            let node: ScheduleNode
            const isArray = _.isArray(data[key]);

            if (typeof data[key] === 'object' && data[key]) {
                const rootNode = Parser.createScheduleRootNode(_.upperFirst(key),
                    isArray ? 'array' : 'object',
                    this.extractNode(data[key]))
                this.astTree.scheduleNodes = [rootNode, ...this.astTree.scheduleNodes]
                node = Parser.createScheduleNode(key, _.upperFirst(key), [])
            } else {
                let nodeType = data[key] === null ? "null" : typeof data[key]
                node = Parser.createScheduleNode(key, nodeType, [])
            }

            nodes.push(node)
        }
        return nodes;
    }

    private static createASTTree(exportFileName: string, rootNodes: ScheduleRootNode[]): ASTTree {
        return {
            exportFileName,
            scheduleNodes: rootNodes,
        }
    }

    private static createScheduleRootNode(exportTypeName: string, rootNodeType: string, nodes: ScheduleNode[]): ScheduleRootNode {
        return {
            exportTypeName,
            rootNodeType,
            nodes
        }
    }

    private static createScheduleNode(nodeName: string, nodeType: string, child: ScheduleNode[]): ScheduleNode {
        return {
            nodeName,
            nodeType,
            child,
        }
    }
}
