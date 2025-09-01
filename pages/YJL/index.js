import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/chatStyle.module.css';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  const [sessions, setSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 添加空的助手消息占位符
      const assistantMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // 创建AbortController用于取消请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 300000);

      // 发送流式请求
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`网络请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let assistantResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                setIsLoading(false);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content = `错误: ${parsed.error}`;
                    }
                    return newMessages;
                  });
                  setIsLoading(false);
                  return;
                }
                
                if (parsed.content) {
                  assistantResponse += parsed.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content = assistantResponse;
                    }
                    return newMessages;
                  });
                }
              } catch (parseError) {
                console.error('解析响应失败:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      
      let errorMessage = '发送消息失败，请重试';
      if (error.name === 'AbortError') {
        errorMessage = '请求超时(5分钟)，AI模型可能在处理复杂问题，请稍后重试或尝试简化问题';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = '无法连接到服务器，请检查网络连接或确保后端服务已启动';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = errorMessage;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 清除聊天历史
  const clearHistory = () => {
    const result = confirm('确定要清除当前会话的聊天记录吗？');
    
    if (result) {
      setMessages([]);
      alert('聊天记录已清除');
    }
  };

  // 创建新会话
  const createNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    setMessages([]);
    setShowSessions(false);
  };

  // 处理回车键发送消息
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.customerService}>
      {/* 头部导航栏 */}
      <div className={styles.customerServiceNavHeader}>
        <div className={styles.navBackBtn}>
          返回
        </div>
        <div className={styles.navTitle}>客服</div>
        <div className={styles.navPlaceholder}></div>
      </div>

      {/* 功能按钮区域 */}
      <div className={styles.customerServiceHeader}>
        <div className={styles.headerTitle}>智能客服</div>
        <div className={styles.headerActions}>
          <button 
            className={styles.headerBtn}
            onClick={() => setShowSessions(true)}
            title="聊天记录"
          >
            📋
          </button>
          <button 
            className={styles.headerBtn}
            onClick={clearHistory}
            title="清除记录"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* 聊天消息区域 */}
      <div className={styles.chatContainer} ref={chatContainerRef}>
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeIcon}>🤖</div>
              <h3>欢迎使用智能客服</h3>
              <p>我可以帮您解答购物相关问题，提供产品推荐等服务</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
            >
              <div className={styles.messageAvatar}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{message.content}</div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.messageAvatar}>🤖</div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="请输入您的问题..."
          disabled={isLoading}
          className={styles.messageInput}
        />
        <button
          className={styles.sendButton}
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          发送
        </button>
      </div>

      {/* 会话列表弹窗 */}
      {showSessions && (
        <div className={styles.sessionsOverlay} onClick={() => setShowSessions(false)}>
          <div className={styles.sessionsPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sessionsHeader}>
              <button 
                className={styles.backBtn}
                onClick={() => setShowSessions(false)}
              >
                ← 返回
              </button>
              <h3>聊天记录</h3>
              <button 
                className={styles.newSessionBtn}
                onClick={createNewSession}
              >
                新建
              </button>
            </div>
            
            <div className={styles.sessionsList}>
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  className={`${styles.sessionItem} ${session.sessionId === sessionId ? styles.active : ''}`}
                  onClick={() => {
                    setSessionId(session.sessionId);
                    setShowSessions(false);
                  }}
                >
                  <div className={styles.sessionTitle}>
                    会话 {session.sessionId}
                  </div>
                  <div className={styles.sessionPreview}>
                    {session.lastMessage || '暂无消息'}
                  </div>
                  <div className={styles.sessionTime}>
                    {new Date(session.updatedAt).toLocaleString()}
                  </div>
                </div>
              ))}
              
              {sessions.length === 0 && (
                <div className={styles.emptySessions}>
                  <p>暂无聊天记录</p>
                  <button 
                    className={styles.startChatBtn}
                    onClick={createNewSession}
                  >
                    开始新对话
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}