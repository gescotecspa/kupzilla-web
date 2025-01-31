import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAppDispatch } from '../../redux/store/hooks';
import { fetchBranchById, updateBranchById } from '../../redux/actions/branchesActions';
import '../../styles/components/EditBranchModal.scss';
import noimage from '../../assets/images/noImageAvailable.png';
import SaveButton from '../buttons/SaveButton';
import CancelButton from '../buttons/CancelButton';
import upload from '../../assets/images/uploadImage.png';
import MapComponent from '../MapFunctions/MapComponent';
import Loader from '../Loader/Loader';
import Swal from 'sweetalert2';

interface EditBranchModalProps {
  showModal: boolean;
  branch: any;
  onClose: () => void;
  branchId: number;
}
const URL = import.meta.env.VITE_API_URL;

const EditBranchModal: React.FC<EditBranchModalProps> = ({ showModal, branch, onClose, branchId }) => {
    // console.log("id de la sucursal", branchId);
    
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState<string>(branch?.name || '');
  const [description, setDescription] = useState<string>(branch?.description || '');
  const [address, setAddress] = useState<string>(branch?.address || '');
  const [selectedImage, setSelectedImage] = useState<string | null>(
    branch && branch.image_url ? `${URL}${branch.image_url}` : null
  );
  const [imageData, setImageData] = useState<{ filename: string; data: string } | null>(null);
  const [errors, setErrors] = useState({ name: '', address: '', description: '' });
  const [latitude, setLatitude] = useState<number>(branch?.latitude || -36.133852565671226);
  const [longitude, setLongitude] = useState<number>(branch?.longitude || -72.79750640571565);
  const [loading, setLoading] = useState<boolean>(false);
// console.log(latitude,longitude);

  const validateField = (fieldName: string, value: string) => {
    const newErrors = { ...errors };

    if (fieldName === 'name') {
      if (value.length > 30) {
        newErrors.name = 'El nombre no puede superar los 30 caracteres.';
      } else {
        newErrors.name = '';
      }
    }

    if (fieldName === 'address') {
      if (value.length > 50) {
        newErrors.address = 'La dirección no puede superar los 50 caracteres.';
      } else {
        newErrors.address = '';
      }
    }

    if (fieldName === 'description') {
      if (value.length > 250) {
        newErrors.description = 'La descripción no puede superar los 250 caracteres.';
      } else {
        newErrors.description = '';
      }
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    if (branch?.image_url) {
      setSelectedImage(`${URL}${branch.image_url}`);
    }
  }, [branch, dispatch]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setImageData({ filename: file.name, data: base64Data });
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = () => {
    if (name && description && address) {
      const updatedBranch = {
        name,
        description,
        address,
        latitude,
        longitude,
        image_data: imageData?.data || null,
      };
      setLoading(true);
    //   console.log('data a enviar para actualizar', updatedBranch);

    dispatch(updateBranchById(branchId, updatedBranch))
        .then(() => {
          setLoading(false);
          Swal.fire('¡Éxito!', 'Sucursal actualizada correctamente', 'success'); 
          dispatch(fetchBranchById(branchId)).then(() => {
            onClose();
          });
        })
        .catch(() => {
          setLoading(false); 
          Swal.fire('Error', 'Hubo un problema al actualizar la sucursal', 'error');
        });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const handleCancel = () => {
    setName(branch?.name || '');
    setAddress(branch?.address || '');
    setDescription(branch?.description || '');
    setSelectedImage(branch && branch.image_url ? `${URL}${branch.image_url}` : null);
    setErrors({ name: '', address: '', description: '' })
    onClose();
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };
  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
        {loading && <Loader></Loader>}
      <div className="modal-content">
        <button className="close-btn" onClick={handleCancel}>
          <FaTimes />
        </button>
        <h2>Editar Sucursal</h2>
        <div className='gralContent'>
        <div className="modal-inputs">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => {
                setName(e.target.value);
                validateField('name', e.target.value);
              }}
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => {
                setDescription(e.target.value);
                validateField('description', e.target.value);
              }}
            />
            {errors.description && <p className="error">{errors.description}</p>}
          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={(e) => {
                setAddress(e.target.value);
                validateField('address', e.target.value);
              }}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <div className="image-preview" onClick={triggerFileInput}>
          <img className="uploadImage" src={upload} alt="Subir imagen" />
            <img src={selectedImage || noimage} alt="Imagen seleccionada" />
          </div>
              </div>
          <div className="mapContainer">
          <MapComponent
          center={{ lat: latitude, lng: longitude }}
          zoom={15}
          markerPosition={{ lat: latitude, lng: longitude }}
          onLocationChange={handleLocationChange}
          editMode={true}
        />
        <div className="coordinates-display">
          <p>Latitud: {latitude}</p>
          <p>Longitud: {longitude}</p>
        </div>
        </div>
        </div>
        <div className="modal-actions">
          <SaveButton onClick={handleSave} />
          <CancelButton onClick={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default EditBranchModal;
