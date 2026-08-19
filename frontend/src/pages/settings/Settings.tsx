import Sidebar from "@/components/Sidebar/Sidebar"

const Settings = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 gap-8">
        <h1 className="text-3xl font-bold text-milk">Settings</h1>
      </div>
    </div>
  )
}

export default Settings
