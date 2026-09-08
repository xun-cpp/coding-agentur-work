export const products = [
  { id: 'cappuccino', name: 'Cappuccino', cents: 420, kind: 'cup' },
  { id: 'espresso', name: 'Espresso', cents: 320, kind: 'espresso' },
  { id: 'water', name: 'Wasser', cents: 280, kind: 'bottle' },
  { id: 'croissant', name: 'Croissant', cents: 340, kind: 'pastry' },
] as const;

export type ProductId = (typeof products)[number]['id'];
export type Basket = Partial<Record<ProductId, number>>;
export type PaymentPhase = 'cart' | 'payment' | 'approved' | 'receipt';
export type PosState = { basket: Basket; phase: PaymentPhase };
export type PosAction =
  | { type: 'add' | 'remove'; id: ProductId }
  | { type: 'pay' | 'approve' | 'receipt' | 'reset' }
  | { type: 'frame'; frame: number };
export const initialPos: PosState = { basket: {}, phase: 'cart' };

export function totalCents(basket: Basket) {
  return products.reduce((total, product) => total + product.cents * (basket[product.id] ?? 0), 0);
}

export function currency(cents: number, language: 'de' | 'en' = 'de') {
  return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(
    cents / 100,
  );
}

const demoBaskets: readonly Basket[] = [
  {},
  { cappuccino: 1 },
  { cappuccino: 1, water: 1 },
  { cappuccino: 2, water: 1 },
];

export function posReducer(state: PosState, action: PosAction): PosState {
  switch (action.type) {
    case 'reset':
      return { basket: {}, phase: 'cart' };
    case 'frame': {
      const frame = ((action.frame % 7) + 7) % 7;
      return {
        basket: { ...demoBaskets[Math.min(frame, 3)] },
        phase: frame < 4 ? 'cart' : frame === 4 ? 'payment' : frame === 5 ? 'approved' : 'receipt',
      };
    }
    case 'add': {
      if (state.phase === 'payment') return state;
      const basket = state.phase === 'cart' ? state.basket : {};
      return { phase: 'cart', basket: { ...basket, [action.id]: Math.min((basket[action.id] ?? 0) + 1, 20) } };
    }
    case 'remove': {
      if (state.phase !== 'cart') return state;
      const basket = { ...state.basket };
      const count = basket[action.id] ?? 0;
      if (count <= 1) delete basket[action.id];
      else basket[action.id] = count - 1;
      return { ...state, basket };
    }
    case 'pay':
      return state.phase === 'cart' && totalCents(state.basket) > 0 ? { ...state, phase: 'payment' } : state;
    case 'approve':
      return state.phase === 'payment' ? { ...state, phase: 'approved' } : state;
    case 'receipt':
      return state.phase === 'approved' ? { ...state, phase: 'receipt' } : state;
  }
}
