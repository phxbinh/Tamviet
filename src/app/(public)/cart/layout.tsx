import { CartProvider } from "@/components/cart/CartProvider";

export default function RootLayout({ children }) {
  return (
        <CartProvider>
          {children}
        </CartProvider>
  );
}