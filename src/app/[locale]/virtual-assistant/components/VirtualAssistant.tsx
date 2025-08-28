"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { useTranslations } from 'next-intl';
import styles from './VirtualAssistant.module.css';

// Simple UUID generator - using crypto.randomUUID for better hydration compatibility
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  ui?: {
    type: 'message' | 'cards' | 'paywall';
    payload: any;
  };
}

interface VAResponse {
  reply: string;
  state: string;
  slots: {
    stack?: string;
    location?: string;
    wantsToSeeMatches?: boolean;
  };
  ui: {
    type: 'message' | 'cards' | 'paywall';
    payload: any;
  };
}

export function VirtualAssistant() {
  const t = useTranslations();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isMembershipActive, setIsMembershipActive] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session on component mount
  useEffect(() => {
    const newSessionId = generateUUID();
    setSessionId(newSessionId);
    
    // Add welcome message with fixed timestamp to avoid hydration issues
    const welcomeMessage: Message = {
      id: 'welcome-message',
      text: "Hello! I'm your Virtual Assistant. I can help you find developers based on technology stack and location. What are you looking for?",
      sender: 'assistant',
      timestamp: new Date('2024-01-01T00:00:00Z'), // Fixed timestamp
      ui: {
        type: 'message',
        payload: { text: "Hello! I'm your Virtual Assistant. I can help you find developers based on technology stack and location. What are you looking for?" }
      }
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleMembershipToggle = () => {
    setIsMembershipActive(!isMembershipActive);
    if (!isMembershipActive) {
      // Generate a mock user ID for testing - using timestamp for consistency
      const timestamp = Date.now();
      setUserId(`user_${timestamp % 10000}`);
      setIsAnonymous(false);
    } else {
      setUserId(undefined);
      setIsAnonymous(true);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateUUID(),
      text: inputText,
      sender: 'user',
      timestamp: new Date('2024-01-01T00:00:00Z') // Fixed timestamp for hydration
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/va/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId,
          text: inputText,
          locale: 'en-US'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VAResponse = await response.json();
      
      const assistantMessage: Message = {
        id: generateUUID(),
        text: data.reply,
        sender: 'assistant',
        timestamp: new Date('2024-01-01T00:00:00Z'), // Fixed timestamp for hydration
        ui: data.ui
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: 'error-message',
        text: "Sorry, I'm having trouble connecting to the Virtual Assistant API. Please make sure the API is running on port 3001. You can start it with: ./scripts/start-virtual-assistant.sh",
        sender: 'assistant',
        timestamp: new Date('2024-01-01T00:00:00Z'),
        ui: {
          type: 'message',
          payload: { text: "Sorry, I'm having trouble connecting to the Virtual Assistant API. Please make sure the API is running on port 3001. You can start it with: ./scripts/start-virtual-assistant.sh" }
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div key={message.id} className={`${styles.message} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
        <div className={styles.messageHeader}>
          <Avatar 
            icon={isUser ? "pi pi-user" : "pi pi-robot"} 
            className={isUser ? styles.userAvatar : styles.assistantAvatar}
            size="normal"
          />
          <div className={styles.messageInfo}>
            <span className={styles.senderName}>
              {isUser ? 'You' : 'Virtual Assistant'}
            </span>
            <span className={styles.timestamp}>
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className={styles.messageContent}>
          <p className={styles.messageText}>{message.text}</p>
          
          {/* Render UI components */}
          {message.ui && renderUIComponent(message.ui)}
        </div>
      </div>
    );
  };

  const renderUIComponent = (ui: any) => {
    switch (ui.type) {
      case 'cards':
        return (
          <div className={styles.cardsContainer}>
            <h4>{t('PROJECT_MATCHES')}</h4>
            <div className={styles.cardsGrid}>
              {ui.payload.items?.map((item: any, index: number) => (
                <Card key={index} className={styles.projectCard}>
                  <div className={styles.projectInfo}>
                    <h5>{item.title}</h5>
                    <Chip label={item.location} className={styles.locationChip} />
                    <Button 
                      label={t('APPLY')} 
                      icon="pi pi-external-link" 
                      className={styles.applyButton}
                      onClick={() => window.open(item.applyUrl, '_blank')}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'paywall':
        return (
          <div className={styles.paywallContainer}>
            <div className={styles.paywallContent}>
              <i className="pi pi-lock" style={{ fontSize: '2rem', color: '#ff6b6b' }}></i>
              <h4>{t('PREMIUM_CONTENT')}</h4>
              <p>{t('UPGRADE_MESSAGE')}</p>
              <Button 
                label={t('UPGRADE_NOW')} 
                icon="pi pi-star" 
                className={styles.upgradeButton}
                onClick={() => window.open(ui.payload.ctaUrl, '_blank')}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const clearConversation = () => {
    const newSessionId = generateUUID();
    setSessionId(newSessionId);
    setMessages([]);
    
    // Add welcome message with fixed timestamp to avoid hydration issues
    const welcomeMessage: Message = {
      id: 'welcome-message',
      text: "Hello! I'm your Virtual Assistant. I can help you find developers based on technology stack and location. What are you looking for?",
      sender: 'assistant',
      timestamp: new Date('2024-01-01T00:00:00Z'), // Fixed timestamp
      ui: {
        type: 'message',
        payload: { text: "Hello! I'm your Virtual Assistant. I can help you find developers based on technology stack and location. What are you looking for?" }
      }
    };
    
    setMessages([welcomeMessage]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('VIRTUAL_ASSISTANT')}</h1>
        <p>{t('VIRTUAL_ASSISTANT_DESCRIPTION')}</p>
      </div>

      <div className={styles.controls}>
        <Card className={styles.controlCard}>
          <div className={styles.controlRow}>
            <div className={styles.controlGroup}>
              <label>{t('MEMBERSHIP_STATUS')}:</label>
              <ToggleButton
                onLabel={t('ACTIVE_MEMBER')}
                offLabel={t('INACTIVE_ANONYMOUS')}
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                checked={isMembershipActive}
                onChange={handleMembershipToggle}
                className={styles.membershipToggle}
              />
            </div>
            
            <div className={styles.controlGroup}>
              <label>{t('USER_ID')}:</label>
              <InputText
                value={userId || t('ANONYMOUS')}
                disabled
                className={styles.userIdInput}
              />
            </div>
            
            <div className={styles.controlGroup}>
              <label>{t('SESSION_ID')}:</label>
              <InputText
                value={sessionId}
                disabled
                className={styles.sessionIdInput}
              />
            </div>
          </div>
          
          <div className={styles.controlActions}>
            <Button
              label={t('CLEAR_CONVERSATION')}
              icon="pi pi-refresh"
              severity="secondary"
              onClick={clearConversation}
              className={styles.clearButton}
            />
          </div>
        </Card>
      </div>

      <div className={styles.chatContainer}>
        <Card className={styles.chatCard}>
          <ScrollPanel className={styles.messagesPanel}>
            <div className={styles.messagesContainer}>
              {messages.map(renderMessage)}
              {isLoading && (
                <div className={styles.loadingMessage}>
                  <Avatar icon="pi pi-robot" className={styles.assistantAvatar} size="normal" />
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollPanel>
          
          <Divider />
          
          <div className={styles.inputContainer}>
            <InputText
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('TYPE_MESSAGE')}
              className={styles.messageInput}
              disabled={isLoading}
            />
            <Button
              icon="pi pi-send"
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={styles.sendButton}
            />
          </div>
        </Card>
      </div>

      <div className={styles.info}>
                <Card className={styles.infoCard}>
          <h3>{t('HOW_TO_TEST')}</h3>
          <ul>
            <li><strong>{t('MEMBERSHIP_TOGGLE_DESC')}</strong></li>
            <li><strong>{t('TRY_EXAMPLES')}</strong></li>
            <ul>
              <li>&ldquo;{t('EXAMPLE_1')}&rdquo;</li>
              <li>&ldquo;{t('EXAMPLE_2')}&rdquo;</li>
              <li>&ldquo;{t('EXAMPLE_3')}&rdquo;</li>
            </ul>
            <li><strong>{t('FLOW_DESC')}</strong></li>
            <li><strong>{t('RESULTS_DESC')}</strong></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
