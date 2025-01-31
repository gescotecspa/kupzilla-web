import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TouristPoint } from "../../models/TouristPoint";
import { TouristPointComment, TouristPointCommentId } from "../types/types";

export interface TouristPointState {
    allTouristPoints: TouristPoint[];
    selectedTouristPoint: TouristPoint | null;
    commentsLastWeek: TouristPointComment[];
    commentsTouristPoint: TouristPointCommentId | null;
}

const initialState: TouristPointState = {
    allTouristPoints: [],
    selectedTouristPoint: null,
    commentsLastWeek: [],
    commentsTouristPoint: null, 
  };

const touristPointSlice = createSlice({
    name: 'touristPoints',
    initialState,
    reducers: {
        setAllTouristPoints: (state, action: PayloadAction<TouristPoint[]>) => {
            state.allTouristPoints = action.payload;
        },
        setSelectedTouristPoint: (state, action: PayloadAction<TouristPoint | null>) => {
            state.selectedTouristPoint = action.payload;
        },
        addTouristPoint: (state, action: PayloadAction<TouristPoint>) => {
            state.allTouristPoints.push(action.payload);
        },
        updateTouristPoint: (state, action: PayloadAction<Partial<TouristPoint>>) => {
            const index = state.allTouristPoints.findIndex((point:any) => point.id === action.payload.id);
            if (index >= 0) {
                // Combina los datos existentes con los nuevos datos proporcionados
                state.allTouristPoints[index] = {
                    ...state.allTouristPoints[index],
                    ...action.payload,
                };
            }
        },
        deleteTouristPoint: (state, action: PayloadAction<number>) => {
            state.allTouristPoints = state.allTouristPoints.filter((point:any) => point.id !== action.payload);
            if (state.selectedTouristPoint?.id === action.payload) state.selectedTouristPoint = null;
        },
        cleanTouristPoint: (state, action: PayloadAction<TouristPoint | null>) => {
              state.selectedTouristPoint = action.payload;
        },
        setCommentsLastWeek: (state, action: PayloadAction<TouristPointComment[]>) => {
                state.commentsLastWeek = action.payload;
        },
        setCommentsTouristPoint: (state, action: PayloadAction<TouristPointCommentId>) => {
                state.commentsTouristPoint = action.payload;
        },
        cleanCommentsTouristPoint: (state) => {
            state.commentsLastWeek = [];
            state.commentsTouristPoint = null;
        },
    }
});

export const {
    setAllTouristPoints,
    setSelectedTouristPoint,
    addTouristPoint,
    updateTouristPoint,
    deleteTouristPoint,
    cleanTouristPoint,
    setCommentsLastWeek,
    setCommentsTouristPoint,
    cleanCommentsTouristPoint
} = touristPointSlice.actions;

export default touristPointSlice.reducer;
