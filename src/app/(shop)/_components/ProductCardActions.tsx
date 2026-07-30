'use client';

import { useCartStore } from '@/entities/cart';
import { useWishlistStore } from '@/entities/wishlist';

/**
 * 상품 카드의 담기·찜 행위 UI.
 *
 * ProductCard(entities)에서 떼어낸 행위를 임시로 모아둔 자리다.
 * S4 에서 features/add-to-cart 와 features/toggle-wishlist 두 슬라이스로 쪼갠다.
 * 그때까지는 홈과 목록이 같은 조합을 쓰도록 한 곳에 둔다.
 */
type ProductCardActionsProps = {
  productId: string;
  productName: string;
};

export function ProductCardActions({ productId, productName }: ProductCardActionsProps) {
  const wishList = useWishlistStore((state) => state.wishlist);
  const cart = useCartStore((state) => state.cart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const isWished = wishList.includes(productId);
  const isInCart = cart.includes(productId);

  return (
    <>
      <button
        type="button"
        aria-label={`${productName} 위시리스트`}
        aria-pressed={isWished}
        onClick={() => toggleWishlist(productId)}
      >
        {isWished ? '찜 해제' : '찜'}
      </button>
      <button
        type="button"
        aria-label={`${productName} 장바구니`}
        aria-pressed={isInCart}
        onClick={() => toggleCart(productId)}
      >
        {isInCart ? '담김' : '담기'}
      </button>
    </>
  );
}
