import { Button } from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import '../../styles/components/ButtonStyles.scss';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <Button className="btnEdit" startIcon={<FaEdit />} onClick={onClick}>
      Editar
    </Button>
  );
};

export default EditButton;