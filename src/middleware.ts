/* eslint-disable boundaries/no-unknown-files -- Next 규약 파일이라 FSD 레이어에 속하지 않는다. 계측이 끝나면 삭제한다. */
import { type NextRequest, NextResponse } from 'next/server';

/**
 * ⚠️ 계측용 임시 파일 — 3단계 측정을 마치면 삭제한다.
 *
 * Route Handler 가 실제로 처리한 횟수를 센다.
 * `src/app/api/**` 는 과제 제공 코드라 수정할 수 없어 요청이 들어오는 자리에서 셌다.
 *
 * 서버가 보내는 `fetch('http://localhost:3000/api/home')` 은 자기 자신에게 보내는
 * 진짜 HTTP 요청이라 다시 들어올 때 여기를 통과한다.
 * Next 의 fetch memoization 은 요청을 보내기 전에 중복을 제거하므로,
 * 여기 도달한 횟수가 곧 Route Handler 도달 횟수다.
 * (apiClient 에 카운터를 넣으면 memoization 이전을 세게 되어 홈에서 2가 나온다.)
 *
 * 측정 결과와 근거는 docs/rfc/week07-performance.md 0장 ④ · 4장 참조.
 */
const counts = new Map<string, number>();

export function middleware(request: NextRequest) {
  const key = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const seen = (counts.get(key) ?? 0) + 1;
  counts.set(key, seen);

  console.error(`[count] ${seen}  ${key}`);

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
