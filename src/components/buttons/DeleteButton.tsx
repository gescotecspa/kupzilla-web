import { Button } from '@mui/material';
import { FaTrashAlt } from 'react-icons/fa';
import '../../styles/components/ButtonStyles.scss';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <Button className="btnDelete" startIcon={<FaTrashAlt />} onClick={onClick}>
      Eliminar
    </Button>
  );
};

export default DeleteButton;