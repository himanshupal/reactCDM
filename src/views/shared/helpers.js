export const getName = name => (name.last ? `${name.first} ${name.last.toLowerCase()}` : name.first)

export const getTime = time =>
	`${new Date(time).toString().slice(0, 15)} ${new Date(time).toLocaleTimeString()}`
