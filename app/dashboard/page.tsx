import { BookmarkCheck, Calendar, CheckCircle, ChevronDown, Clock, Loader, ScanEye, Target, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AddTask from "@/components/ui/AddTask";

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex justify-between items-center flex-col w-full  md:gap-0 mt-20">
      <div className="w-full flex flex-col gap-10 flex-wrap">

        <div className=" flex flex-col  items-center justify-center">
          <div className="flex flex-col gap-10 ">
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold">Welcome back, {user.user_metadata?.full_name || 'User'}</p>
              <p>Hello {user.email}</p>
              <p>Here&apos;s what&apos;s on your focus board today</p>
            </div>
            <div className="flex w-full justify-between items-center gap-10 flex-wrap">
              <div className="flex w-50 bg-secondary justify-between items-center p-2 rounded-lg">
                <div className="flex flex-col">
                  <p className="font-medium"> Total Tasks</p>
                  <p className="font-bold text-2xl">3</p>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <BookmarkCheck />
                </div>
              </div>
              <div className="flex w-50 bg-secondary justify-between items-center p-2 rounded-lg">
                <div className="flex flex-col">
                  <p className="font-medium"> Pending</p>
                  <p className="font-bold text-2xl">3</p>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <Clock  className="text-yellow-500"/>
                </div>
              </div>
              <div className="flex w-50 bg-secondary justify-between items-center p-2 rounded-lg">
                <div className="flex flex-col">
                  <p className="font-medium"> In Progress</p>
                  <p className="font-bold text-2xl">3</p>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <Loader className="text-green-800" />
                </div>
              </div>
              <div className="flex w-50 bg-secondary justify-between items-center p-2 rounded-lg">
                <div className="flex flex-col">
                  <p className="font-medium"> Completed</p>
                  <p className="font-bold text-2xl">3</p>
                </div>
                <div className="bg-white p-3 rounded-md">
                 <CheckCircle className="text-green-500"/>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center flex-wrap">
                <p className="font-semibold">Your Tasks</p>
                <AddTask/>
              </div>
           <div className="flex gap-5 flex-wrap">
               <div className="w-90 p-3 rounded-sm bg-secondary flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Design focus</p>
                  <p className="text-[10px] text-blue-700 bg-blue-200 p-1 rounded-3xl">In Progress</p>
                </div>
                <p className="text-sm font-light">I&apos;ll implement client-side routing and mock data to demonstrate the full user flow.</p>
                <div className="flex gap-2 justify-start items-center">
                   <Calendar size={12}/> 
                   <p className="text-sm">Aug 15, 2025</p>
                   </div>
               
              </div>
                 <div className="w-90 p-3 rounded-sm bg-secondary flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Design focus</p>
                  <p className="text-[10px] text-blue-700 bg-blue-200 p-1 rounded-3xl">In Progress</p>
                </div>
                <p className="text-sm font-light">I&apos;ll implement client-side routing and mock data to demonstrate the full user flow.</p>
                <div className="flex gap-2 justify-start items-center">
                   <Calendar size={12}/> 
                   <p className="text-sm">Aug 15, 2025</p>
                   </div>
               
              </div>
                 <div className="w-90 p-3 rounded-sm bg-secondary flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Design focus</p>
                  <p className="text-[10px] text-blue-700 bg-blue-200 p-1 rounded-3xl">In Progress</p>
                </div>
                <p className="text-sm font-light">I&apos;ll implement client-side routing and mock data to demonstrate the full user flow.</p>
                <div className="flex gap-2 justify-start items-center">
                   <Calendar size={12}/> 
                   <p className="text-sm">Aug 15, 2025</p>
                   </div>
               
              </div>
           </div>
            </div>
          </div>
        </div>
      </div>
      {/* <p className="mt-20">
        © 2025 FocusBoard. Built for productivity and focus.
      </p> */}
    </div>
  );
};

