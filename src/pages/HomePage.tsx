import { useEffect } from 'react';
import { useAppDispatch } from '../redux/store/hooks';
import '../styles/pages/Home.scss';
import { fetchRoles, fetchStatuses } from '../redux/actions/userActions';
import { fetchCategories, fetchCountries } from '../redux/actions/globalDataActions';
import { useNavigate } from 'react-router-dom';
import gescotec from '../assets/images/gescotec.png';
import logo from '../assets/images/logo.png';

const HomePage = () => {

  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
    dispatch(fetchCountries());
    dispatch(fetchCategories());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleTouristRegistration = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      <div className="content-container">
        <div className="registration-section">
          <h3>¡Bienvenido a Kupzilla!</h3>
          <p className='registersect'>
            Si eres turista, <strong>¡regístrate aquí!</strong> para comenzar a aprovechar nuestros cupones de descuentos y
            disfrutar de todas las maravillas que nuestra App tiene para ofrecer.
          </p>
          <button className="buttonRegisterTourist" onClick={handleTouristRegistration}>
            Registrarse
          </button>
          <div className="delete-account-section">
            <p className='baja'>¿Quieres eliminar tu cuenta?</p>
            <a href="/delete-account" className="delete-account-link">Darse de baja</a>
          </div>
        </div>
        <div className="video-section">
        <img src={gescotec} className='LogoG' alt="LogoH" />
        </div>
          {/* <QRCodeGenerator url="https://seal-app-dx4lr.ondigitalocean.app/register" /> */}
      </div>
      <section>
        <h2>Nuestra Misión</h2>
        <p>
        “Somos Kupzilla, la plataforma enfocada en brindar los mejores códigos de descuento y promociones 
        a nuestros usuarios. Nuestra misión es conectar a personas 
        con una amplia variedad de comercios y servicios, permitiendo a cada tienda 
        asociada registrar su negocio y compartir ofertas exclusivas.
        A través de Kupzilla, ayudamos a los comercios a dar a conocer sus promociones,
        mientras que los usuarios descubren oportunidades únicas para ahorrar en sus compras.
        Nuestro objetivo es crear una experiencia rápida, segura y práctica para todos,
        fomentando una comunidad en la que cada cupón se transforme en un beneficio real.
        ¡Bienvenido a Kupzilla, donde tus ahorros comienzan!”
        </p>
      </section>
      <div className='divLogoHome'>
                    <img src={logo} className='LogoH' alt="LogoH" />
            </div>
    </div>
  );
};

export default HomePage;
