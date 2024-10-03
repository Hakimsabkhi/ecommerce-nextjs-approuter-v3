
import Blog from '@/components/Blog';
import Blogbanner from '@/components/blogbanner';
import Giftcard from '@/components/giftcard';
import Giftcardbanner from '@/components/giftcardbanner';
import Question from '@/components/question';
import React from 'react';

const Page = () => {
    return (
        <div>
            <Giftcardbanner/>
            <Giftcard/>
            <Question/>
        </div>
    );
}

export default Page;