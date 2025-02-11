export type Locale = 'en' | 'ja';

export type Dictionary = {
  plans: {
    title: string;
    perMonth: string;
    selectPlan: string;
    processing: string;
    basic: {
      name: string;
      price: string;
      description: string;
      features: string[];
    };
    pro: {
      name: string;
      price: string;
      description: string;
      features: string[];
    };
  };
  errors: {
    loadingPlans: string;
    checkoutSession: string;
    retry: string;
    generalError: string;
  };
  loading: {
    plans: string;
  };
}; 