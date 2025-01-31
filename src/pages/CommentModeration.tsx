import { useEffect, useState } from 'react';
import '../styles/pages/CommentModeration.scss';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { fetchAllTouristPoints, fetchTouristPointCommentsById, fetchTouristPointCommentsLastWeek } from '../redux/actions/touristPointActions';
import { cleanCommentsTouristPoint } from '../redux/reducers/touristPointsReducer';
import { cleanCommentsBranch } from '../redux/reducers/branchReducer';
import { cleanCommentsTourist } from '../redux/reducers/userReducer';
import { fetchAllUsers, fetchTouristCommentsById, fetchTouristCommentsLastWeek } from '../redux/actions/userActions';
import { fetchAllBranches, fetchBranchCommentsById, fetchBranchCommentsLastWeek } from '../redux/actions/branchesActions';
import Swal from 'sweetalert2';
import { translateStatusToSpanish } from '../utils/utils';
import { approveComment, rejectComment } from '../redux/actions/ratingsActions';
import { RootState } from '../redux/store/store';
import User from '../models/User';

type CommentType = 'notType' | 'touristPoint' | 'branch' | 'tourist';

const CommentModeration = () => {
  const dispatch = useAppDispatch();
  const [commentType, setCommentType] = useState<CommentType>('notType');
  const [filterValue, setFilterValue] = useState<string>('');
  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const { commentsLastWeek, commentsTouristPoint} = useAppSelector((state: any) => state.touristPoints);
  const { commentsBranchLastWeek, commentsBranch } = useAppSelector((state: any) => state.branches);
  const { ratingsTouristLastWeek, ratingsTourist, users } = useAppSelector((state: any) => state.user);
  const branches = useAppSelector((state: RootState) => state.branches.allBranches);
  const touristPoints = useAppSelector((state: RootState) => state.touristPoints.allTouristPoints);
  const [ placeholderInput, setPlaceholderInput ] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<any | null>(null);
//   const statuses = useAppSelector((state: any) => state.user.statuses);
//   const statusRejected = statuses?.find((s: any) => s.name === "rejected");
//   const statusApproved = statuses?.find((s: any) => s.name === "approved"); 
//   const URL = import.meta.env.VITE_API_URL;
// console.log("todos los usuarios",users, "todas las sucursales",branches, "todos los puntos turisticos", touristPoints);
    console.log(placeholderInput);
    
//   console.log("comentarios de todos los puntos turisticos ",commentsLastWeek, "comentarios de punto turistico", commentsTouristPoint);
//   console.log("comentarios de sucursales ultimo mes",commentsBranchLastWeek,"comentarios de sucursal", commentsBranch);
//   console.log("comentarios de sucursal", commentsBranch);
//   console.log("comentarios de turista ",ratingsTouristLastWeek, ratingsTourist);
//   console.log("valor de fitered value",filterValue);
// console.log("comentario seleccionado",selectedComment);
// console.log("comentarios mostrados",displayedComments );


useEffect(() => {
    dispatch(fetchAllUsers())
    dispatch(fetchAllTouristPoints())
    dispatch(fetchAllBranches())
  }, []);

  useEffect(() => {
    // Limpiar los comentarios cuando se cambie el tipo seleccionado
    dispatch(cleanCommentsTouristPoint());
    dispatch(cleanCommentsBranch());
    dispatch(cleanCommentsTourist());
    setShowModal(false)
    // Cargar los comentarios de acuerdo con el tipo seleccionado
    if (commentType === 'touristPoint') {
      dispatch(fetchTouristPointCommentsLastWeek());
    //   setPlaceholderInput('Nombre del punto turístico')
    } else if (commentType === 'branch') {
      dispatch(fetchBranchCommentsLastWeek());
    //   setPlaceholderInput('Nombre de sucursal')
    } else if (commentType === 'tourist') {
      dispatch(fetchTouristCommentsLastWeek());
      setPlaceholderInput('Email del turista')
    }
  }, [dispatch, commentType]);

  const handleFilterApply = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    // console.log("selected valaue dentro de funcion",selectedValue);
    
    setFilterValue(selectedValue);
    if (!selectedValue) {
      setDisplayedComments(commentsLastWeek)
      return;
    }
//   console.log("dentro de handleFilterApply.........................................",commentType, selectedValue);
  
    if (commentType === 'tourist') {
      const selectedUser = users.find((user: User) => user.email === filterValue);
      if (!selectedUser) {
        Swal.fire({
          title: 'Error',
          text: 'No se encontró un usuario con ese email.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }
      dispatch(fetchTouristCommentsById(selectedUser.id));
    } else if (commentType === 'branch') {
      const branchId = parseInt(selectedValue, 10);
      if (isNaN(branchId)) {
        dispatch(fetchBranchCommentsLastWeek());
        return;
      }
      console.log("id de la sucursal a enviaar a pedir", branchId, typeof(branchId));
      
      dispatch(fetchBranchCommentsById(branchId));
    } else if (commentType === 'touristPoint') {
      const touristPointId = parseInt(selectedValue, 10);
      if (isNaN(touristPointId)) {
        dispatch(fetchTouristPointCommentsLastWeek());
        return;
      }
      dispatch(fetchTouristPointCommentsById(touristPointId));
    }
  };



  useEffect(() => {
    let filteredComments = [];
    
    // Filtrado de comentarios
    if (commentType === 'touristPoint') {
        filteredComments = commentsTouristPoint && filterValue !== 'last' ? commentsTouristPoint.ratings : commentsLastWeek;
      } else if (commentType === 'branch') {
        filteredComments = commentsBranch && filterValue !== 'last' ? commentsBranch.ratings : commentsBranchLastWeek;
      } else if (commentType === 'tourist') {
        filteredComments = ratingsTourist && ratingsTourist.length > 0 ? ratingsTourist : ratingsTouristLastWeek;
      }
    
    
    // if (filterValue.trim()) {
    //   filteredComments = filteredComments.filter((comment: any) =>
    //     comment.id.toString().includes(filterValue.trim())
    //   );
    // }
  
    // console.log('filteredComments:', filteredComments);
    // Actualizar los comentarios a mostrar
    setDisplayedComments(filteredComments);
  
  }, [dispatch, commentsLastWeek, commentsBranchLastWeek, ratingsTouristLastWeek, commentType, filterValue, commentsBranch, ratingsTourist,commentsTouristPoint ]);

  const truncateComment = (comment: string) => {
    return comment.length > 20 ? comment.slice(0, 20) + '...' : comment;
  };

  const openModal = (comment: any) => {
    setSelectedComment(comment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComment(null);
  };

  const handleApprove = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres aprobar este comentario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
    }).then((result:any) => {
      if (result.isConfirmed) {
        dispatch(approveComment(selectedComment.id, commentType));
        // console.log('Comentario aprobado:', selectedComment.id, commentType);
        closeModal();
        Swal.fire('Aprobado', 'El comentario ha sido aprobado.', 'success');
      }
    });
  };
  const handleReject = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres rechazar este comentario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
    }).then((result:any) => {
      if (result.isConfirmed) {
        dispatch(rejectComment(selectedComment.id, commentType));
        // console.log('Comentario rechazado:', selectedComment, commentType);
        closeModal();
        Swal.fire('Rechazado', 'El comentario ha sido rechazado.', 'success');
      }
    });
  };
  
  return (
    <div className="comment-moderation">
      <h1>Moderación de Comentarios</h1>

      <div className="filters">
        <select
          value={commentType}
          onChange={(e) => setCommentType(e.target.value as CommentType)}
        >
          <option className='notType' value="notType">Selecciona tipo de comentario</option>
          <option value="touristPoint">Punto Turístico</option>
          <option value="branch">Sucursal</option>
          {/* <option value="tourist">Turista</option> */}
        </select>

        {/* {commentType === 'tourist' && (
                <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Ingresa el email del turista"
                />
                )} */}

        {commentType === "branch" && (
          <>
            <select value={filterValue} onChange={handleFilterApply}>
              <option value="last">Comentarios del último mes</option>
              {branches.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {/* <button className="search-button" onClick={handleFilterApply}>
                Buscar
                </button> */}
          </>
        )}

        {commentType === "touristPoint" && (
          <>
            <select value={filterValue} onChange={handleFilterApply}>
              <option value="last">Comentarios del último mes</option>
              {touristPoints.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.title}
                </option>
              ))}
            </select>
            {/* <button className="search-button" onClick={handleFilterApply}>
            Buscar
            </button> */}
          </>
        )}
      </div>

      {/* {loading && <p>Cargando comentarios...</p>}
      {error && <p>Error: {error}</p>} */}
      {displayedComments && displayedComments.length > 0  ? (
        <table className="comments-table">
          <thead>
            <tr>
              <th>
                {commentType == "touristPoint"
                  ? "Punto turístico"
                  : commentType == "branch"
                  ? "Sucursal"
                  : commentType == "tourist"
                  ? "Turista"
                  : ""}
              </th>
              <th>Fecha</th>
              <th>Comentado por</th>
              <th>Comentario</th>
              <th>Rating</th>
              <th>Estado</th>
              {/* <th>Acciones</th> */}
            </tr>
          </thead>
          <tbody>
            {displayedComments.map((comment: any) => (
              <tr key={comment.id} onClick={() => openModal(comment)}>
                <td>
                  {commentType == "touristPoint"
                    ? comment.tourist_point_title
                    : commentType == "branch"
                    ? comment.branch_name
                    : commentType == "tourist"
                    ? comment.tourist_email
                    : ""}
                </td>
                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="user-info">
                    <span>
                      {commentType == "touristPoint"
                        ? comment.tourist_first_name
                        : commentType == "branch"
                        ? comment.first_name
                        : commentType == "tourist"
                        ? comment.branch_name
                        : ""}
                    </span>
                  </div>
                </td>
                <td>{truncateComment(comment.comment) || "Sin comentario"}</td>
                <td>{"⭐".repeat(comment.rating)}</td>
                <td
                  className={
                    comment && comment.status ? comment.status.name : ""
                  }
                >
                  {comment.status
                    ? translateStatusToSpanish(comment.status.name)
                    : "Sin estado"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={commentType === 'notType'? 'notType':'notcomment'}>{commentType === 'notType'? 'Elige un tipo de commentario.': 'No se encontraron comentarios para el ítem seleccionado.'}</p>
      )}
      {showModal && selectedComment && (
        <div className="modal">
          <div className="modal-content-branch">
            <button className="closeBtnX" onClick={closeModal}>
              X
            </button>
            {/* <h2>Comentario</h2> */}

            <p>
              {commentType == "touristPoint"
                ? selectedComment.tourist_point_title
                : commentType == "branch"
                ? selectedComment.branch_name
                : commentType == "tourist"
                ? selectedComment.tourist_email
                : ""}
            </p>
            <p>
              <strong>Calificación:</strong>{" "}
              {"⭐".repeat(selectedComment.rating)}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {selectedComment.status
                ? translateStatusToSpanish(selectedComment.status?.name)
                : "Sin estado"}
            </p>
            <p>
              <strong>Comentario:</strong> {selectedComment.comment}
            </p>
            <p>
              <strong>Comentado por:</strong>{" "}
              {commentType == "touristPoint"
                ? selectedComment.tourist_first_name
                : commentType == "branch"
                ? selectedComment.first_name
                : commentType == "tourist"
                ? selectedComment.branch_name
                : ""}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(selectedComment.created_at).toLocaleDateString()}
            </p>
            <div className="modal-actions-branch">
             {selectedComment.status?.name !=='approved' && <button onClick={handleApprove}>Aprobar</button>}
             {selectedComment.status?.name !=='rejected' &&<button onClick={handleReject}>Rechazar</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentModeration;