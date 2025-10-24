import ChatSidebar from '../../components/chat-sidebar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
			<ChatSidebar />

			<div className="flex-1 flex flex-col">{children}</div>
		</div>
	)
}
