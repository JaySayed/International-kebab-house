import { useState } from 'react';

export default function SpecialOffersBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="offers-banner text-primary-foreground py-3 px-4 text-center relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium">🎉 Special Offer: </span>
          <span>10% off first-time orders with code WELCOME10 | Fresh authentic Afghan cuisine daily!</span>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 text-primary-foreground hover:text-accent transition-colors"
          data-testid="button-close-banner"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
    </div>
  );
}