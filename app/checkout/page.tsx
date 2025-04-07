'use client';

import { redirect } from 'next/navigation';

export default function CheckoutPage() {
  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <h1 className='mt-32 text-2xl font-bold'>Domestic Checkout Page</h1>

      <button
        className='rounded-md bg-blue-500 px-4 py-2 text-white'
        onClick={() => redirect('/')}>
        Go back home
      </button>
    </div>
  );
}
