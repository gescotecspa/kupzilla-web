import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Card, Container, TextField } from '@mui/material';
import { Rating } from '@mui/material';
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
import { deleteTouristPointById, fetchTouristPointById, resetTouristPoint, updateTouristPointById } from '../redux/actions/touristPointActions';
import { RootState } from '../redux/store/store';
import '../styles/pages/TouristPointDetail.scss';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { GoogleMapsProvider } from '../components/MapFunctions/GoogleMapsLoader';
import MapComponent from '../components/MapFunctions/MapComponent';
import { compressAndConvertToBase64 } from '../utils/imageUtils';
import Loader from '../components/Loader/Loader';
import SaveButton from '../components/buttons/SaveButton';
import EditButton from '../components/buttons/EditButton';
import DeleteButton from '../components/buttons/DeleteButton';
import CancelButton from '../components/buttons/CancelButton';
import Swal from 'sweetalert2';
import noimage from '../assets/images/noImageAvailable.png';
import { FaArrowLeft } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

const TouristPointDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const touristPoint = useAppSelector((state: RootState) => state.touristPoints.selectedTouristPoint);
    const URL = import.meta.env.VITE_API_URL;
    console.log("punto turistico", touristPoint);
    
    const [selectedImage, setSelectedImage] = useState<string | undefined>(touristPoint?.images[0]?.image_path);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>( null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(touristPoint?.title || '');
    const [description, setDescription] = useState(touristPoint?.description || '');
    const [images, setImages] = useState(touristPoint?.images || []); 
    const [deletedImages, setDeletedImages] = useState<number[]>([]); 
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    //imagenes que se envian
    // console.log("imageness a borrar",deletedImages);
    // console.log("punto turistico elegido",touristPoint);
    const [newImages, setNewImages] = useState<{ filename: string, data: string }[]>([]);  
    //imagenes que se ven
    const [previewImages, setPreviewImages] = useState<string[]>([]); 
    

    const handleBack = () => {
        dispatch(resetTouristPoint());
        navigate(-1);
      };

    useEffect(() => {
        if (id) {
            dispatch(fetchTouristPointById(Number(id)));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (touristPoint) {
            setSelectedImage(touristPoint.images[0]?.image_path);
            setLocation({ lat: touristPoint.latitude, lng: touristPoint.longitude });
            setTitle(touristPoint.title);
            setDescription(touristPoint.description);
            setImages(touristPoint.images);
        }
    }, [touristPoint]);

    const handleDelete = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Este cambio no se podrá deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                if (id) {
                    dispatch(deleteTouristPointById(Number(id)));
                    navigate('/tourist-points');
                    Swal.fire(
                        'Eliminado',
                        'El punto turístico ha sido eliminado.',
                        'success'
                    );
                }
            }
        });
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        if (id && location) {
            const updatedTouristPoint = {
                title,
                description,
                latitude: location.lat,
                longitude: location.lng,
                images: newImages,
            };
   
            // Mostrar alerta de cargando
            Swal.fire({
                title: 'Guardando...',
                text: 'Por favor espera',
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
   
            try {
                await dispatch(updateTouristPointById(id, updatedTouristPoint, deletedImages));
                await dispatch(fetchTouristPointById(Number(id)));
                setNewImages([])
                setEditMode(false);
   
                // Mostrar alerta de éxito
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El punto turístico se ha actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
            } catch (error) {
                // Mostrar alerta de error si ocurre algún problema
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al guardar los cambios.',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo',
                });
            }
        }
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setLocation({ lat, lng });
    };

    const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const selectedFiles = Array.from(e.target.files);
          
          const imagesWithBase64 = await Promise.all(selectedFiles.map(async (file) => {
            const base64Data = await compressAndConvertToBase64(file);
            const base64WithoutPrefix = base64Data.split(',')[1];
            return {
              filename: file.name,
              data: base64WithoutPrefix,
            };
          }));
          
          setNewImages((prevImages) => [...prevImages, ...imagesWithBase64]);
          setPreviewImages((prevPreviews) => [...prevPreviews, ...imagesWithBase64.map(image => `data:image/jpeg;base64,${image.data}`)]);
        }
      };

    const handleRemoveImage = (image: any, index: number) => {
        if (image.id) {
            setDeletedImages((prev) => [...prev, image.id]);
            setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        } else {
            const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
            setPreviewImages(updatedPreviewImages);
            setNewImages((prevNewImages) => prevNewImages.filter((_, i) => i !== index));
        }
    };
    const handleCancel = () => {
        setEditMode(false)
        setPreviewImages([])
        setDeletedImages([]);
        setNewImages([])
    }

    if (!touristPoint) return <Loader/>;

    return (
        <Container className="tourist-point-detail" sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px" }}>
      {/* Detalles y Galería */}
      <div className="detail-content" >
        <Card className="detail-card">
          {editMode ? (
            <>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <Button component="label" className="btnMore" startIcon={<FaPlusCircle />}>
                Agregar Imágenes
                <input type="file" accept="image/*" multiple hidden onChange={handleAddImage} />
              </Button>
            </>
          ) : (
            <>
              <button className="back-button" onClick={handleBack}>
                <FaArrowLeft className="back-icon" />
                {!isMobile && <h4>Volver</h4>}
              </button>
              {selectedImage ? (
                <img src={URL + selectedImage} alt="selected" className="detail-image" />
              ) : (
                <img src={noimage} alt="sin imagen" className="detail-image" />
              )}
              <div className="listimages">
                {images.map((image, index) => (
                  <div key={index} className="thumbnail-wrapper-list">
                    <img
                      src={URL + image.image_path}
                      alt={`Thumbnail ${index}`}
                      className="thumbnail"
                      onClick={() => setSelectedImage(image.image_path)}
                    />
                    {editMode && (
                      <FaTimesCircle
                        className="remove-icon"
                        onClick={() => handleRemoveImage(image, index)}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Typography variant="h4">{touristPoint.title}</Typography>
              <Rating name="read-only" value={touristPoint.average_rating} readOnly precision={0.5} />
              <Typography className="descriptionTour" variant="body1">{touristPoint.description}</Typography>
            </>
          )}

          <div className="buttons-container">
            {editMode ? (
              <>
                <SaveButton onClick={handleSave} />
                <CancelButton onClick={handleCancel} />
              </>
            ) : (
              <>
                <EditButton onClick={handleEdit} />
                <DeleteButton onClick={handleDelete} />
              </>
            )}
          </div>
        </Card>
        {/* Galería de miniaturas */}
        <div className="thumbnails-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {editMode &&
            images.map((image, index) => (
              <div key={index} className="thumbnail-wrapper">
                <img
                  src={URL + image.image_path}
                  alt={`Thumbnail ${index}`}
                  className="thumbnail"
                  onClick={() => setSelectedImage(image.image_path)}
                />
                {editMode && (
                  <button
                    type="button"
                    className="remove-icon"
                    onClick={() => handleRemoveImage(image, index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 16 16">
                      <path
                        fill="#ce0000"
                        fillRule="evenodd"
                        d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1zM9 2H6v1h3zM4 13h7V4H4zm2-8H5v7h1zm1 0h1v7H7zm2 0h1v7H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
        </div>
        {/* Renderizar nuevas imágenes en base64 */}
        {previewImages.map((base64Image, index) => (
          <div key={`new-${index}`} className="thumbnail-wrapper">
            <img
              src={base64Image}
              alt={`New Thumbnail ${index}`}
              className="thumbnail"
              onClick={() => setSelectedImage(base64Image)}
            />
            {editMode && (
              <button
                type="button"
                className="remove-icon"
                onClick={() => handleRemoveImage(base64Image, index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 16 16">
                  <path
                    fill="#ce0000"
                    fillRule="evenodd"
                    d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1zM9 2H6v1h3zM4 13h7V4H4zm2-8H5v7h1zm1 0h1v7H7zm2 0h1v7H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mapa */}
      <div className="map-container-view" style={{ flex: "1 1 20%" }}>
        <Card className="map-card">
          <GoogleMapsProvider>
            <MapComponent
              center={{ lat: touristPoint.latitude, lng: touristPoint.longitude }}
              onLocationChange={handleLocationChange}
              zoom={13}
              markerPosition={{ lat: touristPoint.latitude, lng: touristPoint.longitude }}
              editMode={editMode}
            />
          </GoogleMapsProvider>
        </Card>
      </div>
    </Container>
    );
};

export default TouristPointDetail;
