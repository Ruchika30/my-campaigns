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
	const [startDate, setStartDate] = useState<string>("")
	const [endDate, setEndDate] = useState<string>("")
	const dispatch = useDispatch<AppDispatch>()
	const debouncedValue = useDebounce(searchTerm)

	const { users, loading, error } = useSelector(selectUsers)

	useEffect(() => {
		dispatch(fetchUsers())
	}, [dispatch])

	const getFilteredBydate = useCallback(() => {
		return data.filter((row: IRow) => {
			const rowStartDate = new Date(row.startDate)
			const rowEndDate = new Date(row.endDate)

			const start = startDate ? new Date(startDate) : null
			const end = endDate ? new Date(endDate) : null

			const isAfterStart = start ? rowStartDate >= start : true
			const isBeforeEnd = end ? rowEndDate <= end : true

			return isAfterStart && isBeforeEnd
		})
	}, [endDate, startDate])

	/* 
		- Checks for debouncedValue. If present the  returns filtered data
		- Else returns data
	*/
	const getData = useCallback(() => {
		if (debouncedValue) {
			return data.filter((item) =>
				item.name.toLowerCase().includes(debouncedValue)
			)
		}

		if (startDate || endDate) {
			const result = getFilteredBydate()
			return result
		}

		return data
	}, [debouncedValue, endDate, getFilteredBydate, startDate])

	/* 
		- Checks if campaign is active 
		- End data should be more than current date, start date should be of past 
	 */
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
						className="status"
						style={{
							color: active ? "green" : "red",
							border: `1px solid ${active ? "green" : "red"}`
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

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		;(e.target as HTMLInputElement).showPicker()
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
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							placeholder="Start date"
							className="input-field"
							style={{ marginRight: "20px" }}
							onClick={(e) => (e.target as HTMLInputElement).focus()}
							onFocus={handleFocus}
						/>

						<input
							type="date"
							min={startDate}
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							placeholder="End date"
							className="input-field"
							onClick={(e) => (e.target as HTMLInputElement).focus()}
							onFocus={handleFocus}
						/>
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
