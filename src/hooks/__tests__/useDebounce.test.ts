import { renderHook, act } from "@testing-library/react-hooks"
import useDebounce from "../useDebounce"

jest.useFakeTimers()

test("should return initial state as empty string", () => {
	const { result } = renderHook(() => useDebounce(""))
	expect(result.current).toBe("")
})

test("should update value after debounce time", () => {
	const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
		initialProps: { value: "hello" }
	})

	expect(result.current).toBe("")

	act(() => {
		jest.advanceTimersByTime(300)
	})
	expect(result.current).toBe("hello")
	rerender({ value: "world" })

	act(() => {
		jest.advanceTimersByTime(100)
	})
	expect(result.current).toBe("hello")

	act(() => {
		jest.advanceTimersByTime(200)
	})
	expect(result.current).toBe("world")
})
