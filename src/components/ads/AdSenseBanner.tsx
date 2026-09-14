import React, { useEffect } from 'react';
import { isElectron } from '../../utils/platform';

/**
 * Google AdSense 하단 배너 컴포넌트 (웹 전용)
 * 
 * [역할 및 설계 의도]
 * 1. 웹(Web Browser) 환경에서만 작동하며, 데스크톱(Electron) 앱에서는 완전히 렌더링되지 않습니다.
 * 2. 스케줄 영역 하단에 고정된 크기(728x90 등 표준 배너 규격)로 독립된 박스를 구성하여
 *    상단 스케줄 리스트와 겹치거나 레이아웃이 깨지지 않도록 분리합니다.
 * 3. 사용자 요청에 따라 현재는 위치와 크기를 직접 확인할 수 있도록 임시 파란색(bg-blue-600)으로 표시됩니다.
 *    (추후 "원래색으로 바꿔줘" 요청 시 bg-transparent 또는 bg-white/dark:bg-slate-900으로 전환 가능)
 * 4. Google AdSense 비동기 스크립트(ca-pub-9376850026832369)를 웹 환경의 document.head에 자동 주입합니다.
 */
export const AdSenseBanner: React.FC = () => {
  // 데스크톱(Electron) 환경에서는 광고를 일절 렌더링하지 않고 스크립트도 로드하지 않음
  if (isElectron) {
    return null;
  }

  // 웹 환경에서만 Google AdSense 스크립트 동적 로드
  useEffect(() => {
    if (typeof window === 'undefined' || (window as any).electronAPI) return;

    const scriptSrc = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9376850026832369';
    const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptSrc;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <aside
      id="google-adsense-bottom-area"
      aria-label="광고 영역"
      className="flex-shrink-0 w-full flex items-center justify-center p-2 z-10 select-none border-t border-slate-200/60 dark:border-slate-800/60 bg-transparent"
      style={{ minHeight: '90px', height: '90px' }}
    >
      <div className="w-full max-w-[728px] h-full flex items-center justify-center">
        {/* 
          구글 애드센스 광고 단위(ins 태그) 위치:
          <ins className="adsbygoogle"
               style={{ display: 'inline-block', width: '728px', height: '90px' }}
               data-ad-client="ca-pub-9376850026832369"
               data-ad-slot="YOUR_SLOT_ID"></ins>
        */}
      </div>
    </aside>
  );
};
