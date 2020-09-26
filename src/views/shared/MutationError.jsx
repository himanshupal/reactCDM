import React from "react"
import { toast } from "react-toastify"

const MutationError = ({ graphQLErrors, networkError, message }) =>
	toast.error(
		<>
			<h3 style={{ margin: 0 }}>{message.split(`: `)[1]}</h3>
			{!networkError && <h5 style={{ margin: 0 }}>{graphQLErrors[0].extensions.error}</h5>}
		</>
	)

export default MutationError
