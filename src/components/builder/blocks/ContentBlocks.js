import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

export const GalleryBlock = ({ images = [], columns = 3, aspectRatio = '1/1' }) => {
    if (!images.length) {
        return <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-lg text-gray-500">Add images to gallery</div>;
    }

    return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {images.map((img, i) => (
                <div key={i} className="relative w-full overflow-hidden rounded-lg bg-gray-900" style={{ aspectRatio }}>
                    {/* Use simple img for now if next/image config is tricky with external urls, or next/image with logic */}
                    <img src={img} alt="" className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                </div>
            ))}
        </div>
    );
};

export const TestimonialsBlock = ({ items = [] }) => {
    if (!items.length) {
        return <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-lg text-gray-500">Add testimonials</div>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <Quote className="text-gray-600 mb-4" size={24} />
                    <p className="text-lg text-gray-300 mb-4">"{item.quote}"</p>
                    <div className="flex items-center gap-3">
                        {item.image && (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                                <img src={item.image} alt={item.author} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div>
                            <div className="font-semibold text-white">{item.author}</div>
                            <div className="text-sm text-gray-500">{item.role}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const StatsBlock = ({ items = [], style = 'minimal' }) => {
    if (!items.length) {
        return <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-lg text-gray-500">Add stats</div>;
    }

    return (
        <div className={`grid gap-8 ${style === 'cards' ? 'gap-4' : ''} grid-cols-2 md:grid-cols-4`}>
            {items.map((item, i) => (
                <div key={i} className={`text-center ${style === 'cards' ? 'p-6 bg-white/5 rounded-xl border border-white/10' : ''}`}>
                    <div className="text-4xl font-bold text-white mb-2">{item.value}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">{item.label}</div>
                </div>
            ))}
        </div>
    );
};
