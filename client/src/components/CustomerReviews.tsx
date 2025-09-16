export default function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      text: "Absolutely amazing! The Qabuli Pulao was perfection - tender lamb, fluffy rice with the perfect blend of spices. The service was excellent and the atmosphere is so welcoming.",
      platform: "Google",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Ahmad K.",
      rating: 5,
      text: "Best Afghan food in Atlanta! The kababs are grilled to perfection and the mantu dumplings are just like my grandmother used to make. Highly recommend!",
      platform: "Yelp",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Jennifer L.",
      rating: 5,
      text: "First time trying Afghan cuisine and I was blown away! The staff explained every dish and made great recommendations. The lamb karahi was incredible.",
      platform: "Google",
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "Michael R.",
      rating: 5,
      text: "Family-owned restaurant with authentic recipes and fresh ingredients. You can taste the love in every dish. The ashak and bolani were outstanding!",
      platform: "Yelp",
      date: "1 week ago"
    }
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4 animate-bounce-subtle">⭐ What Our Customers Say</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers who love our authentic Afghan and Middle Eastern cuisine
          </p>
          <div className="flex justify-center items-center mt-4 space-x-2">
            <div className="star-rating flex">
              {[1,2,3,4,5].map((star) => (
                <i key={star} className="fa-solid fa-star text-yellow-400 text-lg"></i>
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">4.9/5</span>
            <span className="text-muted-foreground">(127+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="card-enhanced rounded-xl p-6 animate-float group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-3">
                    {[1,2,3,4,5].map((star) => (
                      <i key={star} className="fa-solid fa-star text-sm"></i>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.platform} Review</span>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              
              <p className="text-foreground mb-4 leading-relaxed line-clamp-4">
                "{review.text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <i className="fa-solid fa-user text-primary text-sm"></i>
                  </div>
                  <span className="font-semibold text-foreground">{review.name}</span>
                </div>
                <div className="text-primary">
                  <i className="fa-solid fa-quote-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">Love our food? Share your experience!</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review" 
              target="_blank" 
              rel="noopener noreferrer"
              className="card-enhanced border-2 border-primary text-primary px-4 py-2 rounded-lg hover:glow-accent transition-all inline-flex items-center"
              data-testid="link-google-review"
            >
              <i className="fa-brands fa-google mr-2"></i>Review on Google
            </a>
            <a 
              href="https://www.yelp.com/writeareview/biz/YOUR_YELP_BUSINESS_ID" 
              target="_blank" 
              rel="noopener noreferrer"
              className="card-enhanced border-2 border-accent text-accent px-4 py-2 rounded-lg hover:glow-accent transition-all inline-flex items-center"
              data-testid="link-yelp-review"
            >
              <i className="fa-brands fa-yelp mr-2"></i>Review on Yelp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}