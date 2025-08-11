import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoveLeft, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center justify-center mt-30 flex-col gap-5">
      <Link href='/dashboard' className="flex gap-2 text-sm justify-center items-center ">
            <MoveLeft size={15}/>
            <p>Back to Dashboard</p>
          </Link>
    <div className="flex items-center  flex-col border-primary border-1 w-10/12 lg:w-7/12 rounded-lg p-5 gap-8">
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2 flex-wrap">
          <div className="flex justify-start gap-3 items-center flex-wrap">
            <p className="font-medium text-2xl">Write documentation</p>
            <p className="bg-blue-200 rounded-4xl text-blue-600 p-1 text-[10px] font-semibold">Completed</p>
          </div>
          <div className="flex gap-2 text-sm font-light flex-wrap">
            <div className="flex gap-2 items-center justify-center flex-wrap">
              <Calendar size={12}/>
            <p>  Due: Tuesday, August 12, 2025</p>
            </div>
            <div className="flex gap-2 justify-center items-center flex-wrap">
              <Clock  size={12} />
             <p>Created: Saturday, August 9, 2025</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Button variant='outline'  className="flex gap-1"><SquarePen /><p>Edit</p></Button>
          <Button variant='outline' className="flex gap-1 text-destructive"><Trash />Delete</Button>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-full gap-5">
        <p className="font-medium text-lg">Description</p>
        <p className="bg-secondary p-5 rounded-xl w-full">Create comprehensive documentation for the application</p>
      </div>
      <div className="flex justify-between w-full gap-8">
        <div className="flex flex-col gap-2 w-1/2">
          <p className="font-medium text-lg">Task Details</p>
          <div className="flex justify-between items-center flex-wrap">
            <p className="text-gray-700">Status:</p>
                        <p className="bg-blue-200 rounded-4xl text-blue-600 p-1 text-[10px] font-semibold">Completed</p>

          </div>
          <div className="flex justify-between items-center flex-wrap">
            <p className="text-gray-700">Due Date:</p>
            <p>Tuesday, August 12, 2025
</p>
          </div>

          <div className="flex justify-between items-center flex-wrap">
            <p className="text-gray-700">Created:</p>
            <p>Saturday, August 9, 2025
</p>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-1/2">
 <p className="font-medium text-lg">Quick Actions</p>
        <p className="ww-full border-[0.5px] border-primary py-1 px-2 rounded-lg font-medium">Mark as Completed</p>
        </div>
       
      </div>
    </div>
      </div>
  );
};

export default page;
