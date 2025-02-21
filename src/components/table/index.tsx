import DataTable from "react-data-table-component"
import { ICampaign } from "../../features/campaigns/types"

interface ITableComponent {
	columns: {
		name: string
		selector: (row: ICampaign) => boolean | string
		sortable: boolean
		cell?: (row: ICampaign) => JSX.Element
	}[]
	data: ICampaign[]
	loading: boolean
}

function TableComponent({ columns, data, loading }: ITableComponent) {
	const tableStyle = {
		headCells: {
			style: {
				fontWeight: "bold",
				fontSize: "15px",
				background: "#8dd6fa"
			}
		},
		cells: {
			style: {
				fontSize: "15px"
			}
		}
	}

	return (
		<DataTable
			customStyles={tableStyle}
			columns={columns}
			data={data}
			progressPending={loading}
		/>
	)
}

export default TableComponent
