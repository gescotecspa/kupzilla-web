import React, { useState } from 'react';
import { Button, Card, IconButton, Slider, TextField, Typography } from '@mui/material';
import { Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchAllTouristPoints } from '../redux/actions/touristPointActions';
import '../styles/pages/TouristPointsList.scss';
import { TouristPoint } from '../models/TouristPoint';
import { RootState } from '../redux/store/store';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import Pagination from '../components/Pagination/pagination';
import { useMediaQuery } from 'react-responsive';
import iconclean from '../assets/icons/clear.svg';
import noimage from '../assets/images/noImageAvailable.png';
import CircularProgress from '@mui/material/CircularProgress';

const URL = import.meta.env.VITE_API_URL;

const TouristPointsList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const touristPoints = useAppSelector((state: RootState) => state.touristPoints.allTouristPoints);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile? 6 : 5;
  const totalPages = Math.ceil(touristPoints.length / itemsPerPage);
  const [titleFilter, setTitleFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | number[]>([0, 5]);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  console.log("todos los puntos turisticos",touristPoints);

  React.useEffect(() => {
    dispatch(fetchAllTouristPoints());
  }, [dispatch]);

  const handlePageChange = ( page: number) => {
    setCurrentPage(page);
  };
const handleTitleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleFilter(event.target.value);
  };

  const handleRatingFilterChange = (event: Event, newValue: number | number[]) => {
    console.log(event);
    
    setRatingFilter(newValue as number[]);
  };
  const handleImageLoad = (id: number) => {
    setLoadedImages((prevState) => ({ ...prevState, [id]: true }));
  };

  // Filtrar los puntos turísticos según el título y la valoración
  const filteredTouristPoints = touristPoints.filter((point) => {
    const matchesTitle = point.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesRating = Array.isArray(ratingFilter)
      ? point.average_rating >= ratingFilter[0] && point.average_rating <= ratingFilter[1]
      : point.average_rating >= ratingFilter;
    return matchesTitle && matchesRating;
  });

  // Paginación
  const paginatedTouristPoints = filteredTouristPoints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setTitleFilter('');
    setRatingFilter([0, 5]);
  };
  return (
    <div className="tourist-points-list">
      <div className="button-container">
        <Button variant="contained" className="add-button" onClick={() => navigate('/create-tourist-point')}>
          Crear Punto Turístico
        </Button>
      <div className="filter-container">
        {/* Filtro por título */}
        <TextField
          label="Buscar por título"
          variant="outlined"
          value={titleFilter}
          onChange={handleTitleFilterChange}
          fullWidth
          className="filter-input-title"
          size="small"
        />

        <div className='RatingFilter'>
        <Slider
          value={ratingFilter}
          onChange={handleRatingFilterChange}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.5}
          valueLabelFormat={(value) => `${value}`}
          className="rating-slider"
        />
        <Typography variant="body2" className='textColor'>Filtrar por valoración</Typography>
        </div>
        <div className='CleanFilter'>
          <IconButton onClick={handleClearFilters} className="clear-filters-button">
                  <img src={iconclean} alt='Limpiar filtros' className="iconClean" />
          </IconButton>
          <Typography className='textColor' variant="body2">Limpiar</Typography>
        </div>
        
      </div>
      </div>
      <div className="cards-container">
        {paginatedTouristPoints.map((point: TouristPoint) => (
          <Card className="tourist-point-card" onClick={() => navigate(`/tourist-points/${point.id}`)} key={point.id}>
            <div className="card-image-container">
        {/* Loader para la imagen */}
        {!loadedImages[point.id] && (
          <div className="image-loader-container">
            <CircularProgress
              sx={{
                color: 'var(--primary-color)',
              }}
              thickness={4}
            />
          </div>
        )}
        {/* Imagen */}
        <img
          src={point.images[0] ? `${URL}${point.images[0]?.image_path}` : noimage}
          alt={point.title}
          className={`card-image ${loadedImages[point.id] ? 'visible' : 'hidden'}`}
          onLoad={() => handleImageLoad(point.id)}
        />
      </div>
            <div className="card-content">
                <Rating className="Rating" name="read-only" value={point.average_rating} readOnly precision={0.5} />
              <div className="nameRating">
                <Typography variant="h6">{point.title}</Typography>
              </div>
              <Typography variant="body2">
                {point.description.slice(0, 50)}...
              </Typography>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Paginación modular */}
      <div className='pagCont'>
      {touristPoints.length > itemsPerPage && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      </div>
    </div>
  );
};

export default TouristPointsList;
