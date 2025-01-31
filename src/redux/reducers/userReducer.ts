import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";
import { Role } from "../../models/RoleModel";
import { Status, TouristComment, TouristCommentId } from "../types/types";


export interface UserState {
    userData: User | {};
    accessToken: string | null;
    rolesUser: Role[] | null;
    users: User[] | []
    roles: Role[] | [];
    statuses: Status[] | [];
    ratingsTouristLastWeek: TouristComment[];
    ratingsTourist: TouristCommentId | null;
}

const initialState: UserState = {
    userData: {},
    accessToken: null,
    rolesUser: null,
    users: [],
    roles: [],
    statuses: [],
    ratingsTouristLastWeek:[],
    ratingsTourist: null
};
const Slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<User>) => {
            const { token, ...userData } = action.payload;
            return {
                ...state,
                userData: userData,
                accessToken: token,
                rolesUser: userData.roles
            };
        },
        logOut: (state, action: PayloadAction<{}>) => {
            state.userData = action.payload;
            state.accessToken = null;
            state.rolesUser = null;
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        setRoles: (state, action: PayloadAction<Role[]>) => {
            state.roles = action.payload;
        },
        setStatuses: (state, action: PayloadAction<Status[]>) => {
            state.statuses = action.payload;
        },
        setCommentsTouristLastWeek: (state, action: PayloadAction<TouristComment[]>) => {
               state.ratingsTouristLastWeek = action.payload;
           },
        setCommentsTourist: (state, action: PayloadAction<TouristCommentId>) => {
               state.ratingsTourist = action.payload;
           },
        cleanCommentsTourist: (state) => {
               state.ratingsTouristLastWeek = [];
               state.ratingsTourist = null;
           },
    }
});

export const { loginUser, logOut, setUsers, setRoles, setStatuses,setCommentsTouristLastWeek,setCommentsTourist, cleanCommentsTourist } = Slice.actions;
export default Slice.reducer;