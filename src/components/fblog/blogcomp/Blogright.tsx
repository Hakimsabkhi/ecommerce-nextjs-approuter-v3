import React from 'react'

const Blogright = () => {
  return (
    <div className='w-[300px] flex flex-col gap-10 max-lg:hidden'>
    <div className='flex flex-col gap-4'>
        <p className='text-4xl font-bold'>Search</p>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5" placeholder="Search..." required />
    </div>
    <div className='flex flex-col gap-4'>
        <p className='text-4xl font-bold'>Categories</p>
        <div className='flex flex-col gap-2'>
            <p className='text-blue-600 underline cursor-pointer'>Web Design</p>
            <p className='text-blue-600 underline cursor-pointer'>Freebies</p>
            <p className='text-blue-600 underline cursor-pointer'>JavaScript</p>
        </div>
    </div>
    <div className='flex flex-col gap-4'>
        <p className='text-4xl font-bold'>Side Widget</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, ipsam, eligendi, in quo sunt possimus non incidunt odit vero aliquid similique quaerat nam nobis illo aspernatur vitae fugiat numquam repellat.</p>
    </div>
</div>
  )
}

export default Blogright