import React from 'react';
import { Button } from '@mui/material';
import { FaTimesCircle } from 'react-icons/fa';
import '../../styles/components/ButtonStyles.scss';

interface CancelButtonProps {
  onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
  return (
    <Button
      className="btnCancel"
      startIcon={<FaTimesCircle />}
      onClick={onClick}
    >
      Cancelar
    </Button>
  );
};

export default CancelButton;
