'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full">
      <div>© 2025. 유명해지는 법. 모든 권리 보유. 디자인 및 개발 장은아</div>
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
          커피 사주기
        </Link>
      </div>
      <div>(1) 똥을 싸라 (2) 유명해진다</div>
    </footer>
  );
}
