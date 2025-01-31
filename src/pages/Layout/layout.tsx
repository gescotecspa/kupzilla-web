import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useAppSelector } from '../../redux/store/hooks';
import { RootState } from '../../redux/store/store';
import '../../styles/layout/_layout.scss';

interface AppLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: AppLayoutProps): JSX.Element => {
  const { accessToken } = useAppSelector((state: RootState) => state.user);
  // console.log("token layout",accessToken);
  
  return (
    <div className="Container_layout">
      <Navbar />

                {accessToken && <Sidebar />}
            <div className="layout">
                <div className="childrenLayout">{children}</div>
            </div>
      <Footer />
    </div>
  );
}

export default Layout;