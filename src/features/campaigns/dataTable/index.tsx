import { ICampaign, ITableComponent } from "../types"
import { getUserName } from "./utils"
import { useFilter } from "../../../hooks/useFilter"
import DataTableComponent from "../../../components/table"

function TableComponent({
	error,
	users,
	loading,
	campaigns,
	startDateFilter,
	endDateFilter,
	debouncedValue
}: ITableComponent): JSX.Element {
	const { filteredData } = useFilter({
		debouncedValue,
		campaigns,
		endDateFilter,
		startDateFilter
	})

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
			selector: (row: ICampaign) => getUserName(users, row.userId),
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

	if (error) return <p className="text-red-500">Error: {error}</p>

	return (
		<>
			<DataTableComponent
				loading={loading}
				columns={columns}
				data={filteredData}
			/>
		</>
	)
}

export default TableComponent
