"use client";

import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LockedPage({ searchParams }) {
    // We can pass the username via query params if needed
    const { user } = searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center">
                <div className="bg-gray-900 p-8 flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Portfolio Locked</h1>
                    <p className="text-gray-300">
                        {user ? `@${user}` : 'This user'}'s portfolio is currently private.
                    </p>
                </div>

                <div className="p-8">
                    <div className="mb-8">
                        <p className="text-gray-600 mb-4">
                            The owner needs to activate their portfolio to make it visible to the world.
                        </p>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Want your own portfolio?
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Build a stunning 3D portfolio in minutes. Join thousands of creators on Profyld.
                        </p>

                        <Link href="/">
                            <Button fullWidth>
                                <Sparkles size={18} className="mr-2" />
                                Create My Portfolio
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-gray-400 text-sm">
                Powered by <strong>Profyld</strong>
            </div>
        </div>
    );
}
