import { Dispatch } from "@reduxjs/toolkit";
// import axios from "axios";
import { setPartnerData} from "../reducers/partnerReducer";

import { PartnerCreate } from "../../models/PartnerModels";
import apiClient from "../../api/axiosConfig";

const URL = import.meta.env.VITE_API_URL;

// Crear un nuevo partner
const createPartner = (partnerData:PartnerCreate) => {
  return async () => {
    try {
      const response = await apiClient.post(`${URL}/partners`, partnerData);
      // dispatch(setPartnerData(response.data));
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo partner:", error);
      throw error;
    }
  };
};

// Obtener datos de un Partner por ID
const fetchPartnerById = (partnerId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await apiClient.get(`${URL}/partners/${partnerId}`);
      console.log("respuesta en acition", response);
      
      dispatch(setPartnerData(response.data));
      return response
    } catch (error) {
      console.error(`Error al obtener los datos del partner ${partnerId}:`, error);
    }
  };
};

// actualizar datos de un Partner por ID
const updatePartner = (partnerId: number, data: any) => {
  return async (dispatch: Dispatch) => {
    try {
      // Incluye `data` en la solicitud `PUT`
      const response = await apiClient.put(`${URL}/partners/${partnerId}`, data);
      // console.log("respuesta partner",response);
      
      dispatch(setPartnerData(response.data));
      return response
    } catch (error) {
      console.error(`Error al actualizar los datos del partner ${partnerId}:`, error);
      throw error; // Re-lanzar el error para manejarlo en el componente si es necesario
    }
  };
};
// Acción para obtener sucursales de un socio
const fetchBranchesByPartner = (partnerId: number) => {
  return async () => {
    try {
      const response = await apiClient.get(`${URL}/partners/${partnerId}/branches`); // Asumiendo que esta es la ruta correcta
      // console.log("Sucursales del socio", response.data);
      return response.data; // Retorna las sucursales si es necesario en el componente
    } catch (error) {
      console.error(`Error al obtener las sucursales del partner ${partnerId}:`, error);
      throw error; // Puedes lanzar el error si necesitas manejarlo en el componente
    }
  };
};

export { fetchPartnerById, createPartner, updatePartner, fetchBranchesByPartner };

