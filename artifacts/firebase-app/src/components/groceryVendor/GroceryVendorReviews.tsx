import React, { useState } from 'react';
import { Star, MessageSquare, ChevronDown } from 'lucide-react';

const reviews = [
  { id: 1, customer: 'Meena Iyer', rating: 5, text: 'Super fresh vegetables! Delivered on time and well packed. Will definitely order again.', date: 'Mar 31, 2026', order: 'Order #G198', replied: false },
  { id: 2, customer: 'Suresh Nair', rating: 4, text: 'Good quality rice and dal. Packaging was a bit weak for the rice bag but overall good.', date: 'Mar 30, 2026', order: 'Order #G194', replied: true, reply: 'Thank you Suresh! We will improve our packaging.' },
  { id: 3, customer: 'Anita Rao', rating: 5, text: 'Best grocery delivery in Bengaluru. Everything was fresh and exactly as described.', date: 'Mar 28, 2026', order: 'Order #G190', replied: false },
  { id: 4, customer: 'Deepak Verma', rating: 3, text: 'The eggs were fine but delivery took longer than expected. Hope it improves.', date: 'Mar 27, 2026', order: 'Order #G187', replied: false },
  { id: 5, customer: 'Latha Krishnan', rating: 5, text: 'Organic spinach was so fresh! Great selection and quick delivery.', date: 'Mar 25, 2026', order: 'Order #G182', replied: true, reply: 'Thank you Latha! We source fresh produce daily.' },
];

const RatingStars: React.FC<{ rating: number; size?: string }> = ({ rating, size = 'w-4 h-4' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`${size} ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-blue-700'}`} />
    ))}
  </div>
);

export const GroceryVendorReviews: React.FC = () => {
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<number, boolean>>({});
  const [reviewList, setReviewList] = useState(reviews);
  const [filter, setFilter] = useState('All');

  const avgRating = (reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length).toFixed(1);

  const submitReply = (id: number) => {
    if (!replies[id]?.trim()) return;
    setReviewList(prev => prev.map(r => r.id === id ? { ...r, replied: true, reply: replies[id] } : r));
    setReplyOpen(prev => ({ ...prev, [id]: false }));
  };

  const filtered = reviewList.filter(r => filter === 'All' || (filter === 'Positive' ? r.rating >= 4 : r.rating <= 3));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Customer Reviews</h1>
        <p className="text-blue-400 text-sm mt-1">Manage and respond to customer feedback</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Average Rating', value: avgRating, sub: `${reviewList.length} reviews`, color: 'text-yellow-400' },
          { label: '5 Stars', value: reviewList.filter(r => r.rating === 5).length, sub: 'Excellent', color: 'text-green-400' },
          { label: '3-4 Stars', value: reviewList.filter(r => r.rating >= 3 && r.rating < 5).length, sub: 'Good', color: 'text-blue-400' },
          { label: '1-2 Stars', value: reviewList.filter(r => r.rating < 3).length, sub: 'Needs work', color: 'text-red-400' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-blue-900 border border-blue-800 rounded-xl p-4 text-center">
            <p className="text-blue-400 text-xs mb-1">{label}</p>
            <p className={`${color} text-2xl font-bold`}>{value}</p>
            <p className="text-blue-500 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {['All', 'Positive', 'Critical'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-blue-500 text-white' : 'bg-blue-900 border border-blue-700 text-blue-400 hover:bg-blue-800'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-blue-900 border border-blue-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{review.customer}</p>
                  <p className="text-blue-500 text-xs">{review.order} · {review.date}</p>
                  <div className="mt-1"><RatingStars rating={review.rating} /></div>
                </div>
              </div>
            </div>
            <p className="text-blue-200 text-sm mt-3 leading-relaxed">{review.text}</p>
            {review.replied && review.reply && (
              <div className="mt-3 ml-4 p-3 bg-blue-800/60 border border-blue-700 rounded-xl">
                <p className="text-blue-400 text-xs font-medium mb-1">Your Reply</p>
                <p className="text-blue-100 text-sm">{review.reply}</p>
              </div>
            )}
            {!review.replied && (
              <div className="mt-3">
                {replyOpen[review.id] ? (
                  <div className="space-y-2">
                    <textarea
                      value={replies[review.id] || ''}
                      onChange={e => setReplies(prev => ({ ...prev, [review.id]: e.target.value }))}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full bg-blue-800 border border-blue-700 text-blue-100 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-blue-600"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => submitReply(review.id)} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg">Submit Reply</button>
                      <button onClick={() => setReplyOpen(prev => ({ ...prev, [review.id]: false }))} className="px-3 py-1.5 bg-blue-800 text-blue-400 text-xs rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReplyOpen(prev => ({ ...prev, [review.id]: true }))} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    <MessageSquare className="w-4 h-4" /> Reply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
