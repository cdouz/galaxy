import Sidebar from "@/components/Sidebar/Sidebar"

const Graph = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8">
        <h1 className="text-3xl font-bold text-milk mb-6">My Galaxy</h1>
        <p className="text-muted-foreground">Coming soon.</p>
      </div>
    </div>
  )
}

export default Graph
