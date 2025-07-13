
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <Button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "absolute top-1/2 -right-4 z-10 h-8 w-8 rounded-full p-0",
        "transform -translate-y-1/2",
        "bg-background hover:bg-muted border-2 border-border"
      )}
      size="icon"
      aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  );
}
