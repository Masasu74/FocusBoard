'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (password !== confirmPassword) {
    redirect('/auth/register?error=' + encodeURIComponent('Passwords do not match'))
  }

  const data = {
    email: formData.get('email') as string,
    password: password,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/auth/register?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login?message=Check your email to confirm your account')
}