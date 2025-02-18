import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import TableComponent from "../index"
import { ICampaign } from "../../types"

const mockStore = configureStore([])

const mockCampaigns: ICampaign[] = [
	{
		id: 1,
		name: "Campaign 1",
		startDate: "9/19/2022",
		endDate: "3/9/2023",
		budget: 5000,
		userId: 1
	},
	{
		id: 2,
		name: "Campaign 2",
		startDate: "9/19/2018",
		endDate: "3/9/2026",
		budget: 3000,
		userId: 2
	}
]

const mockUsers = [
	{
		id: 1,
		name: "User A",
		username: "User A",
		email: "Sincere@april.biz",
		address: {
			street: "Kulas Light",
			suite: "Apt. 556",
			city: "Gwenborough",
			zipcode: "92998-3874",
			geo: {
				lat: "-37.3159",
				lng: "81.1496"
			}
		},
		phone: "1-770-736-8031 x56442",
		website: "hildegard.org",
		company: {
			name: "Romaguera-Crona",
			catchPhrase: "Multi-layered client-server neural-net",
			bs: "harness real-time e-markets"
		}
	},
	{
		id: 2,
		name: "User B",
		username: "User B",
		email: "Shanna@melissa.tv",
		address: {
			street: "Victor Plains",
			suite: "Suite 879",
			city: "Wisokyburgh",
			zipcode: "90566-7771",
			geo: {
				lat: "-43.9509",
				lng: "-34.4618"
			}
		},
		phone: "010-692-6593 x09125",
		website: "anastasia.net",
		company: {
			name: "Deckow-Crist",
			catchPhrase: "Proactive didactic contingency",
			bs: "synergize scalable supply-chains"
		}
	},
	{ id: 2, name: "User B" }
]

const renderComponent = (others = {}) => {
	const store = mockStore({
		campaign: {
			users: mockUsers,
			loading: false,
			error: false
		}
	})

	const props = {
		users: mockUsers,
		startDate: "3/5/2021",
		endDate: "10/2/2026",
		debouncedValue: "",
		loading: false,
		error: false,
		...others
	}

	return render(
		<Provider store={store}>
			<TableComponent campaigns={mockCampaigns} {...props} />
		</Provider>
	)
}

describe("TableComponent", () => {
	test("renders the table with campaign data", () => {
		renderComponent()
		expect(screen.getByText("Campaign 1")).toBeInTheDocument()
		expect(screen.getByText("Campaign 2")).toBeInTheDocument()
		expect(screen.getByText("Budget ($)")).toBeInTheDocument()
	})

	test("displays the correct user name", () => {
		renderComponent()
		expect(screen.getByText("User A")).toBeInTheDocument()
		expect(screen.getByText("User B")).toBeInTheDocument()
	})

	test("displays active and inactive status correctly", () => {
		renderComponent()
		const activeStatus = screen.getAllByText("Active")
		const inactiveStatus = screen.getAllByText("Inactive")

		expect(activeStatus.length).toBeGreaterThanOrEqual(1)
		expect(inactiveStatus.length).toBeGreaterThanOrEqual(1)
	})

	test("filters campaigns based on search (debouncedValue)", async () => {
		renderComponent({ debouncedValue: "campaign" })
		expect(screen.getByText("Campaign 1")).toBeInTheDocument()
		expect(screen.queryByText("test")).not.toBeInTheDocument()
	})

	test("filters campaigns based on startDate and endDate", () => {
		renderComponent({ startDate: "9/19/2021", endDate: "3/9/2023" })
		expect(screen.getByText("Campaign 1")).toBeInTheDocument()
	})

	test("shows loading state when data is fetching", () => {
		renderComponent({ loading: true })
		expect(screen.getByText(/Loading/i)).toBeInTheDocument()
	})

	test("displays error message when API fails", () => {
		renderComponent({ error: true })
		expect(screen.getByText(/Error:/i)).toBeInTheDocument()
	})
})
