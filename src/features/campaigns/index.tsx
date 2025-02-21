import { useEffect, useState } from "react"
import { fetchUsers } from "../../service/campaignSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import CampaignData from "../../service/data.json"
import { ICampaign } from "./types"
import useDebounce from "../../hooks/useDebounce"
import { selectUsers } from "../../service/campaignSlice"
import TableComponent from "./dataTable"
import "./style.css"

function Campaigns() {
	const [campaigns, setCampaigns] = useState<ICampaign[]>([])
	const [searchTerm, setSearchTerm] = useState<string>("")
	const [startDate, setStartDate] = useState<string>("")
	const [endDate, setEndDate] = useState<string>("")
	const dispatch = useDispatch<AppDispatch>()
	const debouncedValue = useDebounce(searchTerm)
	const { users, loading, error } = useSelector(selectUsers)

	useEffect(() => {
		dispatch(fetchUsers())
		setCampaigns(CampaignData)
	}, [dispatch])

	useEffect(() => {
		window.AddCampaigns = (newCampaigns) => {
			if (Array.isArray(newCampaigns)) {
				setCampaigns((prev) => [...prev, ...newCampaigns])
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
		<div className="container">
			<h3>Team Campaigns</h3>
			<div className="tabular-container">
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
			</div>
			<div className="tabular-container">
				<TableComponent
					users={users}
					error={error}
					loading={loading}
					campaigns={campaigns}
					startDateFilter={startDate}
					endDateFilter={endDate}
					debouncedValue={debouncedValue}
				/>
			</div>
		</div>
	)
}

export default Campaigns
