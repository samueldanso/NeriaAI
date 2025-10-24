"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ChevronUp, LogOut, Settings, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarUserNav({ user }: { user: any }) {
  const { logout } = usePrivy();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "No address";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="h-10 bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              data-testid="user-nav-button"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Wallet className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="truncate" data-testid="user-address">
                  {formatAddress(user?.wallet?.address)}
                </span>
              </div>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-popper-anchor-width)"
            data-testid="user-nav-menu"
            side="top"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              data-testid="user-nav-item-wallet"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Wallet Connected
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              data-testid="user-nav-item-settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              data-testid="user-nav-item-logout"
              className="cursor-pointer"
            >
              <button
                className="w-full flex items-center"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect Wallet
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
