import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
    status: false,
    userData: null,
    role: 'student',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true,
            state.userData = action.payload.email, 
            state.role = action.payload.role
        },
        logout: (state, action) => {
            state.status = false,
            state.userData = null,
            state.role = 'student'
        }
    }
})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;




