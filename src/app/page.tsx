
import React from 'react';

export default function Home() {
  return (
    <>
      <div className="relative flex flex-col items-center pt-10">
        <h1 className="text-green-500 text-9xl">𝓒𝓪𝓻𝓸 𝓞𝓷𝓵𝓲𝓷𝓮</h1>
        <input className="mt-12 w-1/5 h-16 border text-2xl rounded-3xl bg-purple-800 px-5"
          placeholder="Nickname">

        </input>

        <button className="mt-10 w-40 h-20 text-3xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Play
        </button>
       
      </div>

    </>
  );
}
