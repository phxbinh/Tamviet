/*
import { CartProvider } from "@/components/cart/CartProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <CartProvider>
          {children}
        </CartProvider>
  );
}
*/


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <>
          {children}
        </>
  );
}