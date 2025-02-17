import { useEffect } from "react"
import { fetchUsers, selectUsers } from "./campaignSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import DataTable from "react-data-table-component"
import data from "./data.json"
import { IRow } from "./types"

function Campaigns() {
	const dispatch = useDispatch<AppDispatch>()
	const { users, loading, error } = useSelector(selectUsers)

	useEffect(() => {
		dispatch(fetchUsers())
	}, [dispatch])

	const isActive = (start: string, end: string): boolean => {
		const startDate = new Date(start)
		const endDate = new Date(end)
		const today = new Date()
		return today >= startDate && today <= endDate
	}

	if (error) return <p className="text-red-500">Error: {error}</p>

	const getUserName = (userId: number): string => {
		const user = users.find((u) => u.id === userId)
		return user ? user.name : "Unknown User"
	}

	const columns = [
		{
			name: "Campaign Name",
			selector: (row: IRow) => row.name,
			sortable: true
		},
		{
			name: "User Name",
			selector: (row: IRow) => getUserName(row.userId),
			sortable: true
		},
		{
			name: "Start Date",
			selector: (row: IRow) => row.startDate,
			sortable: true
		},
		{
			name: "End Date",
			selector: (row: IRow) => row.endDate,
			sortable: true
		},
		{
			name: "Active",
			selector: (row: IRow) => isActive(row.startDate, row.endDate),
			sortable: true,
			cell: (row: IRow) => {
				const active = isActive(row.startDate, row.endDate)

				return (
					<span
						style={{
							border: `1px solid ${active ? "green" : "red"}`,
							padding: "5px",
							borderRadius: "5px",
							color: active ? "green" : "red"
						}}
					>
						{active ? "Active" : "Inactive"}
					</span>
				)
			}
		},
		{
			name: "Budget ($)",
			selector: (row: IRow) => row.budget.toLocaleString(),
			sortable: true,
			right: true
		}
	]

	return (
		<div style={{ margin: "5%" }}>
			<h3>Campaigns</h3>
			<div
				style={{
					border: "1px solid grey"
				}}
			>
				<DataTable columns={columns} data={data} progressPending={loading} />
			</div>
		</div>
	)
}

export default Campaigns
