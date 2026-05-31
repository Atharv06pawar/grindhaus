import React, { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { buildWebSocketUrl, getProfile, isRealtimeEnabled, sendChatMessage } from "../lib/api";
import {
  AppFrame,
  ChatLayout,
  ComposerRow,
  ContentWrap,
  EmptyState,
  Input,
  MessageBubble,
  MessageList,
  Panel,
  PanelHeader,
  PrimaryButton,
  SectionText,
  SectionTitle,
  StatCard,
  StatGrid,
  StatLabel,
  StatValue
} from "../styles/ui";

function ChatPage() {
  const { currentUser, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const mockTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    getProfile()
      .then((profileResponse) => {
        if (!isMounted) {
          return;
        }

        setProfile(profileResponse);
        const historyMessages = (profileResponse.history || []).slice(-20).map((entry, index) => ({
          id: `${entry.timestamp}-${index}`,
          from: entry.role === "assistant" ? "assistant" : "user",
          text: entry.text
        }));

        setMessages(
          historyMessages.length > 0
            ? historyMessages
            : [
                {
                  id: "system-start",
                  from: "assistant",
                  text: "State your name, weight, or goal. Keep it precise."
                }
              ]
        );
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser.userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!token || !isRealtimeEnabled()) {
      return undefined;
    }

    const socketUrl = new URL(buildWebSocketUrl("/ws/chat"));
    socketUrl.searchParams.set("token", token);
    const socket = new WebSocket(socketUrl.toString());
    socketRef.current = socket;

    socket.onmessage = (event) => {
      window.clearTimeout(mockTimeoutRef.current);
      mockTimeoutRef.current = null;

      try {
        const payload = JSON.parse(event.data);
        const reply = payload.reply || payload.message || "Logged. Keep moving.";

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: `assistant-${Date.now()}`,
            from: "assistant",
            text: reply
          }
        ]);

        if (payload.profile) {
          setProfile(payload.profile);
        }
      } catch (_error) {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: `assistant-${Date.now()}`,
            from: "assistant",
            text: "Message received. Keep the log precise."
          }
        ]);
      } finally {
        setIsSending(false);
      }
    };

    socket.onerror = () => {
      socket.close();
    };

    return () => {
      window.clearTimeout(mockTimeoutRef.current);
      socket.close();
      socketRef.current = null;
    };
  }, [token]);

  const stats = useMemo(() => {
    if (!profile) {
      return [
        { label: "Weight", value: "--" },
        { label: "Goal", value: "--" },
        { label: "Streak", value: "--" }
      ];
    }

    return [
      { label: "Weight", value: profile.weight ? `${profile.weight} kg` : "--" },
      { label: "Goal", value: profile.goal || "--" },
      { label: "Streak", value: profile.streak || 0 }
    ];
  }, [profile]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isSending) {
      return;
    }

    const nextUserMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text
    };

    setMessages((currentMessages) => [...currentMessages, nextUserMessage]);
    setDraft("");
    setIsSending(true);
    setError("");

    const addRestResponse = async () => {
      try {
        const payload = await sendChatMessage(text);
        const assistantMessages = [
          {
            id: `assistant-${Date.now()}`,
            from: "assistant",
            text: payload.response || payload.reply || "Logged. Keep moving."
          },
          ...(payload.notifications || []).slice(-2).map((notification) => ({
            id: notification.id,
            from: "assistant",
            text: `Reminder: ${notification.message}`
          }))
        ];

        setMessages((currentMessages) => [...currentMessages, ...assistantMessages]);

        if (payload.profile) {
          setProfile(payload.profile);
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsSending(false);
      }
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: text, text }));
      mockTimeoutRef.current = window.setTimeout(addRestResponse, 5000);
      return;
    }

    await addRestResponse();
  };

  return (
    <AppFrame>
      <ContentWrap>
        <ChatLayout>
          <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Session feed</SectionTitle>
            <SectionText>The AI trainer responds through the local companion engine.</SectionText>
          </div>
        </PanelHeader>

        {error ? <SectionText>{error}</SectionText> : null}

        <MessageList>
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble key={message.id} $from={message.from}>
                {message.text}
              </MessageBubble>
            ))
          ) : (
            <EmptyState>Loading message history...</EmptyState>
          )}
          <div ref={bottomRef} />
        </MessageList>

        <ComposerRow>
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Example: my weight is 81"
          />
          <PrimaryButton type="button" onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending..." : "Send"}
          </PrimaryButton>
        </ComposerRow>
          </Panel>

          <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Live profile signals</SectionTitle>
            <SectionText>These values are synced from companion memory after each message.</SectionText>
          </div>
        </PanelHeader>

        <StatGrid>
          {stats.map((item) => (
            <StatCard key={item.label}>
              <StatLabel>{item.label}</StatLabel>
              <StatValue>{item.value}</StatValue>
            </StatCard>
          ))}
        </StatGrid>
          </Panel>
        </ChatLayout>
      </ContentWrap>
    </AppFrame>
  );
}

export default ChatPage;
