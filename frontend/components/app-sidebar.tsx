'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Compass, HomeIcon, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AgentStatusIndicator } from '@/components/agent-status-indicator'
import { SidebarUserNav } from '@/components/sidebar-user-nav'
import { Button } from '@/components/ui/button'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	useSidebar,
} from '@/components/ui/sidebar'

export function AppSidebar() {
	const router = useRouter()
	const { setOpenMobile } = useSidebar()
	const { user } = usePrivy()

	const handleNewChat = () => {
		setOpenMobile(false)
		router.push('/chat')
		router.refresh()
	}

	return (
		<Sidebar className="group-data-[side=left]:border-r-0 bg-sidebar">
			<SidebarHeader className="border-b border-sidebar-border">
				<SidebarMenu>
					<div className="flex flex-row items-center p-4">
						<Link
							className="flex flex-row items-center gap-2"
							href="/"
							onClick={() => {
								setOpenMobile(false)
							}}
						>
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
						</Link>
					</div>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="p-4">
				<div className="flex flex-col gap-6">
					{/* Navigation */}
					<div className="space-y-1">
						<Button
							variant="ghost"
							className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							onClick={() => {
								setOpenMobile(false)
								router.push('/')
							}}
						>
							<HomeIcon className="w-4 h-4 mr-2" />
							Home
						</Button>
						<Button
							variant="ghost"
							className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							onClick={() => {
								setOpenMobile(false)
								router.push('/explore')
							}}
						>
							<Compass className="w-4 h-4 mr-2" />
							Explore
						</Button>
					</div>

					{/* New Chat Action */}
					<div className="pt-2 border-t border-sidebar-border">
						<Button
							variant="default"
							className="w-full justify-start"
							onClick={handleNewChat}
						>
							<PlusIcon className="w-4 h-4 mr-2" />
							New Chat
						</Button>
					</div>

					{/* Enhanced Agent Status */}
					<AgentStatusIndicator />
				</div>
			</SidebarContent>
			<SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
		</Sidebar>
	)
}
