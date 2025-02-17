import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface User {
	id: number
	name: string
	username: string
	email: string
	address: Address
	phone: string
	website: string
	company: Company
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
	error: string | null
}

const initialState: UserState = {
	users: [],
	loading: false,
	error: null
	// value: [
	// 	{
	// 		id: 0,
	// 		name: "Unknown User",
	// 		username: "unknown",
	// 		email: "unknown@example.com",
	// 		address: {
	// 			street: "Unknown Street",
	// 			suite: "Unknown Suite",
	// 			city: "Unknown City",
	// 			zipcode: "00000",
	// 			geo: {
	// 				lat: "0.0000",
	// 				lng: "0.0000"
	// 			}
	// 		},
	// 		phone: "000-000-0000",
	// 		website: "unknown.com",
	// 		company: {
	// 			name: "Unknown Company",
	// 			catchPhrase: "N/A",
	// 			bs: "N/A"
	// 		}
	// 	}
	// ],
	// status: "idle"
}

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
				state.error = null
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false
				state.users = action.payload
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || "Failed to fetch users"
			})
	}
})

// export const {} = campaignSlice.actions;

//Selector
export const selectUsers = (state: RootState) => state.users

export default userSlice.reducer
