"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Clock,
  User,
  Calendar,
  Search,
  Badge as BadgeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInterface from "@/components/messaging/chat-interface";

interface Conversation {
  id: number;
  name: string;
  email: string;
  service: {
    name: string;
  };
  appointment_date: string;
  appointment_time: string;
  messages: Array<{
    id: number;
    message: string;
    sender_type: string;
    created_at: string;
  }>;
  unread_messages_count: number;
}

export default function MessagesManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchTerm]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/admin/messages/conversations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setConversations(data.data);
      } else {
        console.error("API returned error:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      // Set empty conversations on error to prevent UI issues
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/v1/admin/messages/unread-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUnreadCount(data.data.unread_count);
      } else {
        console.error("API returned error:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      // Set to 0 on error to prevent UI issues
      setUnreadCount(0);
    }
  };

  const filterConversations = () => {
    let filtered = conversations;

    if (searchTerm) {
      filtered = conversations.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.service.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredConversations(filtered);
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
    // Refresh conversations to update read status
    fetchConversations();
    fetchUnreadCount();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastMessage = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "No messages yet";
    const lastMessage = conversation.messages[0];
    return lastMessage.message.length > 50
      ? lastMessage.message.substring(0, 50) + "..."
      : lastMessage.message;
  };

  const getLastMessageTime = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "";
    return formatTime(conversation.messages[0].created_at);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            <p className="text-gray-600">
              Manage client conversations and support requests
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="px-3 py-1">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversations
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Conversations Found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "No conversations match your search."
                  : "Client messages will appear here."}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      conversation.unread_messages_count > 0
                        ? "border-pink-200 bg-pink-50"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {conversation.name}
                          </h4>
                          {conversation.unread_messages_count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {conversation.unread_messages_count} new
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {conversation.service.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(conversation.appointment_date)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {getLastMessage(conversation)}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {getLastMessageTime(conversation)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {selectedConversation && (
        <ChatInterface
          appointmentId={selectedConversation.id}
          clientName={selectedConversation.name}
          isOpen={isChatOpen}
          onClose={handleChatClose}
          isAdmin={true}
        />
      )}
    </div>
  );
}
