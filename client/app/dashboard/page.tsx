"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Page() {
  const { data: session } = useSession();
  const senderId = session?.user?.email || "";

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const chatId = selectedUser ? [senderId, selectedUser.email].sort().join("_") : "";

  // Join room and listen
  useEffect(() => {
    if (!chatId) return;

    socket.emit("join_room", chatId);

    const handler = (data: any) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [chatId]);

  const handleSend = () => {
    if (!message.trim() || !selectedUser) return;

    const msgData = {
      chatId,
      message,
      senderId,
      receiverId: selectedUser.email,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar onSelect={setSelectedUser} />

        <div className="flex flex-col flex-1">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div>{session?.user?.name}</div>
            </header>
          </SidebarInset>

          {selectedUser ? (
            <div className="flex flex-col flex-1 justify-between">
              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md max-w-[60%] ${
                      msg.senderId === senderId
                        ? "bg-blue-500 text-white self-end ml-auto"
                        : "bg-gray-200 text-black self-start mr-auto"
                    }`}
                  >
                    {msg.message}
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${selectedUser.name || selectedUser.email}...`}
                />
                <Button onClick={handleSend}>Send</Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
