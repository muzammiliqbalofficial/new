'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram, Heart, ArrowUpRight } from 'lucide-react';

const INSTA_POSTS = [
  {
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/638036604-1-14a7c588-700w.webp',
    likes: 142,
    caption: '10-Piece Hospital Starter Set in Pure Combed Cotton',
  },
  {
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/649530987-1-8329c9f1-700w.webp',
    likes: 98,
    caption: 'Soft Summer Rompers for Little Prince',
  },
  {
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/620053065-1-4cc74d34-700w.webp',
    likes: 185,
    caption: 'Turkish Style Princess Frock & Pajama Set',
  },
  {
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/597227883-1-a04a41fc-700w.webp',
    likes: 116,
    caption: 'Winter Soft Fleece Rompers & Warmers',
  },
  {
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/508238134-1-8fc70a00-700w.webp',
    likes: 74,
    caption: 'Pure Cotton Mittens, Booties & Caps Set',
  },
  {
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/1947660058-1-58fec28e-700w.webp',
    likes: 130,
    caption: 'Newborn Welcome to the World Gift Box',
  },
];

export default function InstagramFeed() {
  return (
    <section className="py-12 bg-white border-t border-charcoal-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand flex items-center justify-center sm:justify-start space-x-1">
              <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
              <span>@tinykids.pk on Instagram</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Follow Us & Tag Your Little Angels
            </h2>
          </div>
          <a
            href="https://instagram.com/tinykids.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-cream-50 hover:bg-cream-100 text-charcoal font-extrabold text-xs rounded-2xl border border-charcoal-border/80 shadow-xs transition-colors self-center sm:self-auto"
          >
            <span>Follow @tinykids.pk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-brand" />
          </a>
        </div>

        {/* 6-Col Instagram Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTA_POSTS.map((post, idx) => (
            <a
              key={idx}
              href="https://instagram.com/tinykids.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-3xl overflow-hidden bg-cream-100 border border-charcoal-border/60 shadow-soft block focus:outline-none"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-white text-center">
                <div className="flex items-center space-x-1 text-xs font-bold mb-1">
                  <Heart className="w-3.5 h-3.5 fill-current text-coral-light" />
                  <span>{post.likes}</span>
                </div>
                <p className="text-[10px] line-clamp-2 text-white/90 font-medium">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}