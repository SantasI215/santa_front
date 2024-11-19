import Header from "@/features/header/Header";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
