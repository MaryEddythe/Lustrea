"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  sender_type: "client" | "admin";
  sender_name: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Appointment {
  id: number;
  name: string;
  service: {
    name: string;
  };
  appointment_date: string;
  appointment_time: string;
}

interface ChatInterfaceProps {
  appointmentId: number;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function ChatInterface({
  appointmentId,
  clientName,
  isOpen,
  onClose,
  isAdmin = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchMessages();
    }
  }, [isOpen, appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/appointments/${appointmentId}/messages`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessages(data.data.messages);
        setAppointment(data.data.appointment);

        // Mark messages as read if admin
        if (isAdmin) {
          markConversationAsRead();
        }
      } else {
        console.error("API returned error:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      // Set empty data on error to prevent UI issues
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markConversationAsRead = async () => {
    if (!isAdmin) return;

    try {
      await fetch(
        `/api/v1/admin/appointments/${appointmentId}/messages/read-all`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(
        `/api/v1/appointments/${appointmentId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(isAdmin && {
              Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            }),
          },
          body: JSON.stringify({
            sender_type: isAdmin ? "admin" : "client",
            sender_name: isAdmin ? "Admin" : clientName,
            message: newMessage.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");
      } else {
        console.error("API returned error:", data.message);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Could add user-visible error notification here
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {isAdmin ? `Chat with ${clientName}` : "Chat with Admin"}
                </CardTitle>
                {appointment && (
                  <p className="text-sm text-gray-600">
                    {appointment.service.name} -{" "}
                    {formatDate(appointment.appointment_date)}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_type === (isAdmin ? "admin" : "client")
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender_type === (isAdmin ? "admin" : "client")
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender_type === (isAdmin ? "admin" : "client")
                            ? "text-pink-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
