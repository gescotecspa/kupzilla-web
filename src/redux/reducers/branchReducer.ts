import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BranchComment, BranchCommentId } from "../types/types";

export interface Branch {
  branch_id: number;
  name: string;
  address: string;
  description: string;
  status: {
    name: string;
  };
  image_url: string;
}

export interface BranchState {
  allBranches: Branch[];
  selectedBranch: Branch | null;
  commentsBranchLastWeek: BranchComment[];
  commentsBranch: BranchCommentId | null;
}

const initialState: BranchState = {
  allBranches: [],
  selectedBranch: null,
  commentsBranchLastWeek:[],
  commentsBranch:null
};

const branchReducer = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    setAllBranches: (state, action: PayloadAction<Branch[]>) => {
      state.allBranches = action.payload;
    },
    setBranch: (state, action: PayloadAction<Branch | null>) => {
      state.selectedBranch = action.payload;
    },
    cleanBranch: (state, action: PayloadAction<Branch | null>) => {
      state.selectedBranch = action.payload;
    },
    addBranch: (state, action: PayloadAction<Branch>) => {
      state.allBranches.push(action.payload);
    },
    updateBranch: (state, action: PayloadAction<Partial<Branch>>) => {
      const index = state.allBranches.findIndex((branch) => branch.branch_id === action.payload.branch_id);
      if (index >= 0) {
        state.allBranches[index] = {
          ...state.allBranches[index],
          ...action.payload,
        };
      }
    },
    deleteBranch: (state, action: PayloadAction<number>) => {
      state.allBranches = state.allBranches.filter((branch) => branch.branch_id !== action.payload);
      if (state.selectedBranch?.branch_id === action.payload) {
        state.selectedBranch = null;
      }
    },
    setCommentsBranchLastWeek: (state, action: PayloadAction<BranchComment[]>) => {
        state.commentsBranchLastWeek = action.payload;
    },
    setCommentsBranch: (state, action: PayloadAction<BranchCommentId>) => {
        state.commentsBranch = action.payload;
    },
    cleanCommentsBranch: (state) => {
        state.commentsBranchLastWeek = [];
        state.commentsBranch = null;
    },
  },
});

export const {
  setAllBranches,
  setBranch,
  addBranch,
  updateBranch,
  deleteBranch,
  cleanBranch,
  setCommentsBranchLastWeek,
  setCommentsBranch,
  cleanCommentsBranch
} = branchReducer.actions;

export default branchReducer.reducer;
