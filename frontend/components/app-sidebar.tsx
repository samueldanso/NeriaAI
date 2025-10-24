"use client";

import { usePrivy } from "@privy-io/react-auth";
import { HomeIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
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
      <Sidebar className="group-data-[side=left]:border-r-0 bg-sidebar">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <div className="flex flex-row items-center justify-between p-4">
              <Link
                className="flex flex-row items-center gap-3"
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/icon.png"
                    alt="Neria AI"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span className="cursor-pointer rounded-md px-2 font-semibold text-lg text-sidebar-foreground hover:bg-sidebar-accent">
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
        <SidebarContent className="p-4">
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={handleNewChat}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => router.push("/")}
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>

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
