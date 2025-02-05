// import axios from "axios";
import apiClient from "../../api/axiosConfig";
// import { setCommentsBranch } from "../reducers/branchReducer";
// import { setCommentsTourist } from "../reducers/userReducer";

const URL = import.meta.env.VITE_API_URL;

// Aprobar un comentario
const approveComment = (commentId: number, commentType: string) => {
  return async () => {
    try {
      // console.log("a enviar", commentId, commentType);
      
      // Actualizar comentarios según el tipo
      if (commentType === "branch") {
        const response = await apiClient.put(`${URL}/branches/ratings/approve/${commentId}`);
        console.log("respuesta en aprobar comentario a sucursal", response.data);
        // dispatch(updateBranch(response.data));
      } else if (commentType === "tourist") {
        const response = await apiClient.put(`${URL}/tourists/ratings/approve/${commentId}`);
        console.log("respuesta en aprobar comentario a turista", response.data);
        // dispatch(setCommentsTourist(response.data));
      }
    } catch (error) {
      console.error(`Error al aprobar el comentario ${commentId}:`, error);
    }
  };
};

// Rechazar un comentario
const rejectComment = (commentId: number, commentType: string) => {
  return async () => {
    try {
      if (commentType === "branch") {
        const response = await apiClient.put(`${URL}/branches/ratings/reject/${commentId}`);
        console.log("respuesta en rechazar comentario a sucursal", response.data);
        // dispatch(setCommentsBranch(response.data));
      } else if (commentType === "tourist") {
        const response = await apiClient.put(`${URL}/tourists/ratings/reject/${commentId}`);
        console.log("respuesta en rechazar comentario a turista", response.data);
        // dispatch(setCommentsTourist(response.data));
      }
    } catch (error) {
      console.error(`Error al rechazar el comentario ${commentId}:`, error);
    }
  };
};

export { approveComment, rejectComment };
