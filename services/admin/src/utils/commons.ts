import { isNumber } from '@stranerd/validate'

export const catchDivideByZero = (num: number, den: number) => den === 0 ? 0 : num / den

export const formatNumber = (num: number, dp?: number) => Intl
	.NumberFormat('en', { notation: 'compact', ...(dp ? { maximumFractionDigits: dp } : {}) })
	.format(isNumber(num).valid ? Math.abs(num) : 0)

export const pluralize = (count: number, singular: string, plural: string) => Math.round(count) === 1 ? singular : plural

export const getRandomValue = () => Date.now() + Math.random().toString(36)

export const capitalize = (value: string) => value.trim().split(' ').map((c: string) => (c[0]?.toUpperCase() ?? '') + c.slice(1)).join(' ')

export const groupBy = <Type, Unique extends string | number> (array: Array<Type>, func: (item: Type) => Unique) => {
	return array.reduce((acc, cur) => {
		const key = func(cur)
		const index = acc.findIndex((a) => a.key === key)
		if (index === -1) acc.push({ key, values: [cur] })
		else acc[index].values.push(cur)
		return acc
	}, [] as { key: Unique, values: Type[] }[]) as { key: Unique, values: Type[] }[]
}

export const copyObject = <T extends Record<any, any>> (target: T, ...sources: T[]) => Object.assign(target, ...sources)

export const getAlphabet = (num: number) => 'abcdefghijklmnopqrstuv'.split('')[num - 1] ?? 'a'

export const getPercentage = (num: number, den: number) => catchDivideByZero(num, den) * 100

export const addToArray = <T> (array: T[], item: T, getKey: (a: T) => any, getComparer: (a: T) => number | string, asc = false) => {
	const existingIndex = array.findIndex((el) => getKey(el) === getKey(item))
	const index = array.findIndex((el) => asc ? getComparer(el) >= getComparer(item) : getComparer(el) <= getComparer(item))
	if (existingIndex !== -1 && existingIndex === index) {
		array.splice(existingIndex, 1, item)
		return array
	}
	if (existingIndex !== -1 && existingIndex !== index) array.splice(existingIndex, 1)
	if (index !== -1) array.splice(index, 0, item)
	else if (array.length === 0) array.push(item)
	else {
		const existingIsGreater = getComparer(array[0]) >= getComparer(item)
		if (existingIsGreater) asc ? array.unshift(item) : array.push(item)
		else asc ? array.push(item) : array.unshift(item)
	}
	return array
}