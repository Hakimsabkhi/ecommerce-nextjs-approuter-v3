
import Milanoshowroom from '@/components/milanoshowroom';
import Showroombanner from '@/components/showroombanner';
import Torinoshowroom from '@/components/torinoshowroom';
import React from 'react';
export default function HomePage() {
    return (
        <div>
            <Showroombanner />
            <Milanoshowroom />
            <Torinoshowroom />
        </div>

    );
}