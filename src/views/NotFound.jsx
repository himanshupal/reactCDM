import React from "react"
import { Segment } from "semantic-ui-react"

const NotFound = () => {
	document.title = `Ooops...`

	return (
		<div style={{ minWidth: `100vw`, minHeight: `100vh`, display: `grid`, placeItems: `center` }}>
			<Segment
				piled
				color="red"
				inverted
				style={{ display: `flex`, flexDirection: `column`, alignItems: `flex-end` }}
			>
				<h1>PAGE NOT FOUND</h1>
				<p>¯\_(ツ)_/¯</p>
			</Segment>
		</div>
	)
}

export default NotFound
