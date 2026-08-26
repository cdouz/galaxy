import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ForceGraph2D, { type ForceGraphMethods, type NodeObject } from "react-force-graph-2d"
import Sidebar from "@/components/Sidebar/Sidebar"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api"
import { getGraph, type GraphData, type GraphLink, type GraphNode } from "@/lib/graph-api"

const NODE_RADIUS = 5
const LABEL_FONT_PX = 12
/** Gap in screen pixels between the bottom of the dot and the top of its label. */
const LABEL_GAP_PX = 5
/** Clicking is a little forgiving: the hit area is slightly wider than the dot. */
const POINTER_AREA_PADDING = 3

type Palette = {
  node: string
  label: string
  link: string
}

/**
 * The canvas inherits nothing from the stylesheet, so every colour it draws has
 * to be read off the theme and handed over as a plain string.
 */
function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => styles.getPropertyValue(name).trim()
  return {
    // --milk holds a hex value; the shadcn tokens are bare hsl triplets.
    node: token("--milk"),
    label: `hsl(${token("--foreground")})`,
    link: `hsl(${token("--muted-foreground")})`,
  }
}

const Graph = () => {
  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink> | undefined>(undefined)
  const hasFittedToView = useRef(false)

  const [data, setData] = useState<GraphData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    getGraph()
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load your galaxy"))
      .finally(() => setIsLoading(false))
  }, [])

  // Without explicit dimensions the canvas sizes itself to the whole window and
  // spills under the sidebar, so it is measured rather than told.
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width: Math.floor(width), height: Math.floor(height) })
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Read on render rather than cached: it costs three property lookups, and it
  // means a theme switch repaints in the right colours without this component
  // having to watch for one. Reading it at mount would be too early anyway —
  // ThemeProvider sets data-theme from an effect, and a child's effects run
  // before its parent's, so the tokens are not on the document yet.
  const palette = data ? readPalette() : null

  const drawNode = (
    node: NodeObject<GraphNode>,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
  ) => {
    if (!palette) {
      return
    }
    const { x = 0, y = 0 } = node

    ctx.beginPath()
    ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI)
    ctx.fillStyle = palette.node
    ctx.fill()

    // Dividing by the zoom keeps the label the same size on screen at every zoom
    // level, instead of letting it grow into a wall of overlapping text.
    ctx.font = `${LABEL_FONT_PX / globalScale}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillStyle = palette.label
    // The dot is drawn in graph units, so it grows with the zoom while the label
    // does not. Anchoring the label to the dot's edge -- NODE_RADIUS in graph
    // units -- and adding a gap that shrinks with the zoom leaves the same clear
    // few pixels under the star whatever the zoom level.
    ctx.fillText(node.title, x, y + NODE_RADIUS + LABEL_GAP_PX / globalScale)
  }

  // Custom-drawn nodes get no hit area for free; this one matches the dot, so a
  // click lands on the star rather than anywhere near its label.
  const paintNodePointerArea = (
    node: NodeObject<GraphNode>,
    color: string,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.beginPath()
    ctx.arc(node.x ?? 0, node.y ?? 0, NODE_RADIUS + POINTER_AREA_PADDING, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }

  // Fires every time the simulation settles, including after a drag; framing the
  // graph is only wanted on the first one.
  const fitToView = () => {
    if (!hasFittedToView.current) {
      hasFittedToView.current = true
      graphRef.current?.zoomToFit(400, 60)
    }
  }

  const isEmpty = data !== null && data.nodes.length === 0
  const canRenderGraph = data !== null && palette !== null && !isEmpty && size.width > 0

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 min-h-0">
        <h1 className="text-3xl font-bold text-milk mb-6">My Galaxy</h1>

        <div ref={containerRef} className="relative flex-1 min-h-0 overflow-hidden rounded-lg">
          {isLoading && <p className="text-muted-foreground">Loading your galaxy...</p>}
          {error && <p className="text-destructive">{error}</p>}

          {isEmpty && (
            <div className="flex flex-col items-start gap-4">
              <p className="text-muted-foreground">
                No notes yet. Your galaxy fills up as you write notes and link them together with
                [[wikilinks]].
              </p>
              <Button asChild>
                <Link to="/note/new">New note</Link>
              </Button>
            </div>
          )}

          {canRenderGraph && (
            <ForceGraph2D<GraphNode, GraphLink>
              ref={graphRef}
              // Passed straight through and never rebuilt: the renderer mutates
              // this object in place, and handing it a new one restarts the
              // simulation and throws away every position on screen.
              graphData={data}
              width={size.width}
              height={size.height}
              nodeRelSize={NODE_RADIUS}
              nodeCanvasObject={drawNode}
              nodePointerAreaPaint={paintNodePointerArea}
              nodeLabel="title"
              linkColor={() => palette.link}
              linkWidth={1}
              onNodeClick={(node) => navigate(`/note/${node.id}/view`)}
              onEngineStop={fitToView}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Graph
