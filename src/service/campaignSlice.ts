import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../app/store"

export interface User {
	id: number
	name: string
	username?: string
	email?: string
	address?: Address
	phone?: string
	website?: string
	company?: Company
}
export interface Address {
	street: string
	suite: string
	city: string
	zipcode: string
	geo: Geo
}
export interface Geo {
	lat: string
	lng: string
}
export interface Company {
	name: string
	catchPhrase: string
	bs: string
}

export interface UserState {
	users: User[]
	loading: boolean
	error: boolean
}

const initialState: UserState = {
	users: [],
	loading: false,
	error: false
}

// Thunk function
export const fetchUsers = createAsyncThunk("campaigns/fetch", async () => {
	const response = await fetch("https://jsonplaceholder.typicode.com/users")
	return response.json()
})

//Reducer functions
const userSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true
				state.error = false
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false
				state.users = action.payload
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false
				state.error = true
			})
	}
})

//Selector
export const selectUsers = (state: RootState) => state.users

export default userSlice.reducer
