// partnerReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Partner } from '../../models/PartnerModels';
import { Branch } from '../../models/BranchModels';

export interface PartnerState {
    partnerData: Partner | null;
    selectedBranch: Branch | null;
}

const initialState: PartnerState = {
    partnerData: null,
    selectedBranch: null,
};

const partnerSlice = createSlice({
    name: 'partner',
    initialState,
    reducers: {
        setPartnerData: (state, action: PayloadAction<Partner>) => {
            state.partnerData = action.payload;
        },
    }
});

export const { setPartnerData} = partnerSlice.actions;

export default partnerSlice.reducer;
