import React, { useState } from 'react';
import { Star, Flag, MessageSquare, ChevronDown } from 'lucide-react';

const reviews = [
  { id: 1, customer: 'Rahul Sharma', rating: 5, text: 'Amazing food! The chicken burger was perfectly cooked and the delivery was super fast. Will definitely order again!', date: 'Mar 31, 2026', order: 'Order #1024', replied: false },
  { id: 2, customer: 'Priya Patel', rating: 4, text: 'Good food but the packaging could be better. Pizza was a little cold on arrival. Overall a good experience.', date: 'Mar 30, 2026', order: 'Order #1019', replied: true, reply: 'Thank you for your feedback, Priya! We\'ve noted your concern about packaging and will improve it.' },
  { id: 3, customer: 'Amit Kumar', rating: 5, text: 'Best biryani in Bengaluru! Generous portions, great taste. Highly recommended.', date: 'Mar 29, 2026', order: 'Order #1015', replied: false },
  { id: 4, customer: 'Sneha Reddy', rating: 3, text: 'The salad was okay but it took 45 minutes. Expected faster delivery for a salad.', date: 'Mar 28, 2026', order: 'Order #1012', replied: false },
  { id: 5, customer: 'Kiran Mehta', rating: 5, text: 'Excellent service and food! The paneer wrap was fresh and flavorful. Love this place.', date: 'Mar 27, 2026', order: 'Order #1009', replied: true, reply: 'Thank you Kiran! We\'re glad you enjoyed it. Come back soon!' },
];

const RatingStars: React.FC<{ rating: number; size?: string }> = ({ rating, size = 'w-4 h-4' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`${size} ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-emerald-700'}`} />
    ))}
  </div>
);

export const VendorReviews: React.FC = () => {
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<number, boolean>>({});
  const [reviewList, setReviewList] = useState(reviews);
  const [filter, setFilter] = useState('All');

  const avgRating = (reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length).toFixed(1);

  const submitReply = (id: number) => {
    if (!replies[id]?.trim()) return;
    setReviewList(prev => prev.map(r => r.id === id ? { ...r, replied: true, reply: replies[id] } : r));
    setReplyOpen(prev => ({ ...prev, [id]: false }));
    setReplies(prev => ({ ...prev, [id]: '' }));
  };

  const filtered = reviewList.filter(r => {
    if (filter === 'All') return true;
    if (filter === '5 Stars') return r.rating === 5;
    if (filter === '4 Stars') return r.rating === 4;
    if (filter === 'Low') return r.rating <= 3;
    if (filter === 'Replied') return r.replied;
    if (filter === 'Pending') return !r.replied;
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-2xl font-bold">Customer Reviews</h1>
        <p className="text-emerald-400 text-sm mt-1">Monitor and respond to customer feedback</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 col-span-2 md:col-span-1 flex items-center gap-4">
          <div>
            <p className="text-yellow-400 text-4xl font-bold">{avgRating}</p>
            <RatingStars rating={Math.round(parseFloat(avgRating))} />
            <p className="text-emerald-500 text-xs mt-1">{reviewList.length} reviews</p>
          </div>
        </div>
        {[
          { label: '5 Star', count: reviewList.filter(r => r.rating === 5).length, color: 'text-yellow-400' },
          { label: '4 Star', count: reviewList.filter(r => r.rating === 4).length, color: 'text-emerald-400' },
          { label: 'Pending Reply', count: reviewList.filter(r => !r.replied).length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
            <p className="text-emerald-500 text-xs">{s.label}</p>
            <p className={`${s.color} text-2xl font-bold mt-1`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', '5 Stars', '4 Stars', 'Low', 'Replied', 'Pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm transition-all ${filter === f ? 'bg-emerald-500 text-white' : 'bg-emerald-900 border border-emerald-800 text-emerald-400 hover:bg-emerald-800'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold">
                  {r.customer.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{r.customer}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <RatingStars rating={r.rating} />
                    <span className="text-emerald-500 text-xs">{r.date}</span>
                  </div>
                </div>
              </div>
              <span className="text-emerald-600 text-xs font-mono">{r.order}</span>
            </div>

            <p className="text-emerald-200 text-sm mt-3 leading-relaxed">{r.text}</p>

            {r.replied && r.reply && (
              <div className="mt-3 ml-4 p-3 bg-emerald-800/60 border-l-2 border-emerald-500 rounded-r-xl">
                <p className="text-emerald-400 text-xs font-medium mb-1">Your Reply</p>
                <p className="text-emerald-200 text-sm">{r.reply}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              {!r.replied && (
                <button onClick={() => setReplyOpen(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
                  <MessageSquare className="w-4 h-4" /> Reply
                </button>
              )}
              <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 text-sm transition-colors">
                <Flag className="w-4 h-4" /> Report
              </button>
            </div>

            {replyOpen[r.id] && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replies[r.id] || ''}
                  onChange={e => setReplies(prev => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="Write a professional reply..."
                  rows={3}
                  className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder-emerald-600"
                />
                <div className="flex gap-2">
                  <button onClick={() => submitReply(r.id)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">
                    Post Reply
                  </button>
                  <button onClick={() => setReplyOpen(prev => ({ ...prev, [r.id]: false }))}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 text-sm rounded-xl transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
