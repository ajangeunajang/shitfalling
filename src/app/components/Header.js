'use client';

import { useState } from 'react';
import MultilingualProvider from './MultilingualProvider';

export default function Header() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <MultilingualProvider>
      <header className="w-full pt-6">
        <h1 className="text-shadow-lg text-[22vw] sm:text-[6rem] leading-snug">
          Shitfalling
        </h1>
        <div>슈퍼스타가 되는 길.</div>
        <div
          className="box-shadow-lg fixed right-[0.5rem] top-[0.5rem] w-[2rem] h-[2rem] border-2 border-white rounded-[100px] flex items-center justify-center"
          onClick={() => setShowPopup(!showPopup)}
        >
          <span className="text-white text-[1.6rem] pt-[4px] pr-[2px] text-shadow-lg">
            i
          </span>
        </div>

        <div
          className={`${
            showPopup ? 'opacity-100' : 'opacity-0'
          } box-shadow-lg z-10 break-keep p-4 text-left fixed right-[0.5rem] top-[3rem] w-[20vw] min-w-[300px] bg-gray-300/40 rounded-lg shadow-2xl transition-opacity duration-300 backdrop-blur-md`}
        >
          <div>똥을 싸면서 박수를 치면 유명해질 것이다</div>
          <div>똥을 치면 박수를 싼다</div>
          <div>박수를 싸면 유명해져서 똥을 칠 것이다</div>
        </div>
      </header>
    </MultilingualProvider>
  );
}
