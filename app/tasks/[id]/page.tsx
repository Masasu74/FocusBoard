import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoveLeft, SquarePen, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getTaskById } from '@/lib/task-service';
import TaskActions from './TaskActions';

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  let task;
  try {
    task = await getTaskById(params.id);
  } catch (error) {
    console.error('Error fetching task:', error);
    redirect('/dashboard');
  }

  if (!task) {
    redirect('/dashboard');
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-200 text-green-600';
      case 'in_progress':
        return 'bg-blue-200 text-blue-600';
      default:
        return 'bg-orange-200 text-orange-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="flex items-center justify-center mt-30 flex-col gap-5">
      <Link href='/dashboard' className="flex gap-2 text-sm justify-center items-center ">
        <MoveLeft size={15} />
        <p>Back to Dashboard</p>
      </Link>
      <div className="flex items-center  flex-col border-primary border-1 w-10/12 lg:w-7/12 rounded-lg p-5 gap-8">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-2 flex-wrap">
            <div className="flex justify-start gap-3 items-center flex-wrap">
              <p className="font-medium text-2xl">{task.title}</p>
              <p className={`rounded-4xl p-1 text-[10px] font-semibold ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </p>
            </div>
            <div className="flex gap-2 text-sm font-light flex-wrap">
              <div className="flex gap-2 items-center justify-center flex-wrap">
                <Calendar size={12} />
                <p>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
              </div>
              <div className="flex gap-2 justify-center items-center flex-wrap">
                <Clock size={12} />
                <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        
        </div>
        <div className="flex flex-col justify-start items-start w-full gap-5">
          <p className="font-medium text-lg">Description</p>
          <p className="bg-secondary p-5 rounded-xl w-full">
            {task.description || 'No description provided'}
          </p>
        </div>
        <div className="flex justify-between w-full gap-8">
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-medium text-lg">Task Details</p>
            <div className="flex justify-between items-center flex-wrap">
              <p className="text-gray-700">Status:</p>
              <p className={`rounded-4xl p-1 text-[10px] font-semibold ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </p>
            </div>
            <div className="flex justify-between items-center flex-wrap">
              <p className="text-gray-700">Due Date:</p>
              <p>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
            </div>
            <div className="flex justify-between items-center flex-wrap">
              <p className="text-gray-700">Created:</p>
              <p>{new Date(task.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-col gap-5 w-1/2">
            <p className="font-medium text-lg">Quick Actions</p>
            <TaskActions task={task} />
          </div>
        </div>
      </div>
    </div>
  );
}