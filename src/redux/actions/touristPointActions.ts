import { Dispatch } from "@reduxjs/toolkit";
// import axios from "axios";
import {
  setAllTouristPoints,
  setSelectedTouristPoint,
  addTouristPoint,
  updateTouristPoint,
  deleteTouristPoint,
  cleanTouristPoint,
  setCommentsLastWeek,
  setCommentsTouristPoint
} from "../reducers/touristPointsReducer";
import { TouristPointCreate } from "../../models/TouristPoint";
import { AppDispatch } from "../store/store";
import apiClient from "../../api/axiosConfig";


const URL = import.meta.env.VITE_API_URL;

// Obtener todos los puntos turísticos
const fetchAllTouristPoints = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.get(`${URL}/tourist_points/active-inactive`);
      dispatch(setAllTouristPoints(response.data));
    } catch (error) {
      console.error("Error al obtener todos los puntos turísticos:", error);
    }
  };
};

// Obtener un punto turístico por ID
const fetchTouristPointById = (touristPointId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.get(`${URL}/tourist_points/${touristPointId}`);
      dispatch(setSelectedTouristPoint(response.data));
    } catch (error) {
      console.error(`Error al obtener el punto turístico ${touristPointId}:`, error);
    }
  };
};

// Crear un nuevo punto turístico
const createTouristPoint = (touristPointData: TouristPointCreate) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.post(`${URL}/tourist_points`, touristPointData);
      dispatch(addTouristPoint(response.data));
      return response
    } catch (error) {
      console.error("Error al crear un nuevo punto turístico:", error);
    }
  };
};

// Actualizar un punto turístico existente
const updateTouristPointById = (touristPointId: string, touristPointData: TouristPointCreate, deletedImages: number[]) => {
  return async (dispatch: Dispatch) => {
    try {
        // Eliminar las imágenes
      if (deletedImages.length > 0) {
        const responseDel = await apiClient.post(`${URL}/tourist_points/${touristPointId}/images/delete`, { image_ids: deletedImages });
            console.log("respuesta de la eliminacion de imagenes",responseDel);
            
      }
      const response = await apiClient.put(`${URL}/tourist_points/${touristPointId}`, touristPointData);
      console.log("respuesta de la actualizacion",response);
      dispatch(updateTouristPoint(response.data));
      return response
    } catch (error) {
      console.error(`Error al actualizar el punto turístico ${touristPointId}:`, error);
    }
  };
};

// Eliminar un punto turístico
const deleteTouristPointById = (touristPointId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      await apiClient.delete(`${URL}/tourist_points/${touristPointId}`);
      dispatch(deleteTouristPoint(touristPointId));
    } catch (error) {
      console.error(`Error al eliminar el punto turístico ${touristPointId}:`, error);
    }
  };
};

const resetTouristPoint = () => {
  return async (dispatch: Dispatch) => {
    try {
      return dispatch(cleanTouristPoint(null));
    } catch (error) {
      console.error(`Error al limpiar la sucursal `, error);
    }
  };
};

const fetchTouristPointCommentsLastWeek = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await apiClient.get(`${URL}/tourist_points/ratings/last_week`);
      console.log("respuesta de peticion puntos turisticos", response);
      
      dispatch(setCommentsLastWeek(response.data));
    } catch (error) {
      console.error("Error al cargar los comentarios de la última semana", error);
    }
  };
};

const fetchTouristPointCommentsById = (touristPointId: number) => {
  return async (dispatch: AppDispatch) => {
    // console.log(`${URL}/v2/tourist_points/${touristPointId}/ratings`);
    
    try {
      const response = await apiClient.get(`${URL}/v2/tourist_points/${touristPointId}/ratings`);
      dispatch(setCommentsTouristPoint(response.data));
    } catch (error) {
      console.error("Error al cargar los comentarios del punto turístico", error);
    }
  };
};

export {
  fetchAllTouristPoints,
  fetchTouristPointById,
  createTouristPoint,
  updateTouristPointById,
  deleteTouristPointById,
  resetTouristPoint,
  fetchTouristPointCommentsLastWeek,
  fetchTouristPointCommentsById
}
