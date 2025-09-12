"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User, Settings, Bell, HelpCircle, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SettingsDialog } from "./settings-dialog";
import { HelpDialog } from "./help-dialog";
import { NotificationsDialog } from "./notifications-dialog";

export function DashboardHeader() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold text-foreground">
          Aqua Index Analyzer
        </h1>
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Action Buttons */}
        {user && (
          <div className="hidden sm:flex items-center gap-1">
            <SettingsDialog>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </SettingsDialog>
            
            <NotificationsDialog>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
              </Button>
            </NotificationsDialog>
            
            <HelpDialog>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </HelpDialog>
          </div>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user?.photoURL ?? "https://picsum.photos/seed/user-avatar/32/32"} 
                  alt="User Avatar" 
                />
                <AvatarFallback className="text-xs">
                  {user?.displayName?.[0] ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user ? (user.displayName ?? 'My Account') : 'Guest User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? 'Not signed in'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {!user ? (
              <DropdownMenuItem onClick={signInWithGoogle} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Sign in with Google</span>
              </DropdownMenuItem>
            ) : (
              <>
                {/* Mobile Menu Items */}
                <div className="sm:hidden">
                  <SettingsDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </SettingsDialog>
                  
                  <NotificationsDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                  </NotificationsDialog>
                  
                  <HelpDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                  </HelpDialog>
                  <DropdownMenuSeparator />
                </div>
                
                <DropdownMenuItem onClick={signOutUser} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
