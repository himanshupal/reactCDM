import React from "react"
import { Segment } from "semantic-ui-react"

const Performance = ({ theme }) => {
	return (
		<Segment.Group>
			<Segment inverted={theme}>Seg 3</Segment>
			<Segment inverted={theme}>Seg 2</Segment>
			<Segment inverted={theme}>Seg 1</Segment>
		</Segment.Group>
	)
}

export default Performance
