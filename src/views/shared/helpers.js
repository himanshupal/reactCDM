export const getName = name => (name.last ? `${name.first} ${name.last.toLowerCase()}` : name.first)

export const getTime = time =>
	time && `${new Date(time).toDateString()} ${new Date(time).toLocaleTimeString()}`

export const getDate = date => date && new Date(date).toDateString()

export const getSundays = (month, year) => {
	let dates = []
	const firstDay = new Date(year, month, 1).getDay()
	if (firstDay === 0) dates = [...dates, 0]
	for (let d = 7 - firstDay; d <= new Date(year, month + 1, 0).getDate(); d += 7)
		dates = [...dates, d]
	return dates
}
