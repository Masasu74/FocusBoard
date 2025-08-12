'use client'
import { Button } from "@/components/ui/button"
import { signup } from './actions'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
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
        {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
              {message}
            </div>
          )}
        <CardAction>
          <Button variant="link"> <Link href='/auth/login'>Login</Link></Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form action={signup}>
          <div className="flex flex-col gap-6">
             <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                name="full_name"
                placeholder="Enter your Full Name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>

           
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              
              </div>
              <Input id="password" type="password" name="password" required  placeholder="Create a Password"/>
            </div>
             <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirm_password">Confirm Password</Label>
              
              </div>
              <Input id="confirm_password" type="password" name="confirm_password"  required  placeholder="Confirm your Password"/>
            </div>
          </div>
          <CardFooter className="flex-col gap-2 px-0 pt-6">
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
    </div>
    
  )
}
export default page