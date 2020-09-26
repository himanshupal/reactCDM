import React from "react"

const Loading = ({ theme }) => (
	<div style={{ display: `grid`, placeItems: `center`, minHeight: `calc(100vh - 5.5rem)` }}>
		<div className="loading_parent">
			<div className="loading_child">
				<div></div>
			</div>
		</div>
	</div>
)

export default Loading
