"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  MessageCircle,
  Airplay,
  MapPinned
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Header() {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const handleClick = () => setShowPopup(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.jpeg"}
            alt="ProPathAI Logo"
            width={180}
            height={70}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center md:space-x-4 relative">
          {showPopup && (
            <div className="absolute w-[622px] top-16 bg-white text-black p-4 rounded-2xl shadow-xl border max-w-xs text-lg animate-bounce">
              <p>ProPath is here to drive you through interviews!<br />Explore the Growth Tools to get started.</p>
            </div>
          )}

          <SignedIn>
            <Link href="/inteviewboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Airplay className="h-4 w-4" />
                Interview-Board
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <Airplay className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Industry Insights
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/chatbot" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chatbot
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/ai-cover-letter" className="flex items-center gap-2">
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/career-path" className="flex items-center gap-2">
                    <MapPinned className="h-4 w-4" />
                    RoadMap
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
