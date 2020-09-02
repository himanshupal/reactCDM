import React from "react"

const Error = ({ theme }) => (
	<div style={{ display: `grid`, placeItems: `center`, minHeight: `inherit` }}>
		<h1>Connection Error</h1>
		<h5 style={{ margin: 0 }}>Make sure you have a working Internet Connection</h5>
	</div>
)

export default Error
