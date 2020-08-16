import React from "react"

const Notify = ({ list }) =>
	list.map((msg, idx) => (
		<div key={idx} className={msg.error ? `ui error message` : `ui success message`}>
			{!msg.message && msg.error && <h3>{msg.error}</h3>}
			{msg.message && msg.error && (
				<>
					<h3>{msg.message}</h3>
					<h5>{msg.error}</h5>
				</>
			)}
			{msg.message && !msg.error && <h3>{msg.message}</h3>}
		</div>
	))

export default Notify
