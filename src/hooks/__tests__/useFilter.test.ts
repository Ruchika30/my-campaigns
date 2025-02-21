import { renderHook } from "@testing-library/react-hooks"
import { useFilter } from "../useFilter"
import { ICampaign } from "../../features/campaigns/types"

const mockCampaigns: ICampaign[] = [
	{
		id: 1,
		name: "A",
		startDate: "2023-06-01",
		endDate: "2023-12-31",
		userId: 1,
		budget: 5000
	},
	{
		id: 2,
		name: "B",
		startDate: "2024-01-01",
		endDate: "2024-12-31",
		userId: 2,
		budget: 7000
	}
]

test("returns all campaigns if no filters applied", () => {
	const { result } = renderHook(() => useFilter({ campaigns: mockCampaigns }))
	expect(result.current.filteredData).toEqual(mockCampaigns)
})

test("filters campaigns by search term", () => {
	const { result } = renderHook(() =>
		useFilter({ campaigns: mockCampaigns, debouncedValue: "A" })
	)
	expect(result.current.filteredData).toEqual([mockCampaigns[0]])
})

test("filters campaigns within date range", () => {
	const { result } = renderHook(() =>
		useFilter({
			campaigns: mockCampaigns,
			startDateFilter: "2023-01-01",
			endDateFilter: "2023-12-31"
		})
	)

	expect(result.current.filteredData).toEqual([mockCampaigns[0]])
})

test("returns empty if no campaign matches filters", () => {
	const { result } = renderHook(() =>
		useFilter({ campaigns: mockCampaigns, startDateFilter: "2025-01-01" })
	)

	expect(result.current.filteredData).toEqual([]) // No campaigns in 2025
})
