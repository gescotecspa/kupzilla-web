import { Dispatch } from "@reduxjs/toolkit";
// import axios from "axios";
import {
  setAllPromotions,
  setBranchPromotions,
  setSelectedPromotion,
  addPromotion,
  updatePromotion
} from "../reducers/promotionReducer";
import { Promotion } from "../../models/PromotionModel";
import apiClient from "../../api/axiosConfig";

const URL = import.meta.env.VITE_API_URL;




// Obtener todas las promociones
const fetchAllPromotions = (keyword: string = "descuento") => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.get(`${URL}/promotions`, {
        params: { keyword }, // Enviamos el filtro como parámetro en la URL
      });
      console.log("🔍 Promociones obtenidas de la API:", response.data);
      dispatch(setAllPromotions(response.data));
    } catch (error) {
      console.error("X Error al obtener todas las promociones:", error);
    }
  };
};



// Obtener promociones de un branch específico
const fetchBranchPromotions = (branchId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.get(`${URL}/branches/${branchId}/promotions`);
      dispatch(setBranchPromotions(response.data));
    } catch (error) {
      console.error(`Error al obtener las promociones del branch ${branchId}:`, error);
    }
  };
};

// Obtener una promoción por ID
const fetchPromotionById = (promotionId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.get(`${URL}/promotions/${promotionId}`);
      dispatch(setSelectedPromotion(response.data));
    } catch (error) {
      console.error(`Error al obtener la promoción ${promotionId}:`, error);
    }
  };
};

// Crear una nueva promoción
const createPromotion = (promotionData: Promotion) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.post(`${URL}/promotions`, promotionData);
      // console.log("respuesta de la creacion", promotionData);
      
      dispatch(addPromotion(response.data));
    } catch (error) {
      console.error("Error al crear una nueva promoción:", error);
    }
  };
};

// Actualizar una promoción existente
const updatePromotionById = (promotionId: number, promotionData: Promotion, deletedImageIds: number[]) => {
  return async (dispatch: Dispatch) => {
    const imgDelete = {'image_ids': deletedImageIds}
    try {
      if(deletedImageIds.length){
        const responseDeleted= await apiClient.post(`${URL}/promotion_images/delete`, imgDelete );
      console.log(responseDeleted);}
      
      const responseUpdate = await apiClient.put(`${URL}/promotions/${promotionId}`, promotionData);
      // console.log("respuesta de la actualizacion",responseUpdate.data);
      
      dispatch(updatePromotion(responseUpdate.data));
    } catch (error) {
      console.error(`Error al actualizar la promoción ${promotionId}:`, error);
    }
  };
};

// Eliminar una promoción ----- Borrado lógico ------
const deletePromotionById = (promotionId: number, status: any) => {
  // console.log("status en action",status);
  
  return async (dispatch: Dispatch) => {
    try {

      const responseUpdate = await apiClient.put(`${URL}/promotions/${promotionId}`, {status_id:status[0].id});
      // console.log("respuesta de la eliminacion",responseUpdate);
      
      dispatch(updatePromotion(responseUpdate.data));
    } catch (error) {
      console.error(`Error al eliminar la promoción ${promotionId}:`, error);
    }
  };
};

export {
  fetchAllPromotions,
  fetchBranchPromotions,
  fetchPromotionById,
  createPromotion,
  updatePromotionById,
  deletePromotionById,
};
