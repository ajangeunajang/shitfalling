'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [poops, setPoops] = useState([]);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false); // 게임 종료 상태 추가

  // 점수에 따른 배경 이미지 결정 함수
  const getBackgroundImage = (score) => {
    // if (score >= 900) return '/img/bg4.png';
    // if (score >= 800) return '/img/bg5.png';
    // if (score >= 700) return '/img/bg98.png';
    // if (score >= 500) return '/img/bg1.png';

    if (score >= 10) return '/img/bg.webp';
    if (score >= 8) return '/img/bg4.png';
    if (score >= 6) return '/img/bg5.png';
    if (score >= 4) return '/img/bg98.png';
    if (score >= 2) return '/img/bg1.png';
    return 'none'; // 기본 배경
  };

  // 점수에 따른 캐릭터 이모지 결정 함수
  const getCharacterEmoji = (score) => {
    if (score >= 8) return '🧚'; // 8점 이상이면 요정
    return '🧍🏻‍♀️'; // 기본은 사람
  };

  // 점수가 10점이 되면 게임 종료
  useEffect(() => {
    if (score >= 10 && !gameEnded) {
      setGameEnded(true);
      // 똥 생성 중단
      setPoops([]);
    }
  }, [score, gameEnded]);

  // 게임 재시작 함수
  const restartGame = () => {
    setScore(0);
    setPoops([]);
    setGameEnded(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLeft = Math.random() * (window.innerWidth - 100); // 화면 너비 내에서 랜덤
      const newPoop = {
        id: Date.now(),
        left: randomLeft,
        top: 0,
      };

      setPoops((prev) => [...prev, newPoop]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 똥과 사람의 충돌 감지
  useEffect(() => {
    const checkCollision = () => {
      const personElement = document.querySelector('.person');
      if (!personElement) return;

      const personRect = personElement.getBoundingClientRect();

      poops.forEach((poop) => {
        const poopElement = document.querySelector(
          `[data-poop-id="${poop.id}"]`
        );
        if (!poopElement) return;

        const poopRect = poopElement.getBoundingClientRect();

        // 충돌 감지
        if (
          personRect.left < poopRect.left && // 사람의 왼쪽이 똥의 오른쪽보다 왼쪽
          personRect.right > poopRect.right && // 사람의 오른쪽이 똥의 왼쪽보다 오른쪽
          personRect.top - 100 < poopRect.bottom && // 사람의 위쪽이 똥의 아래쪽보다 위
          personRect.bottom > poopRect.top // 사람의 아래쪽이 똥의 위쪽보다 아래
        ) {
          // 점수 증가
          setScore((prev) => prev + 1);
          // 충돌된 똥 제거
          setPoops((prev) => prev.filter((p) => p.id !== poop.id));
        }
      });
    };

    const collisionInterval = setInterval(checkCollision, 100);
    return () => clearInterval(collisionInterval);
  }, [poops]);

  // 게임 종료 시 엔딩 화면
  if (gameEnded) {
    return (
      <div
        className="text-white text-center flex flex-col h-screen w-full text-foreground"
        style={{
          backgroundImage: `url(${getBackgroundImage(10)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          // backdropFilter: 'blur(10px)',
          // WebkitBackdropFilter: 'blur(10px)', // Safari 지원
        }}
      >
        <div className="w-full pt-8">
          <h1 className="text-[6rem] leading-snug">Shitfalling</h1>
          <h2>(1) 유명해진다 (2) 똥을 싸라</h2>
          <div
            className="fixed right-[0.5rem] top-[0.5rem] w-[2rem] h-[2rem] border-2 border-white rounded-[100px] flex items-center justify-center"
            onClick={() => setShowPopup(!showPopup)}
          >
            <span className="text-white text-[2rem] pt-[3px] pr-[2px]">i</span>
          </div>

          <div
            className={`${
              showPopup ? 'opacity-100' : 'opacity-0'
            } z-10 break-keep p-4 text-left fixed right-[0.5rem] top-[3rem] w-[20vw] min-w-[300px] bg-gray-300 rounded-lg shadow-2xl transition-opacity duration-300`}
          >
            <div>똥을 싸면서 박수를 치면 유명해질 것이다</div>
            <div>똥을 치면 박수를 싼다</div>
            <div>박수를 싸면 유명해져서 똥을 칠 것이다</div>
          </div>
        </div>
        <footer className="w-full">
          <div>© 2025. 유명해지는 법. 모든 권리 보유.</div>
          <div>문의 ajangeunajang@gmail.com 인스타그램 @ajangeunajang</div>
          <div>(1) 똥을 싸라 (2) 유명해진다</div>
        </footer>

        <div className="score text-[3rem] mt-10 leading-none">1k</div>

        <div className="text-center mt-10 leading-none">
          <h3 className="leading-snug text-[3rem]">The End</h3>
          <span className="border-b-2 text-blue-700 text-shadow-lg leading-snug">
            🎉 <span className="ml-ko">축하합니다</span>
          </span>
          <br />
          <span className="border-b-2 text-blue-700 text-shadow-lg leading-snug">
            <span className="ml-ko">당신은 이제 유명한 사람이 되었습니다</span>!
          </span>
          <div className="text-[6rem] mt-12">👑</div>
          <button
            onClick={restartGame}
            className="bg-white text-black p-4 pt-5 mr-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
          >
            다시 시작하기
          </button>
          <Link
            href="https://idolstarwiki.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e42a8a] text-white p-4 pt-5 rounded-lg font-bold hover:bg-[#a23e92] transition-colors"
          >
            아이돌스타위키 작성하기
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div
      className="text-white text-center flex flex-col h-screen w-full text-foreground"
      style={{
        backgroundImage: `url(${getBackgroundImage(score)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full pt-8">
        <h1 className="text-[6rem] leading-snug">Shitfalling</h1>
        <h2>(1) 유명해진다 (2) 똥을 싸라</h2>
        <div
          className="fixed right-[0.5rem] top-[0.5rem] w-[2rem] h-[2rem] border-2 border-white rounded-[100px] flex items-center justify-center"
          onClick={() => setShowPopup(!showPopup)}
        >
          <span className="text-white text-[2rem] pt-[3px] pr-[2px]">i</span>
        </div>

        <div
          className={`${
            showPopup ? 'opacity-100' : 'opacity-0'
          } z-10 break-keep p-4 text-left fixed right-[0.5rem] top-[3rem] w-[20vw] min-w-[300px] bg-gray-300 rounded-lg shadow-2xl transition-opacity duration-300`}
        >
          <div>똥을 싸면서 박수를 치면 유명해질 것이다</div>
          <div>똥을 치면 박수를 싼다</div>
          <div>박수를 싸면 유명해져서 똥을 칠 것이다</div>
        </div>

        {/* 똥들 */}
        {poops.map((poop) => (
          <span
            key={poop.id}
            data-poop-id={poop.id}
            className="fixed text-[3rem] animate-fall"
            style={{ left: `${poop.left}px` }}
          >
            💩
          </span>
        ))}

        {/* 사람 이모지 */}
        <span
          className="person fixed bottom-1/5 left-1/2 text-[10rem] transition-transform duration-100"
          style={{
            left: `${mouseX}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {getCharacterEmoji(score)}
        </span>
      </div>
      <footer className="w-full">
        <div>© 2025. 유명해지는 법. 모든 권리 보유.</div>
        <div>문의 ajangeunajang@gmail.com 인스타그램 @ajangeunajang</div>
        <div>(1) 똥을 싸라 (2) 유명해진다</div>
      </footer>
      {/* 점수 표시 */}
      <div className="score text-[3rem] mt-10">{score}</div>
    </div>
  );
}
