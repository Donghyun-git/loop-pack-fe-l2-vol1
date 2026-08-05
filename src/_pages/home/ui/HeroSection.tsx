import type { ReactNode } from 'react';

import styles from './HeroSection.module.css';

/**
 * Hero 의 뼈대. 배경 이미지와 문구가 놓일 자리만 잡고, 문구는 children 으로 받는다.
 *
 * 데이터를 받지 않는다. 이미지 src 는 홈 데이터와 무관한 정적 경로이고,
 * 데이터에 묶이는 것은 문구뿐이다. 둘을 한 컴포넌트에 두면 문구를 기다리는 동안
 * 이미지가 초기 HTML 에 실리지 못해 브라우저가 발견하는 시점까지 함께 밀린다.
 */
export function HeroSection({ children }: { children: ReactNode }) {
  return (
    <section className={styles.hero} aria-label="이번 주의 추천 배너">
      {/* eslint-disable-next-line @next/next/no-img-element -- Week 7 intentionally starts with an unoptimized LCP image. */}
      <img className={styles.image} src="/images/week-07/hero-original.jpg" alt="" width={3840} height={2160} />
      <div className={styles.copy}>{children}</div>
    </section>
  );
}
