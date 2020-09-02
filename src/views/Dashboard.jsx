import Clock from "react-clock"
import { blake2bHex } from "blakejs"
import { Segment, Input } from "semantic-ui-react"
import React, { useState, useEffect } from "react"

const Home = ({ theme }) => {
	const [time, setTime] = useState(new Date())
	const [hex, setHash] = useState(``)

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<Segment
			inverted={theme}
			textAlign="center"
			style={{ display: `flex`, justifyContent: `center`, alignItems: `center` }}
		>
			<Clock value={time} />
			<Input value={hex} inverted={theme} onChange={(_, { value }) => setHash(blake2bHex(value))} />
		</Segment>
	)
}
export default Home
