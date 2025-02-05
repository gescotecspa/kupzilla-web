import { useEffect, useState } from 'react';
import '../styles/pages/CommentModeration.scss';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { cleanCommentsBranch } from '../redux/reducers/branchReducer';
import { fetchAllUsers } from '../redux/actions/userActions';
import { fetchAllBranches, fetchBranchCommentsById, fetchBranchCommentsLastWeek } from '../redux/actions/branchesActions';
//import Swal from 'sweetalert2';
import { translateStatusToSpanish } from '../utils/utils';
//import { approveComment, rejectComment } from '../redux/actions/ratingsActions';
import { RootState } from '../redux/store/store';

type CommentType = 'notType' | 'branch';

const CommentModeration = () => {
  const dispatch = useAppDispatch();
  const [commentType, setCommentType] = useState<CommentType>('notType');
  const [filterValue, setFilterValue] = useState<string>('');
  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const { commentsBranchLastWeek, commentsBranch } = useAppSelector((state: any) => state.branches);
  const branches = useAppSelector((state: RootState) => state.branches.allBranches);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBranches());
  }, []);

  useEffect(() => {
    dispatch(cleanCommentsBranch());
    if (commentType === 'branch') {
      dispatch(fetchBranchCommentsLastWeek());
    }
  }, [dispatch, commentType]);

  const handleFilterApply = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setFilterValue(selectedValue);
    if (!selectedValue) {
      setDisplayedComments(commentsBranchLastWeek);
      return;
    }
    if (commentType === 'branch') {
      const branchId = parseInt(selectedValue, 10);
      if (isNaN(branchId)) {
        dispatch(fetchBranchCommentsLastWeek());
        return;
      }
      dispatch(fetchBranchCommentsById(branchId));
    }
  };

  useEffect(() => {
    let filteredComments = [];
    if (commentType === 'branch') {
      filteredComments = commentsBranch && filterValue !== 'last' ? commentsBranch.ratings : commentsBranchLastWeek;
    }
    setDisplayedComments(filteredComments);
  }, [dispatch, commentsBranchLastWeek, commentType, filterValue, commentsBranch]);

  const truncateComment = (comment: string) => {
    return comment.length > 20 ? comment.slice(0, 20) + '...' : comment;
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
          <option value="branch">Sucursal</option>
        </select>
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
          </>
        )}
      </div>
      {displayedComments && displayedComments.length > 0 ? (
        <table className="comments-table">
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>Fecha</th>
              <th>Comentado por</th>
              <th>Comentario</th>
              <th>Rating</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {displayedComments.map((comment: any) => (
              <tr key={comment.id}>
                <td>{comment.branch_name}</td>
                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                <td>{comment.first_name}</td>
                <td>{truncateComment(comment.comment) || "Sin comentario"}</td>
                <td>{"⭐".repeat(comment.rating)}</td>
                <td>{comment.status ? translateStatusToSpanish(comment.status.name) : "Sin estado"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={commentType === 'notType' ? 'notType' : 'notcomment'}>{commentType === 'notType' ? 'Elige un tipo de comentario.' : 'No se encontraron comentarios para el ítem seleccionado.'}</p>
      )}
    </div>
  );
};

export default CommentModeration;
