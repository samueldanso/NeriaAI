"use client";

import { usePrivy } from "@privy-io/react-auth";
import { BotIcon, PlusIcon, TrashIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AgentStatusIndicator } from "@/components/agent-status-indicator";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { user, logout } = usePrivy();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const handleDeleteAll = () => {
    // For now, just clear local storage
    localStorage.removeItem("neria-chat-history");
    toast.success("All chats deleted successfully");
    setShowDeleteAllDialog(false);
    router.push("/");
  };

  const handleNewChat = () => {
    setOpenMobile(false);
    router.push("/chat");
    router.refresh();
  };

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0">
        <SidebarHeader>
          <SidebarMenu>
            <div className="flex flex-row items-center justify-between">
              <Link
                className="flex flex-row items-center gap-3"
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="cursor-pointer rounded-md px-2 font-semibold text-lg hover:bg-muted">
                    Neria AI
                  </span>
                </div>
              </Link>
              <div className="flex flex-row gap-1">
                {user && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-8 p-1 md:h-fit md:p-2"
                        onClick={() => setShowDeleteAllDialog(true)}
                        type="button"
                        variant="ghost"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end" className="hidden md:block">
                      Delete All Chats
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-8 p-1 md:h-fit md:p-2"
                      onClick={handleNewChat}
                      type="button"
                      variant="ghost"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align="end" className="hidden md:block">
                    New Chat
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex flex-col gap-4 p-4">
            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleNewChat}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/")}
                >
                  <BotIcon className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>

            {/* Wallet Status */}
            {user && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2">
                  Wallet Status
                </h3>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-sidebar-accent">
                  <WalletIcon className="w-4 h-4 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Connected</p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">
                      {user.wallet?.address?.slice(0, 6)}...
                      {user.wallet?.address?.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Agent Status */}
            <AgentStatusIndicator />
          </div>
        </SidebarContent>
        <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
      </Sidebar>

      <AlertDialog
        onOpenChange={setShowDeleteAllDialog}
        open={showDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your chat history and remove them from local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
