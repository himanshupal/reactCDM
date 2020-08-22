import Clock from "react-clock"
import { Segment } from "semantic-ui-react"
import React, { useState, useEffect } from "react"

const Home = ({ theme }) => {
	const [time, setTime] = useState(new Date())

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<Segment inverted={theme} textAlign="center" style={{ display: `flex`, justifyContent: `center` }}>
			<Clock value={time} />
		</Segment>
	)
}
export default Home
