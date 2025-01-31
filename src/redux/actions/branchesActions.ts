import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { addBranch, cleanBranch, deleteBranch, setAllBranches, setBranch, setCommentsBranch, setCommentsBranchLastWeek, updateBranch } from "../reducers/branchReducer";
import { Branch, BranchUpload } from "../types/types";
import { AppDispatch } from "../store/store";

const URL = import.meta.env.VITE_API_URL;

// Obtener todas las sucursales
const fetchAllBranches = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/branches`);
      dispatch(setAllBranches(response.data));
    } catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  };
};

// Obtener una sucursal por ID
const fetchBranchById = (branchId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/branches/${branchId}`);
      // console.log("data de la respuesta en sucursal",response.data);
      
      dispatch(setBranch(response.data));
    } catch (error) {
      console.error(`Error al obtener la sucursal ${branchId}:`, error);
    }
  };
};

// Crear una nueva sucursal
const createBranch = (branchData: Branch) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}/branches`, branchData);
      dispatch(addBranch(response.data));
      return response;
    } catch (error) {
      console.error("Error al crear una nueva sucursal:", error);
    }
  };
};

// Actualizar una sucursal existente
const updateBranchById = (branchId: number, branchData: BranchUpload) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put(`${URL}/branches/${branchId}`, branchData);
      // console.log("respuesta en la actuailzacion........",response);
      
      dispatch(updateBranch(response.data));
      return response;
    } catch (error) {
      console.error(`Error al actualizar la sucursal ${branchId}:`, error);
    }
  };
};

// Eliminar una sucursal
const deleteBranchById = (branchId: number, branchData: any) => {
  return async (dispatch: Dispatch) => {
    try {
        const response = await axios.put(`${URL}/branches/${branchId}`, branchData);
        dispatch(deleteBranch(branchId));
        return response;
    } catch (error) {
      console.error(`Error al eliminar la sucursal ${branchId}:`, error);
    }
  };
};

const resetBranch = () => {
  return async (dispatch: Dispatch) => {
    try {
      return dispatch(cleanBranch(null));
    } catch (error) {
      console.error(`Error al limpiar la sucursal `, error);
    }
  };
};
const inactivateBranch = (branchId: number, statusId: number | undefined) => {
  return async (dispatch: Dispatch) => {
    try {

      // Primero, actualizamos el estado de la sucursal
      const branchResponse = await axios.put(`${URL}/branches/${branchId}`, {
        status_id: statusId,
      })
      // , {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      console.log('Sucursal marcada como inactiva:', branchResponse.data);
      dispatch(updateBranch(branchResponse.data));
    } catch (error) {
      console.error('Error al actualizar el estado de la sucursal y promociones:', error);
      throw error; 
    }
  };
};

const fetchBranchCommentsLastWeek = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get(`${URL}/branches/ratings/last_4_weeks`);
      console.log("respuesta de peticion puntos turisticos", response);
      
      dispatch(setCommentsBranchLastWeek(response.data));
    } catch (error) {
      console.error("Error al cargar los comentarios de la última semana", error);
    }
  };
};

const fetchBranchCommentsById = (BranchId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get(`${URL}/branches/admin/${BranchId}/ratings/all`);
      console.log("respuesta de peticion de la sucursal idd",response);
      
      dispatch(setCommentsBranch(response.data));
    } catch (error) {
      console.error("Error al cargar los comentarios del punto turístico", error);
    }
  };
};

export {
  fetchAllBranches,
  fetchBranchById,
  createBranch,
  updateBranchById,
  deleteBranchById,
  resetBranch,
  inactivateBranch,
  fetchBranchCommentsLastWeek,
  fetchBranchCommentsById
};
