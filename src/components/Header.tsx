
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, LogOut, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      id="header"
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out",
        "h-[var(--header-height)]",
        isShrunk && "shrink"
      )}
    >
      <div className="container flex h-full max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 header-title-logo">
          <svg
            width="50"
            height="50"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
          >
            <path
              fill="hsl(180, 40%, 45%)"
              d="M100 0C72.386 0 50 22.386 50 50c0 14.897 6.503 28.23 16.965 37.125L62.5 87.5h75l-4.465-.375C143.497 78.23 150 64.897 150 50 150 22.386 127.614 0 100 0zm0 25c13.807 0 25 11.193 25 25s-11.193 25-25 25-25-11.193-25-25 11.193-25 25-25z"
            />
            <path
              fill="hsl(180, 40%, 45%)"
              stroke="hsl(26, 40%, 45%)"
              strokeWidth="10"
              d="M30 87.5V180a5 5 0 005 5h130a5 5 0 005-5V87.5H30z"
            />
            <path
              fill="none"
              stroke="hsl(26, 40%, 45%)"
              strokeWidth="10"
              strokeLinejoin="round"
              d="M45 102.5h110v65H45z"
            />
            <path
              fill="hsl(26, 40%, 45%)"
              d="M80 167.5a10 10 0 10-20 0 10 10 0 0020 0zM100 167.5a10 10 0 10-20 0 10 10 0 0020 0zM120 167.5a10 10 0 10-20 0 10 10 0 0020 0zM140 167.5a10 10 0 10-20 0 10 10 0 0020 0z"
            />
            <path
              fill="hsl(26, 40%, 45%)"
              d="M70 125a5 5 0 10-10 0 5 5 0 0010 0zM90 125a5 5 0 10-10 0 5 5 0 0010 0zM110 125a5 5 0 10-10 0 5 5 0 0010 0zM130 125a5 5 0 10-10 0 5 5 0 0010 0zM150 125a5 5 0 10-10 0 5 5 0 0010 0z"
            />
            <path
              fill="hsl(26, 40%, 45%)"
              d="M70 145a5 5 0 10-10 0 5 5 0 0010 0zM90 145a5 5 0 10-10 0 5 5 0 0010 0zM110 145a5 5 0 10-10 0 5 5 0 0010 0zM130 145a5 5 0 10-10 0 5 5 0 0010 0zM150 145a5 5 0 10-10 0 5 5 0 0010 0z"
            />
            <path
              fill="none"
              stroke="hsl(26, 40%, 45%)"
              strokeWidth="10"
              d="M100 102.5c-20 0-20 20-20 20s0-20 20-20z"
              transform="rotate(180 100 122.5)"
            />
            <path
              fill="hsl(26, 40%, 45%)"
              d="M30 190h140v10H30z"
            >
            </path>
            <path d="M40 185 L40 195 M55 185 L55 195 M70 185 L70 195 M85 185 L85 195 M100 185 L100 195 M115 185 L115 195 M130 185 L130 195 M145 185 L145 195 M160 185 L160 195" stroke="hsl(26, 40%, 45%)" strokeWidth="4"/>
          </svg>
          <span className="font-decorative text-3xl font-bold tracking-tight">
            MyMasjid
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/add-space">
              <PlusCircle className="mr-2 h-4 w-4" />
              Register a Masjid
            </Link>
          </Button>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="person avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setIsLoggedIn(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
              Login with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
