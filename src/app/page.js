'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from './components/Footer';
import Header from './components/Header';
import MultilingualProvider from './components/MultilingualProvider';

export default function Home() {
  const [mouseX, setMouseX] = useState(0);
  const [poops, setPoops] = useState([]);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false); // 게임 종료 상태 추가
  const [showImage, setShowImage] = useState(false); // 이미지 표시 상태 추가
  const [fallenPoops, setFallenPoops] = useState([]); // 바닥에 떨어진 똥들 추가
  const [gameFailed, setGameFailed] = useState(false); // 게임 실패 상태 추가

  // 개선 방안 - 상수로 분리
  const GAME_CONFIG = {
    // 엔딩 점수 컷
    SUCCESS_SCORE: 1000,
    FAIL_POOP_COUNT: 50,

    POOP_GENERATION_INTERVAL: 1000,
    COLLISION_CHECK_INTERVAL: 100,
    BG_dark: 500,
    BG_98: 600,
    BG_sea: 800,
    BG_universe: 900,
  };

  // 점수에 따른 배경 이미지 변경 함수
  const getBackgroundImage = (score) => {
    if (score >= GAME_CONFIG.SUCCESS_SCORE) return '/img/bg.webp';
    if (score >= GAME_CONFIG.BG_universe) return '/img/bg4.png';
    if (score >= GAME_CONFIG.BG_sea) return '/img/bg5.png';
    if (score >= GAME_CONFIG.BG_98) return '/img/bg98.png';
    if (score >= GAME_CONFIG.BG_dark) return '/img/bg1.png';
    return 'none'; // 기본 배경
  };

  // 점수에 따른 캐릭터 결정 함수
  const getCharacterEmoji = (score) => {
    if (score >= 950) return '🧚'; // 8점 이상이면 요정
    return '🧍🏻‍♀️'; // 기본
  };

  // (성공엔딩) 점수가 1000점이 되면 게임 종료
  useEffect(() => {
    if (score >= GAME_CONFIG.SUCCESS_SCORE && !gameEnded && !gameFailed) {
      setGameEnded(true);
      // 똥 생성 중단
      setPoops([]);
    }
  }, [score, gameEnded, gameFailed]);

  // (실패엔딩) 바닥에 떨어진 똥이 50개가 되면 게임 실패
  useEffect(() => {
    if (
      fallenPoops.length >= GAME_CONFIG.FAIL_POOP_COUNT &&
      !gameFailed &&
      !gameEnded
    ) {
      setGameFailed(true);
      // 똥 생성 중단
      setPoops([]);
    }
  }, [fallenPoops.length, gameFailed, gameEnded]);

  // 게임 재시작 함수
  const restartGame = () => {
    setScore(0);
    setPoops([]);
    setGameEnded(false);
    setGameFailed(false);
    setFallenPoops([]);
  };

  //캐릭터 움직임 x축
  useEffect(() => {
    const handlePointerMove = (e) => {
      setMouseX(e.clientX);
    };

    const handleTouchMove = (e) => {
      e.preventDefault(); // 스크롤 방지
      const touch = e.touches[0];
      setMouseX(touch.clientX);
    };

    // 포인터 이벤트 (마우스 + 터치)
    window.addEventListener('pointermove', handlePointerMove);

    // 터치 이벤트 (모바일 최적화)
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  //똥 랜덤 생성
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLeft = Math.random() * window.innerWidth; // 화면 너비 내에서 랜덤
      const newPoop = {
        id: Date.now(),
        left: randomLeft,
        top: 0,
        isFallen: false,
      };

      setPoops((prev) => [...prev, newPoop]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 점수 카운트 - 똥과 사람의 충돌 감지
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
          personRect.top - 50 < poopRect.bottom && // 사람의 위쪽이 똥의 아래쪽보다 위
          personRect.bottom - 50 > poopRect.top // 사람의 아래쪽이 똥의 위쪽보다 아래
        ) {
          // 점수 증가
          setScore((prev) => prev + 1);
          // 이미지 표시 시작
          setShowImage(true);
          // 충돌된 똥 제거
          setPoops((prev) => prev.filter((p) => p.id !== poop.id));
        }
      });
    };

    const collisionInterval = setInterval(checkCollision, 100);
    return () => clearInterval(collisionInterval);
  }, [poops]);

  // 목숨 카운트 - 똥이 바닥에 도달했는지 확인하고 fallenPoops에 추가
  useEffect(() => {
    const checkFallenPoops = () => {
      poops.forEach((poop) => {
        const poopElement = document.querySelector(
          `[data-poop-id="${poop.id}"]`
        );
        if (!poopElement) return;

        const poopRect = poopElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 똥이 바닥에 도달했는지 확인 (화면 하단에서 약간 위)
        if (poopRect.bottom >= windowHeight * 0.8 && !poop.isFallen) {
          // 바닥에 떨어진 똥을 fallenPoops에 추가하고 isFallen 플래그 설정
          setFallenPoops((prev) => [...prev, poop]);
          setPoops((prev) =>
            prev.map((p) => (p.id === poop.id ? { ...p, isFallen: true } : p))
          );
        }
      });
    };

    const fallenInterval = setInterval(checkFallenPoops, 100);
    return () => clearInterval(fallenInterval);
  }, [poops]);

  // 점수 +1 이미지 표시 - 일정 시간 후에 숨기기
  useEffect(() => {
    if (showImage) {
      const timer = setTimeout(() => {
        setShowImage(false);
      }, 500); // 0.5초 동안 표시

      return () => clearTimeout(timer);
    }
  }, [showImage]);

  // (실패엔딩) 엔딩 화면 ui
  if (gameFailed) {
    return (
      <MultilingualProvider>
        <div className="text-white text-center flex flex-col h-screen w-full text-foreground">
          <Header />
          <Footer />

          <div className="text-shadow-lg score text-[3rem] mt-4 sm:mt-10 leading-none">
            {score}
          </div>

          <div className="flex-1 flex flex-col justify-between w-full bottom-[10vh] sm:bottom-1/7 text-center leading-none">
            <span className="flex-1 flex items-end justify-center">
              <span className="text-shadow-lg leading-snug">
                아... <br /> 당신은 유명해지지 못하셨군요 💩
              </span>
            </span>
            <div className="pb-[10vh]">
              <div className="text-[4rem] sm:text-[6rem] mt-8 mb-4">🪦</div>
              <button
                onClick={restartGame}
                className="h-12 bg-white text-black p-4 mr-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                괜찮아~ 잘 될거야
              </button>
            </div>
          </div>
        </div>
      </MultilingualProvider>
    );
  }

  // (성공엔딩) 엔딩 화면 ui
  if (gameEnded) {
    return (
      <MultilingualProvider>
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
          <Header />
          <Footer />

          <div className="text-shadow-lg score text-[3rem] mt-10 leading-none">
            1k
          </div>
          <div className="flex-1 flex flex-col justify-between w-full bottom-[10vh] sm:bottom-1/7 text-center leading-none">
            <h3 className="text-shadow-lg leading-snug text-[3rem]">The End</h3>
            <span className="flex-1 flex items-end justify-center">
              <span className="text-shadow-lg leading-snug">
                🎉 축하합니다 <br />
                당신은 이제 유명한 사람이 되었습니다!
              </span>
            </span>
            <div className="pb-[9vh]">
              <div className="text-[4rem] sm:text-[6rem] my-4">👑</div>
              <button
                onClick={restartGame}
                className="h-12 bg-white text-black p-4 m-1 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                왕관의 무게 벗어던지다
              </button>
              <Link
                href="https://idolstarwiki.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block m-1 h-12 bg-[#e42a8a] text-white p-4 rounded-lg font-bold hover:bg-[#a23e92] transition-colors"
              >
                슈퍼스타가 되다.. 나무위키 작성하기
              </Link>
            </div>
          </div>
        </div>
      </MultilingualProvider>
    );
  }

  return (
    <MultilingualProvider>
      <div
        className="text-white text-center flex flex-col h-screen w-full text-foreground"
        style={{
          backgroundImage: `url(${getBackgroundImage(score)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full">
          <Header />

          {/* 똥들 */}
          {poops.map((poop) => (
            <span
              key={poop.id}
              data-poop-id={poop.id}
              className={`fixed text-[3rem] ${
                poop.isFallen ? 'animate-none' : 'animate-fall'
              }`}
              style={{
                left: `${poop.left}px`,
                top: poop.isFallen
                  ? `${window.innerHeight * 0.8}px`
                  : `${poop.top}px`,
              }}
            >
              💩
            </span>
          ))}

          {/* 캐릭터 */}
          <span
            className=" fixed bottom-1/5 left-1/2 text-[10rem] transition-transform duration-100 flex flex-col items-center"
            style={{
              left: `${mouseX}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <svg
              className="mb-26 transition-opacity duration-300"
              style={{ opacity: showImage ? 1 : 0 }}
              width="62"
              height="37"
              viewBox="0 0 62 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M54.44 0H6.85C3.06685 0 0 3.06685 0 6.85V29.79C0 33.5732 3.06685 36.64 6.85 36.64H54.44C58.2231 36.64 61.29 33.5732 61.29 29.79V6.85C61.29 3.06685 58.2231 0 54.44 0Z"
                fill="#FF1F77"
              />
              <path
                d="M41.22 12.64C41.52 12.59 41.89 12.48 42.31 12.32C42.73 12.15 43.18 11.98 43.64 11.79C44.1 11.61 44.56 11.44 45.01 11.29C45.46 11.14 45.86 11.05 46.21 11.04C46.39 11.04 46.54 11.06 46.67 11.09C46.8 11.12 46.92 11.15 47.03 11.19C47.09 11.22 47.13 11.33 47.14 11.51C47.14 11.69 47.15 11.8 47.15 11.83C47.18 12.71 47.17 13.54 47.1 14.33C47.04 15.11 46.94 15.91 46.81 16.71C46.78 17.29 46.75 17.87 46.74 18.46C46.72 19.05 46.68 19.63 46.62 20.19C46.6 20.27 46.59 20.41 46.58 20.61C46.58 20.81 46.57 21.02 46.57 21.23C46.57 21.44 46.57 21.65 46.58 21.84C46.58 22.03 46.6 22.17 46.62 22.25C46.6 22.46 46.62 22.63 46.68 22.77C46.74 22.91 46.82 23.03 46.94 23.13C47.06 23.23 47.2 23.33 47.36 23.42C47.52 23.51 47.7 23.61 47.89 23.72C48.08 23.85 48.31 23.97 48.56 24.09C48.82 24.21 49.02 24.33 49.16 24.46C49.38 24.68 49.46 24.89 49.4 25.07C49.34 25.25 49.14 25.36 48.82 25.39C48.64 25.39 48.46 25.33 48.28 25.21C48.1 25.09 47.92 25.01 47.74 24.98C47.56 24.96 47.42 24.95 47.31 24.94C47.2 24.94 47.09 24.93 46.97 24.93C46.85 24.93 46.74 24.93 46.62 24.92C46.5 24.92 46.36 24.89 46.2 24.86C45.85 24.8 45.44 24.78 44.98 24.82C44.52 24.86 44.06 24.91 43.6 24.98C43.14 25.04 42.72 25.08 42.32 25.1C41.92 25.12 41.62 25.05 41.41 24.91C41.19 24.8 41.05 24.68 40.99 24.56C40.93 24.44 40.93 24.32 40.99 24.21C41.05 24.1 41.15 23.99 41.29 23.89C41.43 23.79 41.6 23.69 41.79 23.61C42.21 23.42 42.77 23.23 43.47 23.06C43.6 22.85 43.7 22.56 43.77 22.2C43.84 21.83 43.9 21.43 43.94 20.99C43.98 20.55 44 20.09 44.01 19.61C44.01 19.13 44.02 18.67 44.02 18.22C44.02 17.77 44.02 17.36 44.01 16.98C44 16.6 44 16.3 44 16.06C44.02 15.84 44.02 15.65 44.02 15.51V14.75C44.02 14.63 44.04 14.48 44.07 14.31C44.07 14.29 44.07 14.24 44.06 14.15C44.06 14.06 44.04 13.97 44.02 13.86C44 13.76 43.99 13.66 43.98 13.57C43.98 13.48 43.96 13.44 43.94 13.44C43.76 13.41 43.6 13.42 43.45 13.48C43.3 13.54 43.15 13.61 43.01 13.7C42.87 13.79 42.71 13.87 42.55 13.94C42.39 14.01 42.23 14.05 42.07 14.05C41.83 14.05 41.62 14.03 41.45 13.99C41.27 13.95 41.15 13.82 41.07 13.59C41.01 13.41 40.98 13.23 41 13.04C41.02 12.85 41.09 12.72 41.22 12.66V12.64Z"
                fill="white"
              />
              <path
                d="M21.37 18.32C24.032 18.32 26.19 16.162 26.19 13.5C26.19 10.838 24.032 8.68 21.37 8.68C18.708 8.68 16.55 10.838 16.55 13.5C16.55 16.162 18.708 18.32 21.37 18.32Z"
                fill="white"
              />
              <path
                d="M21.37 29.54C27.18 29.54 31.89 27.382 31.89 24.72C31.89 22.058 27.18 19.9 21.37 19.9C15.56 19.9 10.85 22.058 10.85 24.72C10.85 27.382 15.56 29.54 21.37 29.54Z"
                fill="white"
              />
            </svg>
            <span className="person">{getCharacterEmoji(score)}</span>
          </span>
        </div>
        <Footer />

        {/* 점수 표시 */}
        <div className="text-shadow-lg score text-[3rem] mt-10">{score}</div>
      </div>
    </MultilingualProvider>
  );
}
