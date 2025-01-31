import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../styles/pages/_configuration.scss';
import { GlobalDataState } from '../redux/reducers/globalDataReducer';
import { addNewCategory, fetchCategories, updateCategory } from '../redux/actions/globalDataActions';
import { useAppDispatch } from '../redux/store/hooks';

const ITEMS_PER_PAGE = 15;

const Configuration = () => {
  const categories = useSelector((state: { globalData: GlobalDataState }) => state.globalData.categories);
  const countries = useSelector((state: { globalData: GlobalDataState }) => state.globalData.countries);
//   const statuses = useSelector((state: any) => state.user.statuses);
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState('Categorías');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (newCategory) {
      dispatch(addNewCategory({ name: newCategory }));
      dispatch(fetchCategories());
      setNewCategory('');
    }
  };

  const handleEditCategory = (category: { category_id: number; name: string }) => {
    setEditingCategoryId(category.category_id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateCategory = async() => {
    // console.log(editingCategoryId, editingCategoryName);
    
    if (editingCategoryId !== null) {

      await dispatch(updateCategory(editingCategoryId, editingCategoryName));
      dispatch(fetchCategories()); 
      setEditingCategoryId(null);
      setEditingCategoryName('');
    }
  };

  // Nueva función para cancelar la edición
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  // Paginación
  const totalPages = Math.ceil(countries.length / ITEMS_PER_PAGE);
  const paginatedCountries = countries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      <h1>Configuración</h1>
      <div className="tabs">
        {['Categorías', 'Países'].map((tab) => (
          <div
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`tab ${selectedTab === tab ? 'active' : 'inactive'}`}
          >
            {tab}
          </div>
        ))}
      </div>

      {selectedTab === 'Categorías' && (
        <div>
          <h2 className="subtitle">Categorías</h2>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría"
            className="input"
          />
          <button onClick={handleAddCategory} className="button">
            Agregar
          </button>

          {editingCategoryId !== null && (
            <div>
              <input
                type="text"
                value={editingCategoryName}
                onChange={(e) => setEditingCategoryName(e.target.value)}
                placeholder="Editar categoría"
                className="input"
              />
              <button onClick={handleUpdateCategory} className="button">
                Actualizar
              </button>
              {/* Botón para cancelar la edición */}
              <button onClick={handleCancelEdit} className="button cancel-button">
                Cancelar
              </button>
            </div>
          )}

          <ul style={{ listStyleType: 'none', padding: '0' }} className='list-cont'>
            {categories.map((category: any) => (
              <li key={category.id} className="list-item">
                {category.name}
                <button onClick={() => handleEditCategory(category)} className="edit-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#007A8C" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === 'Países' && (
        <div className="countries-container">
          <h2 className="subtitle">Países</h2>
          <div className="countries-columns">
            {paginatedCountries.map((country: any, index: any) => (
              <div key={index} className="list-item">
                {country.name}
              </div>
            ))}
          </div>
          {/* Controles de Paginación */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Anterior
            </button>
            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* {selectedTab === 'Estados' && (
        <div>
          <h2 className="subtitle">Estados</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {statuses.map((status: any, index: any) => (
              <li key={index} className="list-item">
                {status.name}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default Configuration;
