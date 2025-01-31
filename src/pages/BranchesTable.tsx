import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Branch } from '../redux/types/types';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { fetchAllBranches } from '../redux/actions/branchesActions';
import '../styles/pages/_branchesTable.scss';
import { translateStatusToSpanish } from '../utils/utils';
import Pagination from '../components/Pagination/pagination';
import noimage from '../assets/images/noImageAvailable.png'
import { useMediaQuery } from 'react-responsive';

const URL = import.meta.env.VITE_API_URL;

const BranchesTable = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const dispatch = useAppDispatch();
  const branches = useAppSelector((state: any) => state.branches.allBranches);
  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = isMobile? 10 : 7;
// console.log("sucursales en tabla",branches);

const indexOfLastBranch = currentPage * branchesPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
  const currentBranches = branches.slice(indexOfFirstBranch, indexOfLastBranch);

  // Calcular total de páginas
  const totalPages = Math.ceil(branches.length / branchesPerPage);

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

  useEffect(() => {
    dispatch(fetchAllBranches());
  }, [dispatch]);

  return (
    <div className="branches-table-container">
      <table className="branches-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentBranches.map((branch:Branch) => (
            <tr key={branch.branch_id}>
              <td className="image-column">
                {branch && branch.image_url? <img src={`${URL}${branch.image_url}`} alt={branch.name} className="branch-image" />:<img src={noimage} alt={branch.name} className="branch-image" />}
              </td>
              <td>{branch.name}</td>
              <td>{branch?.status ? translateStatusToSpanish(branch.status.name) : 'Estado no disponible'}</td>
              <td>
                <Link to={`/branches/${branch.branch_id}`} className="edit-link">Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pagCont'>
        <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BranchesTable;
