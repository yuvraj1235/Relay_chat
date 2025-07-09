"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function Page() {
  const { roomid } = useParams();
  const { data: session } = useSession();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const senderId = session?.user?.email;
  let receiverId = "";
  let chatId = "";

  if (roomid && senderId) {
    const [rawId1, rawId2] = decodeURIComponent(roomid).split("_");
    receiverId = rawId1 === senderId ? rawId2 : rawId1;
    chatId = [senderId, receiverId].sort().join("_");
  }

  // Join socket room
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

  // Load messages
  useEffect(() => {
    if (!chatId) return;

    fetch("/api/getChatHistory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId }),
    })
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error);
  }, [chatId]);

  const handleSend = () => {
  if (!message.trim() || !chatId) return;

  const newMsg = {
    chatId,
    senderId,
    receiverId,
    message,
    timestamp: new Date().toISOString(),
  };

  setMessage(""); // clear input only

  socket.emit("send_message", newMsg); // let socket handle showing it

  // Save to DB
  fetch("/api/saveMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMsg),
  }).catch(console.error);
};

  // ⛔️ Delay UI until roomid and session are ready
  if (!roomid || !senderId) return <div className="p-4">Loading...</div>;

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <SidebarInset>
            <header className="flex h-16 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <span className="font-semibold">Chat with {receiverId}</span>
            </header>
          </SidebarInset>

          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-muted">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-[60%] ${
                  msg.senderId === senderId
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                }`}
              >
                {msg.message}
                <div className="text-xs opacity-60 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex gap-2">
            <Input
              className="flex-1"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Page;
