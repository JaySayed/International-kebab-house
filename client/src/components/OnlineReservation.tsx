import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function OnlineReservation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    party_size: '',
    special_requests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate reservation submission
    setTimeout(() => {
      toast({
        title: "Reservation Request Sent!",
        description: "We'll call you within 2 hours to confirm your reservation. Thank you!",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        party_size: '',
        special_requests: ''
      });
      setIsLoading(false);
    }, 1500);
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 animate-float">🍽️ Make a Reservation</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Reserve your table for an authentic Afghan dining experience. We'll confirm your reservation within 2 hours.
          </p>
        </div>

        <div className="card-enhanced rounded-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                data-testid="input-reservation-name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                data-testid="input-reservation-email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                data-testid="input-reservation-phone"
              />
            </div>

            <div>
              <label htmlFor="party_size" className="block text-sm font-medium text-foreground mb-2">
                Party Size *
              </label>
              <select
                id="party_size"
                name="party_size"
                value={formData.party_size}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                data-testid="select-reservation-party-size"
              >
                <option value="">Select party size</option>
                {[1,2,3,4,5,6,7,8,9,10].map(size => (
                  <option key={size} value={size.toString()}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </option>
                ))}
                <option value="10+">10+ people</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={minDate}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                data-testid="input-reservation-date"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                Preferred Time *
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                data-testid="select-reservation-time"
              >
                <option value="">Select time</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="13:30">1:30 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM</option>
                <option value="21:00">9:00 PM</option>
                <option value="21:30">9:30 PM</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="special_requests" className="block text-sm font-medium text-foreground mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={formData.special_requests}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any special dietary requirements, celebration details, or seating preferences..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                data-testid="textarea-special-requests"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary-enhanced px-6 py-4 rounded-lg font-medium text-lg disabled:opacity-50"
                data-testid="button-submit-reservation"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                    Sending Reservation...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-calendar-plus mr-2"></i>
                    Request Reservation
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <i className="fa-solid fa-info-circle mr-2 text-primary"></i>
              Reservations are confirmed via phone call within 2 hours. For immediate assistance, please call <a href="tel:(470) 990-6345" className="text-primary hover:underline">(470) 990-6345</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}