import { CheckCircle, ScanEye, Target, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
   
      <div className="w-full flex flex-col  flex-wrap justify-center items-center mt-30">
        <div className="flex flex-col gap-16 items-center justify-center">
          <div className="flex flex-col gap-5 justify-center items-center">
            <p className="text-3xl lg:text-5xl font-bold text-center">
              Stay Focused,{" "}
              <span className="text-destructive">Get Things Done</span>
            </p>
            <p className="text-sm lg:text-lg w-2/3 text-center">
              FocusBoard is a clean, minimal task manager that helps you
              organize your work, track progress, and achieve your goals with
              clarity and focus.
            </p>
          </div>
          <div className="flex gap-5">
            <Button variant="default">
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <Button variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <div className="flex flex-col gap-2 justify-center items-center w-72">
              <div className="bg-secondary p-3 rounded-md">
                <CheckCircle />
              </div>
              <p className="font-semibold">Simple Task Management</p>
              <p className=" text-center text-sm">
                Create, organize, and track your tasks with an intuitive
                interface designed for productivity.
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center w-72">
              <div className="bg-secondary p-3 rounded-md">
                <Target />
              </div>
              <p className="font-semibold">Simple Task Management</p>
              <p className="text-center text-sm">
                Create, organize, and track your tasks with an intuitive
                interface designed for productivity.
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center w-72">
              <div className="bg-secondary p-3 rounded-md">
                <Zap />
              </div>
              <p className="font-semibold">Simple Task Management</p>
              <p className=" text-center text-sm">
                Create, organize, and track your tasks with an intuitive
                interface designed for productivity.
              </p>
            </div>
          </div>
        </div>
     
     
    </div>
  );
}
