'use client';

import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTaskAction, deleteTaskAction } from "@/app/tasks/actions";
import { Task } from "@/lib/types";
import EditTaskDialog from "./EditTaskDialog";

interface TaskActionsProps {
  task: Task;
}

export default function TaskActions({ task }: TaskActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const router = useRouter();

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
      const formData = new FormData();
      formData.append('title', task.title);
      formData.append('description', task.description || '');
      formData.append('status', newStatus);
      if (task.due_date) {
        formData.append('dueDate', task.due_date);
      }

      const result = await updateTaskAction(task.id, formData);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to update task');
      }
    } catch (error) {
      alert('An error occurred while updating the task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteTaskAction(task.id);
      if (result.success) {
        router.push('/dashboard');
      } else {
        alert(result.error || 'Failed to delete task');
      }
    } catch (error) {
      alert('An error occurred while deleting the task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 flex-wrap">
        <Button 
          variant='outline' 
          className="flex gap-1"
          onClick={() => setShowEditDialog(true)}
        >
          <SquarePen />
          <p>Edit</p>
        </Button>
        <Button 
          variant='outline' 
          className="flex gap-1 text-destructive"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash />
          Delete
        </Button>
      </div>

      <Button 
        onClick={handleStatusToggle} 
        className="w-full border-[0.5px] border-primary py-1 px-2 rounded-lg font-medium hover:cursor-pointer"
        disabled={loading}
      >
        Mark as {task.status === 'completed' ? 'In Progress' : 'Completed'}
      </Button>

      {showEditDialog && (
        <EditTaskDialog 
          task={task} 
          onClose={() => setShowEditDialog(false)}
          onSuccess={() => {
            setShowEditDialog(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}