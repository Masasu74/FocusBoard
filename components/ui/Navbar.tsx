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
import { useState } from "react";
import { ChevronDown, ScanEye } from "lucide-react";
import { Button } from './button';
import Link from 'next/link';

const Navbar = () => {
      const [auth,setAuth]=useState(false)

  return (
        <div className="flex justify-center gap-5 md:justify-between md:gap-0 items-center flex-wrap">
          <div className="flex items-center justify-center gap-2">
            <ScanEye />
            <p className="text-2xl font-bold">
              Focus<span className="text-destructive">Board</span>
            </p>
          </div>
    {auth 
    ? (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 text-sm justify-center items-center">
                <div className="flex flex-row flex-wrap items-center gap-12">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </div>
                <p className="font-medium">Salomon</p>
                <ChevronDown size={22} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    )
  :(
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