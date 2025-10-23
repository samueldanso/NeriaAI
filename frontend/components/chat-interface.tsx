"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageBubble } from "@/components/message-bubble"
import { ReasoningVisualization } from "@/components/reasoning-visualization"

interface Message {
  role: string
  content: string
  reasoning?: string
  capsuleId?: string
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ask Anything</h2>
              <p className="text-muted">Get verified answers powered by autonomous AI agents</p>
              <div className="mt-6 grid grid-cols-2 gap-2 max-w-xs mx-auto">
                {[
                  "How does React useMemo work?",
                  "Explain Layer 2 scaling",
                  "Gas optimization tips",
                  "Smart contract security",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(suggestion)}
                    className="text-sm p-2 rounded border border-border hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i}>
              <MessageBubble
                message={msg}
                isUser={msg.role === "user"}
                onExpandReasoning={() => setExpandedMessage(expandedMessage === i ? null : i)}
              />
              {expandedMessage === i && msg.reasoning && (
                <div className="mt-2 ml-4">
                  <ReasoningVisualization reasoning={msg.reasoning} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-surface border-border"
          />
          <Button type="submit" className="bg-primary text-background hover:bg-primary-dark">
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
