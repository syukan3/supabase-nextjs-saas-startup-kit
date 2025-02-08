export const isStripeEnabled = () => {
  return process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true';
}; 
