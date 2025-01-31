import { Button } from '@mui/material';
import { FaSave } from 'react-icons/fa';
import '../../styles/components/ButtonStyles.scss';

const SaveButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <Button className='btnSave' startIcon={<FaSave />} onClick={onClick}>
            Guardar
        </Button>
    );
};

export default SaveButton;
