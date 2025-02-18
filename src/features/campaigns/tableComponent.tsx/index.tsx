import DataTable from "react-data-table-component"
import { ICampaign, ITableComponent } from "../types"
import { useSelector } from "react-redux"
import { selectUsers } from "../campaignSlice"
import { isSafeArray } from "../../../utils/isSafeArray"
import { useCallback } from "react"
import CampaignData from "../data.json"

function TableComponent({
	campaigns,
	startDate,
	endDate,
	debouncedValue
}: ITableComponent) {
	const { users, loading, error } = useSelector(selectUsers)

	const tableStyle = {
		headCells: {
			style: {
				fontWeight: "bold",
				fontSize: "15px",
				background: "#8dd6fa"
			}
		}
	}

	/* 
		- Checks if campaign is active 
		- End date should be more than current date, start date should be of past 
	 */
	const isActive = (start: string, end: string): boolean => {
		const startDate = new Date(start)
		const endDate = new Date(end)
		const today = new Date()
		return today >= startDate && today <= endDate
	}

	const columns = [
		{
			name: "Name",
			selector: (row: ICampaign) => row.name,
			sortable: true
		},
		{
			name: "User Name",
			selector: (row: ICampaign) => getUserName(row.userId),
			sortable: true
		},
		{
			name: "Start Date",
			selector: (row: ICampaign) => row.startDate,
			sortable: true
		},
		{
			name: "End Date",
			selector: (row: ICampaign) => row.endDate,
			sortable: true
		},
		{
			name: "Active",
			selector: (row: ICampaign) => isActive(row.startDate, row.endDate),
			sortable: true,
			cell: (row: ICampaign) => {
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
			selector: (row: ICampaign) => row.budget.toLocaleString(),
			sortable: true
		}
	]

	const getFilteredBydate = useCallback(() => {
		return isSafeArray(campaigns)
			? campaigns.filter((row: ICampaign) => {
					const rowStartDate = new Date(row.startDate)
					const rowEndDate = new Date(row.endDate)

					const start = startDate ? new Date(startDate) : null
					const end = endDate ? new Date(endDate) : null

					const isAfterStart = start ? rowStartDate >= start : true
					const isBeforeEnd = end ? rowEndDate <= end : true

					return (isAfterStart && isBeforeEnd) || []
				})
			: []
	}, [campaigns, endDate, startDate])

	/* 
		- Checks for debouncedValue. If present the  returns filtered data
		- Else returns data
	*/
	const getData = useCallback(() => {
		if (debouncedValue) {
			return isSafeArray(CampaignData)
				? CampaignData.filter((item) =>
						item.name.toLowerCase().includes(debouncedValue)
					)
				: []
		}

		if (startDate || endDate) {
			const result = getFilteredBydate()
			return result
		}

		return CampaignData || []
	}, [debouncedValue, endDate, getFilteredBydate, startDate])

	const getUserName = (userId: number): string => {
		const user = users.find((u) => u.id === userId)
		return user ? user.name : "Unknown User"
	}

	if (error) return <p className="text-red-500">Error: {error}</p>

	return (
		<>
			<DataTable
				customStyles={tableStyle}
				columns={columns}
				data={getData()}
				progressPending={loading}
			/>
		</>
	)
}

export default TableComponent
