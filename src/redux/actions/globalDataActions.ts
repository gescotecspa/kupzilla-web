import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { addCategory, editCategory, setCategories, setCountries } from "../reducers/globalDataReducer";

const URL = import.meta.env.VITE_API_URL;

export const fetchCategories = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/categories`);
      // console.log("respuesta de categorias", response);
      
      dispatch(setCategories(response.data));
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };
};

// Acción para agregar una nueva categoría
export const addNewCategory = (category: { name: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}/categories`, category);
      if (response.status === 200) {
        
        return dispatch(addCategory(response.data));
      }
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
    }
  };
};

export const updateCategory = (id: number, name: string) => {
  return async (dispatch: Dispatch) => {
    try {
      await axios.put(`${URL}/categories/${id}`, { name });
      dispatch(editCategory({ id, name }));
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
    }
  };
};

export const fetchCountries = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/countries`);
      dispatch(setCountries(response.data));
    } catch (error) {
      console.error("Error al obtener los países:", error);
    }
  };
};
