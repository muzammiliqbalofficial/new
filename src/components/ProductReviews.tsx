'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquare, Plus } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Ayesha Khan',
    city: 'Karachi',
    rating: 5,
    date: '3 days ago',
    title: 'Super soft cotton, very happy!',
    comment:
      'Received the hospital starter set yesterday in Karachi. The fabric is extremely soft pure cotton, stitching is very neat, and the packaging was lovely. Highly recommended for newborn baby.',
    verified: true,
  },
  {
    id: 2,
    name: 'Usman Malik',
    city: 'Lahore',
    rating: 5,
    date: '1 week ago',
    title: 'Fast delivery & exactly as shown in picture',
    comment:
      'Ordered 2 sets of baby rompers for my 3-month-old son. Delivered within 2 days in Lahore. Material is original combed cotton, perfectly fitting.',
    verified: true,
  },
  {
    id: 3,
    name: 'Fatima Zahra',
    city: 'Islamabad',
    rating: 5,
    date: '2 weeks ago',
    title: 'Best gift for newborn',
    comment:
      'Bought as a welcome gift for my sister’s baby. She loved it so much! Great quality and Cash on Delivery service was very smooth.',
    verified: true,
  },
  {
    id: 4,
    name: 'Zubair Ahmed',
    city: 'Rawalpindi',
    rating: 4,
    date: '3 weeks ago',
    title: 'Very good quality',
    comment:
      'Good quality baby clothes at reasonable prices compared to shopping malls. Will definitely order again in winter.',
    verified: true,
  },
];

export default function ProductReviews({ productName }: { productName: string }) {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: Date.now(),
      name: newName.trim(),
      city: newCity.trim() || 'Pakistan',
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim() || 'Verified Purchase',
      comment: newComment.trim(),
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setNewName('');
      setNewCity('');
      setNewTitle('');
      setNewComment('');
    }, 2000);
  };

  return (
    <section className="space-y-6 pt-10 border-t border-charcoal-border/60">
      {/* Header with overall rating summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-border/50 pb-6">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
            Verified Customer Reviews
          </h3>
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-extrabold text-charcoal text-sm">4.9 / 5.0</span>
            <span className="text-charcoal-muted">• ({reviews.length + 38} Verified Buyers across Pakistan)</span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-brand-soft hover:bg-brand text-brand hover:text-white font-extrabold text-xs rounded-xl border border-brand/30 transition-all flex items-center justify-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 bg-cream-50 rounded-3xl border border-charcoal-border/70 space-y-4 text-xs">
          <h4 className="font-extrabold text-sm text-charcoal">Write a Review for &ldquo;{productName}&rdquo;</h4>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center space-x-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your verified review has been submitted.</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-charcoal block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ayesha K."
                    className="w-full px-3 py-2 bg-white rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-charcoal block">Your City in Pakistan</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Karachi / Lahore / Islamabad"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal block">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-charcoal-border'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal block">Review Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Very soft fabric & fast delivery"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal block">Your Experience / Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details about the fabric quality, stitching, delivery, or sizing..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-white text-charcoal font-bold rounded-xl border border-charcoal-border/70 hover:bg-cream-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand text-white font-bold rounded-xl shadow-card hover:bg-brand-dark transition-all"
                >
                  Submit Review
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 bg-white rounded-3xl border border-charcoal-border/70 shadow-soft space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-charcoal-muted font-medium">{rev.date}</span>
              </div>

              <h5 className="font-bold text-xs text-charcoal">{rev.title}</h5>
              <p className="text-xs text-charcoal-muted leading-relaxed">{rev.comment}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-charcoal-border/40 text-[11px]">
              <span className="font-extrabold text-charcoal">{rev.name} ({rev.city})</span>
              {rev.verified && (
                <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Buyer</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
