import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today? You can ask about our menu, hours, or place an order!", sender: 'support', time: new Date().toLocaleTimeString() }
  ]);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Auto-reply simulation
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: "Thank you for your message! Our team will respond shortly. For immediate assistance, please call (470) 990-6345 or place your order online.",
        sender: 'support',
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-140px right-20px z-1000 w-14 h-14 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Open live chat"
        data-testid="button-open-chat"
        style={{ bottom: '140px', right: '20px', zIndex: 1000 }}
      >
        <i className="fa-solid fa-comments text-xl animate-bounce-subtle"></i>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20px right-20px z-1000 w-80 h-96 bg-card border border-border rounded-xl shadow-2xl flex flex-col" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
      {/* Chat Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <i className="fa-solid fa-headset text-sm"></i>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Customer Support</h3>
            <p className="text-xs opacity-90">Online now</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:text-accent transition-colors"
          data-testid="button-close-chat"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-2 rounded-lg text-sm ${
              msg.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-foreground'
            }`}>
              <p>{msg.text}</p>
              <p className="text-xs opacity-70 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            data-testid="input-chat-message"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            data-testid="button-send-message"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">Or call us at <a href="tel:(470) 990-6345" className="text-primary hover:underline">(470) 990-6345</a></p>
        </div>
      </div>
    </div>
  );
}