import Aboutbanner from '@/components/aboutbanner';
import Aboutonlinestore from '@/components/aboutonlinestore';
import Teammembers from '@/components/teammembers';
import React from 'react';

export default function HomePage() {
  return (
    <div>
      <Aboutbanner/>
      <Aboutonlinestore />
      <Teammembers/>      
       
    </div>  

  );
}

