export default function FloatingActionButtons() {
  const phoneNumber = "(470) 990-6345";
  const whatsappNumber = "14709906345"; // Remove any formatting for WhatsApp
  const whatsappMessage = "Hi! I'd like to make a reservation or place an order at International Kabab House.";

  return (
    <>
      {/* Click-to-Call Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="click-to-call w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Call International Kabab House"
        data-testid="button-click-to-call"
      >
        <i className="fa-solid fa-phone text-xl animate-bounce-subtle"></i>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Message us on WhatsApp"
        data-testid="button-whatsapp"
      >
        <i className="fa-brands fa-whatsapp text-xl"></i>
      </a>
    </>
  );
}