import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoveLeft, ScanEye } from "lucide-react"
import Link from "next/link"

const page=()=> {
  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full mt-30">
     
          <Link href='/' className="flex gap-2 text-sm justify-center items-center ">
            <MoveLeft size={15}/>
            <p>Back to Home</p>
          </Link>
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Get Started with FocusBoard today
        </CardDescription>
        <CardAction>
          <Button variant="link"> <Link href='/auth/login'>Login</Link></Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
             <div className="grid gap-2">
              <Label htmlFor="email">Full Name</Label>
              <Input
                id="fname"
                type="text"
                placeholder="Enter your Full Name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

           
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              
              </div>
              <Input id="password" type="password" required  placeholder="Create a Password"/>
            </div>
             <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Confirm Password</Label>
              
              </div>
              <Input id="password" type="password" required  placeholder="Confirm your Password"/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Create Account
        </Button>
       
      </CardFooter>
    </Card>
    </div>
    
  )
}
export default page