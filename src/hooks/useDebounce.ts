import { useEffect, useState } from "react"

const useDebounce = (value: string) => {
	const [query, setQuery] = useState("")

	useEffect(() => {
		const dv = setTimeout(() => {
			setQuery(value)
		}, 300)

		return () => clearTimeout(dv)
	}, [value])

	return query
}

export default useDebounce
