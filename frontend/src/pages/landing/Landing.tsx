import './Landing.css'
import { Button } from "@/components/ui/button"


const Landing = () => {
    
  return (
    <div className="landing flex flex-col h-screen">
        <div>
        <h1 className="jacques-francois text-milk">Connect your stars</h1>
        <h1 className="jacques-francois text-milk">Reveal a galaxy</h1>    
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
            <Button variant="default">Login</Button>
            <Button variant="outline">Register</Button>
        </div>

    </div>
  )
}

export default Landing