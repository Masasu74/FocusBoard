import { BookmarkCheck, Calendar, CheckCircle, ChevronDown, Clock, Loader, ScanEye, Target, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AddTask from "@/components/ui/AddTask";
import TaskCard from "@/components/TaskCard";
import DashCard from "@/components/DashCard";
import { getTasks } from '@/lib/task-service';

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch tasks
  const tasks = await getTasks();
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

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

             <DashCard title='Total Tasks' value={totalTasks.toString()} />
              <DashCard title='Pending' value={pendingTasks.toString()} />
              <DashCard title='In Progress' value={inProgressTasks.toString()} />
              <DashCard title='Completed' value={completedTasks.toString()} />


            </div>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center flex-wrap">
                <p className="font-semibold">Your Tasks</p>
                <AddTask />
              </div>

              <div className="flex gap-5 flex-wrap">
              {tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks yet. Create your first task!</p>
                ) : (
                  tasks.map((task) => (
                    <TaskCard 
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      status={task.status}
                      description={task.description || ''}
                      date={task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    />
                  ))
                )}
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

