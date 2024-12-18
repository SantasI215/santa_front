import Header from "@/features/header/Header";
import Footer from "@/features/footer/Footer";

export default function MainLayout({ children }) {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}
