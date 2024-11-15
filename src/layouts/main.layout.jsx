import Header from '@/features/header/Header';
import MainScreen from '@/features/mainscreen/MainScreen';

export default function MainLayout({ children }) {
  return (
    <>
      <Header/>
      <MainScreen/>
      {children}
    </>
  )
}
