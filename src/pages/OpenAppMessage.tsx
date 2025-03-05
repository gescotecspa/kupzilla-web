// import { Link } from 'react-router-dom';
import '../styles/pages/OpenAppMessage.scss';
import logo from '../assets/images/logok.png'
import logo2 from '../assets/images/KUPZILLAName.png'

const OpenAppMessage = () => {
  return (
    <div className="open-app-message">
      <img src={logo} alt="Abre tu aplicación" className="app-image" />
      <img src={logo2} alt="Abre tu aplicación" className="app-image" />
      <h1>Password Reset!</h1>
      <p>Your password has been successfully reset.</p><p>Open your app to continue.</p>
      {/* <Link to="/" className="back-home-button">Volver al inicio</Link> */}
    </div>
  );
};

export default OpenAppMessage;