'use client'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { ChevronDown, ScanEye } from "lucide-react";
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
    
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Redirect to login if user signs out
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
    // The redirect will be handled by the auth state change listener
  }

  return (
        <div className="flex justify-center gap-5 md:justify-between md:gap-0 items-center flex-wrap">
          <div className="flex items-center justify-center gap-2">
            <ScanEye />
            <p className="text-2xl font-bold">
              Focus<span className="text-destructive">Board</span>
            </p>
          </div>
    {!loading && user 
    ? (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 text-sm justify-center items-center">
                <div className="flex flex-row flex-wrap items-center gap-12">
                  <Avatar>
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
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
       
  )}
         
      </div>
  )
}

export default Navbar