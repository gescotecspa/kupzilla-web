import { useState } from 'react';
import { useAppDispatch } from '../redux/store/hooks';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/DeleteAccount.scss';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { deleteAccount } from '../redux/actions/userActions';
import Logo from '../assets/images/kup.png'; // Make sure you have a logo in this path

const DeleteAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleDeleteAccount = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'This action is irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAccount({ email, password }))
          .then((response: any) => {
            console.log("response", response);
            
            if (response.status == 200) {
              MySwal.fire('Account Deleted', 'Your account has been successfully deleted', 'success');
              navigate('/');
            } else {
              throw new Error('Could not delete the account');
            }
          })
          .catch((error: any) => {
            console.error('Error deleting account:', error);
            MySwal.fire('Error', 'Could not delete the account. Please check your credentials.', 'error');
          });
      }
    });
  };

  return (
    <div className="delete-account-container">
      <img src={Logo} alt="Logo" className="logo" />
      <h2>Delete Account</h2>
      <p className='textIng'>Enter your email and password to delete your account.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleDeleteAccount} className="delete-btn">
        Delete Account
      </button>
    </div>
  );
};

export default DeleteAccount;
