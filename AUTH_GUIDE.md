# Authentication Implementation Guide

## Quick Setup Steps

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Supabase Clients

**utils/supabase/server.ts**
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
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**utils/supabase/client.ts**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 4. Middleware Setup

**middleware.ts** (root)
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

**utils/supabase/middleware.ts**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/tasks'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

### 5. Authentication Actions

**app/auth/login/actions.ts**
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

**app/auth/register/actions.ts**
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

### 6. Authentication Pages

**app/auth/login/page.tsx**
```tsx
'use client'
import { login } from './actions'
import { useSearchParams } from 'next/navigation'
// ... your UI components

const page = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  
  return (
    <form action={login}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

**app/auth/register/page.tsx**
```tsx
'use client'
import { signup } from './actions'
import { useSearchParams } from 'next/navigation'
// ... your UI components

const page = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  
  return (
    <form action={signup}>
      <input name="full_name" type="text" required />
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="confirm_password" type="password" required />
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

### 7. Protected Pages

**app/dashboard/page.tsx**
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
    <div>
      <h1>Welcome back, {user.user_metadata?.full_name || 'User'}</h1>
      <p>Hello {user.email}</p>
    </div>
  )
}
```

### 8. Navbar with Auth

**components/ui/Navbar.tsx**
```tsx
'use client'
import { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

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
    <div>
      {!loading && user ? (
        <div>
          <span>{user.user_metadata?.full_name || 'User'}</span>
          <button onClick={handleSignOut}>Logout</button>
        </div>
      ) : !loading && (
        <div>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register">Signup</Link>
        </div>
      )}
    </div>
  )
}
```

## Key Points to Remember

1. **Form Structure**: Submit button must be inside form element
2. **Input Names**: Must match what you're reading in actions
3. **Error Handling**: Use URL search params for error messages
4. **Protected Routes**: Check auth in middleware and page components
5. **Auth State**: Use useEffect for client-side auth state management
6. **Redirects**: Use redirect() for server actions, router.push() for client

## Common Issues

- **"data is not defined"**: Use `user` not `data.user`
- **Form not submitting**: Button must be inside `<form>` tag
- **Auth not updating**: Check useEffect cleanup
- **Middleware not working**: Verify matcher pattern

## File Structure
```
├── .env.local
├── middleware.ts
├── utils/supabase/
│   ├── server.ts
│   ├── client.ts
│   └── middleware.ts
├── app/auth/
│   ├── login/
│   │   ├── page.tsx
│   │   └── actions.ts
│   └── register/
│       ├── page.tsx
│       └── actions.ts
└── components/ui/Navbar.tsx
```

This covers everything you need to implement authentication in Next.js with Supabase!
