declare global {
	interface Window {
		AddCampaigns?: (campaigns: ICampaign[]) => void
	}
}

export interface ITableComponent {
	campaigns: ICampaign[]
	startDate: string
	endDate: string
	debouncedValue: string
}

export interface ICampaign {
	name: string
	id: number
	startDate: string
	endDate: string
	budget: number
	userId: number
}
