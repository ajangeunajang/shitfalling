'use client';

import { useEffect } from 'react';

export default function MultilingualProvider({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadMultilingual = async () => {
        try {
          // jQuery 로드
          if (!window.$) {
            const jQuery = await import('jquery');
            window.$ = window.jQuery = jQuery.default;
          }

          // multilingual.js 로드
          const MultiLingual = await import('multilingual.js');

          // 모든 텍스트 요소에 multilingual 적용
          const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, div, span'
          );

          console.log('Multilingual 적용 대상 요소 수:', textElements.length);

          if (window.$ && window.$.fn.multilingual) {
            window.$(textElements).multilingual(['ko']);
            console.log('jQuery multilingual 적용 완료');
          } else {
            // vanilla JS 방식으로 사용
            var ml = new MultiLingual.default({
              containers: textElements,
              configuration: ['ko'],
            });
            console.log('Vanilla JS multilingual 적용 완료');
          }
        } catch (error) {
          console.error('multilingual.js 로드 중 오류:', error);
        }
      };

      // DOM이 로드된 후 실행
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadMultilingual);
      } else {
        loadMultilingual();
      }
    }
  }, []);

  return <>{children}</>;
}
