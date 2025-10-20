export interface Article {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  desc: string;
}

export interface CartItem extends Article {
  qty: number;
}

export interface User {
  id: number;
  email: string;
}

export interface AnalyticEvent {
  timestamp: string;
  type: string;
  articleId: number | null;
  userId: string;
}

export type MouseEventWithTarget = React.MouseEvent<HTMLElement> & {
  target: HTMLElement;
}