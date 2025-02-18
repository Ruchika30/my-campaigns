export const isSafeArray = (arr: any[] = []): boolean =>
	!!(arr && Array.isArray(arr) && arr.length)
