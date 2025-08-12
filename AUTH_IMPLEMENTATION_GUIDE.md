# Authentication Implementation Guide

## Overview
This guide covers implementing authentication in Next.js with Supabase using Server-Side Auth pattern.

---

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Step 2: Set Up Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Step 3: Create Supabase Client Files

### 3.1 Server Client (`utils/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### 3.2 Client Client (`utils/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3.3 Middleware Client (`utils/supabase/middleware.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only redirect for protected routes
  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/dashboard') ||
     request.nextUrl.pathname.startsWith('/tasks'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

---

## Step 4: Set Up Middleware

Create `middleware.ts` in your project root:

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## Step 5: Create Authentication Actions

### 5.1 Login Actions (`app/auth/login/actions.ts`)
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
```

### 5.2 Register Actions (`app/auth/register/actions.ts`)
```typescript
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
```

---

## Step 6: Create Authentication Pages

### 6.1 Login Page (`app/auth/login/page.tsx`)
```tsx
'use client'
import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoveLeft } from "lucide-react"
import Link from "next/link"

const page = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  
  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full mt-30">
      <Link href='/' className="flex gap-2 text-sm justify-center items-center ">
        <MoveLeft size={15} />
        <p>Back to Home</p>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
            <Button variant="link">
              <Link href='/auth/register'>Sign Up</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form action={login}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name='email'
                  type="email"
                  placeholder="Enter your Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" placeholder="Enter your Password" required />
              </div>
            </div>
            <CardFooter className="flex-col gap-2 px-0 pt-6">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default page
```

### 6.2 Register Page (`app/auth/register/page.tsx`)
```tsx
'use client'
import { Button } from "@/components/ui/button"
import { signup } from './actions'
import { useSearchParams } from 'next/navigation'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoveLeft } from "lucide-react"
import Link from "next/link"

const page = () => {
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
            <Button variant="link"> 
              <Link href='/auth/login'>Login</Link>
            </Button>
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
                <Input id="password" type="password" name="password" required placeholder="Create a Password"/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                </div>
                <Input id="confirm_password" type="password" name="confirm_password" required placeholder="Confirm your Password"/>
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
```

---

## Step 7: Create Auth Context (Optional but Recommended)

### 7.1 Auth Context (`lib/auth-context.tsx`)
```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 7.2 Update Root Layout
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Step 8: Create Protected Components

### 8.1 Navbar with Auth (`components/ui/Navbar.tsx`)
```tsx
'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from './button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_OUT') {
          router.push('/auth/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <div className="flex justify-center gap-5 md:justify-between md:gap-0 items-center flex-wrap">
      <div className="flex items-center justify-center gap-2">
        <p className="text-2xl font-bold">
          Your App
        </p>
      </div>
      {!loading && user 
        ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 text-sm justify-center items-center">
                <Avatar>
                  <AvatarImage
                    src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"}
                    alt={user.user_metadata?.full_name || user.email}
                  />
                  <AvatarFallback>
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                <ChevronDown size={22} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
        : !loading && (
          <div className="flex gap-5">
            <Button variant="outline">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="default">
              <Link href="/auth/register">Signup</Link>
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default Navbar
```

### 8.2 Protected Page Example (`app/dashboard/page.tsx`)
```tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p>Welcome back, {user.user_metadata?.full_name || 'User'}</p>
        </div>
        {/* Your protected content here */}
      </main>
    </div>
  )
}
```

---

## Step 9: Database Setup (Supabase)

### 9.1 Create Tables
```sql
-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 9.2 Create Functions
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Step 10: Testing Checklist

- [ ] Home page accessible without login
- [ ] Login page shows error messages
- [ ] Register page validates passwords match
- [ ] Successful login redirects to dashboard
- [ ] Successful register shows confirmation message
- [ ] Navbar shows login/signup when not authenticated
- [ ] Navbar shows user info when authenticated
- [ ] Logout redirects to login page
- [ ] Protected pages redirect to login if not authenticated
- [ ] Dashboard shows user information correctly

---

## Common Issues & Solutions

### Issue: "data is not defined" in dashboard
**Solution:** Use `user` variable instead of `data.user`
```tsx
// Wrong
<p>Hello {data.user.email}</p>

// Correct
<p>Hello {user.email}</p>
```

### Issue: Form not submitting
**Solution:** Ensure submit button is inside form element
```tsx
<form action={login}>
  {/* form fields */}
  <Button type="submit">Login</Button>
</form>
```

### Issue: Middleware not working
**Solution:** Check matcher pattern and ensure middleware file is in root
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Issue: Auth state not updating
**Solution:** Ensure proper cleanup in useEffect
```tsx
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
  return () => subscription.unsubscribe()
}, [])
```

---

## File Structure Summary

```
your-project/
├── .env.local
├── middleware.ts
├── utils/
│   └── supabase/
│       ├── server.ts
│       ├── client.ts
│       └── middleware.ts
├── lib/
│   └── auth-context.tsx
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── auth/
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   └── register/
│   │       ├── page.tsx
│   │       └── actions.ts
│   └── dashboard/
│       └── page.tsx
└── components/
    └── ui/
        └── Navbar.tsx
```

---

## Quick Reference Commands

```bash
# Install dependencies
npm install @supabase/supabase-js @supabase/ssr

# Run development server
npm run dev

# Build for production
npm run build
```

This guide covers everything you need to implement authentication in your Next.js project with Supabase. Save this file and refer to it whenever you need to implement auth in future projects!
