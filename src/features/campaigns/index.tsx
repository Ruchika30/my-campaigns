import { useEffect, useState } from "react"
import { fetchUsers } from "./campaignSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import CampaignData from "./data.json"
import { ICampaign } from "./types"
import useDebounce from "../../hooks/useDebounce"
import "./style.css"
import TableComponent from "./tableComponent.tsx"

function Campaigns() {
	const [campaigns, setCampaigns] = useState<ICampaign[]>([])
	const [searchTerm, setSearchTerm] = useState<string>("")
	const [startDate, setStartDate] = useState<string>("")
	const [endDate, setEndDate] = useState<string>("")
	const dispatch = useDispatch<AppDispatch>()
	const debouncedValue = useDebounce(searchTerm)

	useEffect(() => {
		dispatch(fetchUsers())
	}, [dispatch])

	useEffect(() => {
		window.AddCampaigns = (newCampaigns) => {
			if (Array.isArray(newCampaigns)) {
				setCampaigns(newCampaigns)
			} else {
				setCampaigns(CampaignData)
			}
		}

		return () => {
			delete window.AddCampaigns
		}
	}, [])

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

				<TableComponent
					campaigns={campaigns}
					startDate={startDate}
					endDate={endDate}
					debouncedValue={debouncedValue}
				/>
			</div>
		</div>
	)
}

export default Campaigns
