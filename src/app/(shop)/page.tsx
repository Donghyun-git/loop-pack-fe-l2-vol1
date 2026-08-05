import { Suspense } from 'react';

import { homeQueryOptions } from '@/_pages/home/api/homeQueries';
import { HeroCopy, HeroCopyFallback } from '@/_pages/home/ui/HeroCopy';
import { HeroSection } from '@/_pages/home/ui/HeroSection';
import { HomePageBoundary } from '@/_pages/home/ui/HomePageBoundary';
import { getQueryClient } from '@/shared/api/queryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

/**
 * 홈
 * 요청마다 격리된 QueryClient로 홈 데이터를 prefetch 하고,
 * dehydrate, HydrationBoundary 로 클라이언트에 캐시를 전달한다.
 *
 * 경계는 데이터 소유권을 따른다. 홈 데이터를 기다려야 하는 것만 기다린다.
 * 페이지 제목·설명과 Hero 배경 이미지는 정적이라 초기 HTML 로 나가고,
 * Hero 문구와 카테고리·상품 목록만 Suspense 안에 둔다.
 *
 * prefetch 를 await 하지 않는다. await 하면 홈 API 응답이 끝날 때까지 HTML 자체가 나가지 못한다.
 * await 를 빼면 쿼리가 pending 상태로 dehydrate 되어 promise 째 전달되는데,
 * shared/api/queryClient.ts 의 shouldDehydrateQuery 가 pending 을 포함시키는 것이 그 전제다.
 */
export default function HomePage() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(homeQueryOptions.list());

  return (
    <>
      <section className="week05-section">
        <h1>추천 상품 둘러보기</h1>
        <p>인기 상품과 새로 들어온 상품을 카테고리별로 살펴보세요.</p>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className="week05-hero">
          <HeroSection>
            <Suspense fallback={<HeroCopyFallback />}>
              <HeroCopy />
            </Suspense>
          </HeroSection>
        </section>

        <HomePageBoundary />
      </HydrationBoundary>
    </>
  );
}
