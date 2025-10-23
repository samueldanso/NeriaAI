import { Providers } from '@/components/providers'
import ChatSidebar from './_components/chat-sidebar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
				{/* Sidebar - Perplexity/Manus AI Style */}
				<ChatSidebar />

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col">{children}</div>
			</div>
		</Providers>
	)
}
