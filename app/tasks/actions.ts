'use server';

import { createTask, updateTask, deleteTask } from '@/lib/task-service';
import { CreateTaskData, UpdateTaskData } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createTaskAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as 'pending' | 'in_progress' | 'completed';
    const dueDate = formData.get('dueDate') as string;

    if (!title) {
      throw new Error('Title is required');
    }

    const taskData: CreateTaskData = {
      title,
      description: description || undefined,
      status: status || 'pending',
      due_date: dueDate || undefined,
    };

    await createTask(taskData);
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create task' };
  }
}

export async function updateTaskAction(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as 'pending' | 'in_progress' | 'completed';
    const dueDate = formData.get('dueDate') as string;

    if (!title) {
      throw new Error('Title is required');
    }

    const taskData: UpdateTaskData = {
      title,
      description: description || undefined,
      status: status || 'pending',
      due_date: dueDate || undefined,
    };

    await updateTask(id, taskData);
    revalidatePath('/dashboard');
    revalidatePath(`/tasks/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update task' };
  }
}

export async function deleteTaskAction(id: string) {
  try {
    await deleteTask(id);
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete task' };
  }
}