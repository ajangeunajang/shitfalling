'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="sun ease-in-out duration-1000 transition-all fixed w-22 h-22 top-[-20vh] left-[-20vw]">
        <div className="text-[10rem] leading-none">☀️</div>
        <Image
          src="/img/sun.jpg"
          alt="sun"
          fill
          className="mix-blend-color-burn rounded-full object-cover translate-x-[40%] translate-y-[20%]"
        />
      </div>
      <div>
        © 2025. Shitfalling. 모든 권리 보유.{' '}
        <span
          className="cursor-pointer transition-all duration-300 hover:scale-105"
          onMouseEnter={() => {
            const sunElement = document.querySelector('.sun');
            if (sunElement) {
              sunElement.style.top = '60px';
              sunElement.style.left = '60px';
            }
          }}
          onMouseLeave={() => {
            const sunElement = document.querySelector('.sun');
            if (sunElement) {
              sunElement.style.top = '-150px';
              sunElement.style.left = '-200px';
              sunElement.style.transform = 'translateX(-50%)';
            }
          }}
        >
          디자인 및 개발 장은아
        </span>
      </div>
      <div className="no-underline">
        <a href="mailto:ajangeunajang@gmail.com">문의하기</a>{' '}
        ajangeunajang@gmail.com <br className=" sm:hidden" />
        <Link
          href="https://www.instagram.com/ajangeunajang/"
          target="_blank"
          rel="noopener noreferrer"
        >
          인스타그램 @ajangeunajang
        </Link>{' '}
        <Link
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block h-5 text-blue-700 mx-2 border-b hover:text-white transition-color duration-300"
        >
          개발자에게 커피 사주기
        </Link>
      </div>
      <div>(1) 똥을 싸라 (2) 유명해진다</div>
    </footer>
  );
}
