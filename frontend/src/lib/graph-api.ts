import { apiFetch } from "./api"

export type GraphNode = {
  id: number
  title: string
}

/**
 * react-force-graph mutates the graph it is given: d3-force swaps these ids for
 * references to the node objects themselves once the simulation starts. Anything
 * reading a link after the first render has to expect either shape.
 */
export type GraphLink = {
  source: number | GraphNode
  target: number | GraphNode
}

export type GraphData = {
  nodes: GraphNode[]
  links: GraphLink[]
}

export function getGraph(): Promise<GraphData> {
  return apiFetch<GraphData>("/api/graph")
}
