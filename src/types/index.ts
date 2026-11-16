export interface Flavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  color: string;
  secondaryColor: string;
  textColor: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  stats: {
    sweetness: number; // 1-100
    creaminess: number;
    crunch: number;
    fruitiness: number;
  };
  ingredients: string[];
  calories: number;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface ScoopOption {
  id: string;
  name: string;
  color: string;
  price: number;
  syrupColor: string;
  texturePattern?: string;
}

export interface ConeOption {
  id: string;
  name: string;
  price: number;
  color: string;
  bgClass: string;
  description: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  icon: string;
  price: number;
  color: string;
}

export interface CustomConeBuild {
  id: string;
  cone: ConeOption;
  scoops: ScoopOption[];
  toppings: ToppingOption[];
  totalPrice: number;
}

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  color: string;
  customDetails?: {
    coneName: string;
    scoopNames: string[];
    toppingNames: string[];
  };
}
