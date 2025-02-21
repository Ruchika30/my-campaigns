import { User } from "../../../service/campaignSlice"

export const getUserName = (users: User[], userId: number): string => {
	const user = users?.find((u) => u.id === userId)
	return user ? user.name : "Unknown User"
}
