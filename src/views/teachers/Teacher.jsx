import React from "react"

const Teacher = ({
	match: {
		params: { username },
	},
}) => {
	return <div>Mr. / Ms. / Mrs. _ {username}</div>
}

export default Teacher
