import { useState } from 'react';
import { useAppDispatch } from '../redux/store/hooks';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/DeleteAccount.scss';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { deleteAccount } from '../redux/actions/userActions';
import Logo from '../assets/images/kup.png'; // Asegúrate de tener un logo en esta ruta

const DeleteAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleDeleteAccount = () => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Este cambio es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAccount({ email, password }))
          .then((response: any) => {
            console.log("response",response);
            
            if (response.status == 200) {
              MySwal.fire('Cuenta Eliminada', 'Tu cuenta ha sido eliminada correctamente', 'success');
              navigate('/');
            } else {
              throw new Error('No se pudo eliminar la cuenta');
            }
          })
          .catch((error: any) => {
            console.error('Error al eliminar la cuenta:', error);
            MySwal.fire('Error', 'No se pudo eliminar la cuenta. Verifica tus credenciales.', 'error');
          });
      }
    });
  };

  return (
    <div className="delete-account-container">
      <img src={Logo} alt="Logo" className="logo" />
      <h2>Eliminar Cuenta</h2>
      <p className='textIng'>Ingresa tu correo y contraseña para eliminar tu cuenta.</p>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleDeleteAccount} className="delete-btn">
        Eliminar cuenta
      </button>
    </div>
  );
};

export default DeleteAccount;
