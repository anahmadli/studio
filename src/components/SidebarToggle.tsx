
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarToggle({ isOpen, setIsOpen, className }: SidebarToggleProps) {
  return (
    <Button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "h-8 w-8 rounded-full p-0",
        "bg-background hover:bg-muted border-2 border-border",
        "flex items-center justify-center",
        className
      )}
      size="icon"
      aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      {isOpen ? <ChevronLeft className="h-4 w-4 text-foreground" /> : <ChevronRight className="h-4 w-4 text-foreground" />}
    </Button>
  );
}
