
/**
 * @param V The type for the vertices of the edge.
 * @param E The type for weight of the edge.
 */
export class Edge<V, E> {
    private readonly target: V;
    private readonly weight: E;

    public constructor(target: V, weight: E) {
        this.target = target;
        this.weight = weight;
    }

    public getTarget(): V {
        return this.target;
    }

    public getWeight(): E {
        return this.weight;
    }
}


/**
 * @param V The type for the vertices of the graph.
 * @param E The type for the weight of the edges of the graph.
 */
export class Graph<V, E> {
    private readonly list: Map<V, Array<Edge<V, E>>>;
    private readonly reverseList: Map<V, Array<Edge<V, E>>>;

    public constructor() {
        this.list = new Map<V, Array<Edge<V, E>>>();
        this.reverseList = new Map<V, Array<Edge<V, E>>>();
    }

    private dfs(visited: Map<V, boolean>, v: V): void {
        if (visited.get(v))
            return;

        visited.set(v, true);
        this.list.get(v)?.forEach((e) => this.dfs(visited, e.getTarget()));
        this.reverseList.get(v)?.forEach((e) => this.dfs(visited, e.getTarget()));
    }

    public createNode(value: V): void {
        if (this.list.has(value))
            throw new Error("Graph already has value: " + value);

        this.list.set(value, []);
        this.reverseList.set(value, []);
    }

    public createEdge(source: V, target: V, weight: E): void {
        if (!this.list.has(source))
            throw new Error("Graph doesn't have node of value: " + source);
        if (!this.list.has(target))
            throw new Error("Graph doesn't have node of value: " + target);

        this.list.get(source)!.push(new Edge<V, E>(target, weight));
        this.reverseList.get(target)!.push(new Edge<V, E>(source, weight));
    }

    public isConnected(): boolean {
        if (this.list.size <= 1)
            return true;

        const v = this.list.keys().next().value;

        const visited = new Map<V, boolean>();
        this.dfs(visited, v);

        return (visited.size === this.size());
    }

    public getSources(): V[] {
        return this.getNodes().filter((n) => this.reverseList.get(n)?.length === 0);
    }

    public getSinks(): V[] {
        return this.getNodes().filter((n) => this.list.get(n)?.length === 0);
    }

    public getEndNodes(): V[] {
        // Get nodes that are sources/sinks
        return [...this.getSources(), ...this.getSinks()];
    }

    public size(): number {
        return this.list.size;
    }

    public getDegree(node: V): number {
        if (!this.list.has(node))
            throw new Error("getDegree() failed: node not found");
        return this.list.get(node)!.length + this.reverseList.get(node)!.length;
    }

    public getConnections(value: V): Array<Edge<V, E>> {
        if (!this.list.has(value))
            throw new Error("getConnections() failed: value not found");
        return this.list.get(value)!;
    }

    public getNodes(): V[] {
        const nodes = [];
        for (const val of this.list.keys())
            nodes.push(val);
        return nodes;
    }

    // TODO: This is kind of a hacky way to sort of organize a circuit, it is only used for the funcitons
    //  core/utils/ComponentOrganizers.ts which are only used when placing a circuit generated by the ExpressionParser.
    // Once a better placement algorithm is done, this should be removed or otherwise cleaned up
    private getNodeDepths(max: boolean): V[][] {
        // Still internally using a map then converting to a list afterwards since it could
        //  take a long time to see if the node has already been assigned a depth when max=true
        const nodeToNumber = new Map<V, number>();

        let currentLayer = this.getSources();
        let nextLayer: V[] = [];
        let deepest = 0;

        currentLayer.forEach((node) => nodeToNumber.set(node, 0));

        // Performs a bfs search to find the depth of each node
        // If max is true then the depth is the furthest depth (and thus largest number)
        //  that the node can be found at
        while (currentLayer.length > 0) {
            for (const node of currentLayer) {
                const nextDepth = nodeToNumber.get(node)! + 1;
                for (const next of this.list.get(node)!)  {
                    if (!nodeToNumber.has(next.getTarget()) || max) {
                        deepest = Math.max(deepest, nextDepth);
                        nodeToNumber.set(next.getTarget(), nextDepth);
                        nextLayer.push(next.getTarget());
                    }
                }
            }
            currentLayer = nextLayer;
            nextLayer = [];
        }

        // Convert to an array of arrays where each index indicates the depth of that node
        const ret: V[][] = Array.from({ length: deepest+1 }, (_) => new Array(0));

        [...nodeToNumber.entries()].forEach(([node, depth]) =>
            ret[depth].push(node)
        );

        return ret;
    }

    /**
     * Used to get the max "depth" of each node where the source nodes have a depth of 0
     *  and each additional layer adds +1 to the depth. If a node has parents at multiple
     *  depths such as 1 and 3, then it inherits from the "deeper" one, so the node would
     *  have a depth of 4. This should only be called if the isConnected() is true and the
     *  graph is acyclic.
     *
     * @returns A map where each key is each node and the value is the max depth of that node.
     */
    public getMaxNodeDepths(): V[][] {
        return this.getNodeDepths(true);
    }

    /**
     * Used to get the min "depth" of each node where the source nodes have a depth of 0
     *  and each additional layer adds +1 to the depth. If a node has parents at multiple
     *  depths such as 1 and 3, then it inherits from the "shallower" one, so the node would
     *  have a depth of 2. This should only be called if the isConnected() is true and the
     *  graph is acyclic.
     *
     * @returns A map where each key is each node and the value is the max depth of that node.
     */
    public getMinNodeDepths(): V[][] {
        return this.getNodeDepths(false);
    }

}