export const getName = name => (name.last ? `${name.first} ${name.last.toLowerCase()}` : name.first)

export const getTime = time =>
	time && `${new Date(time).toDateString()} ${new Date(time).toLocaleTimeString()}`

export const getDate = date => date && new Date(date).toDateString()
