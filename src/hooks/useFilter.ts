import { useCallback } from "react"
import { isSafeArray } from "../utils/isSafeArray"
import { ICampaign } from "../features/campaigns/types"

interface IFilterProps {
	debouncedValue?: string
	campaigns?: ICampaign[]
	startDateFilter?: string
	endDateFilter?: string
}

export const useFilter = ({
	debouncedValue,
	campaigns = [],
	endDateFilter,
	startDateFilter
}: IFilterProps) => {
	const getFilteredByDate = useCallback(() => {
		const list = isSafeArray(campaigns)
			? campaigns.filter((row: ICampaign) => {
					const rowStartDate = new Date(row.startDate)
					const rowEndDate = new Date(row.endDate)

					const start = startDateFilter ? new Date(startDateFilter) : null
					const end = endDateFilter ? new Date(endDateFilter) : null

					const isAfterStart = start ? rowStartDate >= start : true
					const isBeforeEnd = end ? rowEndDate <= end : true

					return isAfterStart && isBeforeEnd
				})
			: []

		return list
	}, [campaigns, endDateFilter, startDateFilter])

	/* 
		Returns filtered campaign data based on:
		1. Search query (debouncedValue): Filters campaigns whose names contain the query (case-insensitive).
		2. Date range (startDate & endDate): Filters campaigns that fall within the selected date range.
		3. Default: Returns all campaigns if no filters are applied.
	*/
	const getData = () => {
		if (debouncedValue) {
			return isSafeArray(campaigns)
				? campaigns.filter((item: ICampaign) =>
						item.name.toLowerCase().includes(debouncedValue.toLowerCase())
					)
				: []
		}

		if (startDateFilter || endDateFilter) {
			return getFilteredByDate()
		}

		return campaigns
	}

	return { filteredData: getData() }
}
