import { useCallback, useEffect, useState } from "react"
import { fetchUsers, selectUsers } from "./campaignSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import DataTable from "react-data-table-component"
import data from "./data.json"
import { IRow } from "./types"
import useDebounce from "../../hooks/useDebounce"
import "./style.css"

function Campaigns() {
	const [searchTerm, setSearchTerm] = useState<string>("")

	const dispatch = useDispatch<AppDispatch>()
	const debouncedValue = useDebounce(searchTerm)

	const { users, loading, error } = useSelector(selectUsers)

	useEffect(() => {
		dispatch(fetchUsers())
	}, [dispatch])

	const getData = useCallback(() => {
		if (debouncedValue)
			return data.filter((item) =>
				item.name.toLowerCase().includes(debouncedValue)
			)

		return data
	}, [debouncedValue])

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

	const tableStyle = {
		headCells: {
			style: {
				fontWeight: "bold",
				fontSize: "15px",
				background: "#8dd6fa"
			}
		}
	}

	const columns = [
		{
			name: "Name",
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
			sortable: true
		}
	]

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value.toLowerCase())
	}

	return (
		<div style={{ margin: "5%" }}>
			<h3>Team Campaigns</h3>
			<div
				style={{
					border: "1px solid grey"
				}}
			>
				{/* Filters */}
				{/* <FilterComponent /> */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						padding: "10px"
					}}
				>
					{/* Search by name */}
					<div>
						<input
							className="input-field"
							placeholder="Search by Name"
							onChange={handleChange}
						/>
					</div>

					{/* Search by dates */}
					<div>
						<input className="input-field" />
						<input className="input-field" />
					</div>
				</div>

				<DataTable
					customStyles={tableStyle}
					columns={columns}
					data={getData()}
					progressPending={loading}
				/>
			</div>
		</div>
	)
}

export default Campaigns
