import { useState } from 'react';

export default function SocialMediaIntegration() {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = 'Check out International Kabab House - Authentic Afghan & Middle Eastern Cuisine!';

  const socialLinks = {
    facebook: 'https://facebook.com/internationalkababhouse',
    instagram: 'https://instagram.com/internationalkababhouse',
    yelp: 'https://yelp.com/biz/international-kabab-house',
    google: 'https://g.page/international-kabab-house'
  };

  const shareToSocial = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
    setShowShareMenu(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex items-center space-x-3">
      {/* Social Follow Links */}
      <div className="flex flex-row space-x-2">
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#1877F2] hover:bg-[#166FE5] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Follow on Facebook"
          data-testid="link-facebook"
        >
          <i className="fa-brands fa-facebook-f text-lg"></i>
        </a>

        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Follow on Instagram"
          data-testid="link-instagram"
        >
          <i className="fa-brands fa-instagram text-lg"></i>
        </a>

        <a
          href={socialLinks.yelp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#FF1A1A] hover:bg-[#E60000] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Review on Yelp"
          data-testid="link-yelp"
        >
          <i className="fa-brands fa-yelp text-lg"></i>
        </a>

        <a
          href={socialLinks.google}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#4285F4] hover:bg-[#3367D6] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Review on Google"
          data-testid="link-google"
        >
          <i className="fa-brands fa-google text-lg"></i>
        </a>
      </div>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Share restaurant"
          data-testid="button-share"
        >
          <i className="fa-solid fa-share-alt text-lg"></i>
        </button>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-xl p-2 min-w-40">
            <div className="space-y-2">
              <button
                onClick={() => shareToSocial('facebook')}
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                data-testid="button-share-facebook"
              >
                <i className="fa-brands fa-facebook-f text-[#1877F2] mr-3"></i>
                Facebook
              </button>
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                data-testid="button-share-twitter"
              >
                <i className="fa-brands fa-twitter text-[#1DA1F2] mr-3"></i>
                Twitter
              </button>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                data-testid="button-share-whatsapp"
              >
                <i className="fa-brands fa-whatsapp text-[#25D366] mr-3"></i>
                WhatsApp
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                data-testid="button-share-linkedin"
              >
                <i className="fa-brands fa-linkedin-in text-[#0077B5] mr-3"></i>
                LinkedIn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}