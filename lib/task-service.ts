import { createClient } from '@/utils/supabase/server';
import { Task, CreateTaskData, UpdateTaskData } from './types';

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }

  return data || [];
}

export async function getTaskById(id: string): Promise<Task | null> {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    // Log the error details for debugging
    console.error('Error fetching task:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    
    // If the task doesn't exist (not found error), return null
    if (error.code === 'PGRST116') {
      return null;
    }
    
    // For other errors, throw to be handled by the caller
    throw new Error(`Failed to fetch task: ${error.message}`);
  }

  return data;
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...taskData,
      user_id: user.id,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }

  return data;
}

export async function updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...taskData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }

  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}