import gql from "graphql-tag"

export default gql`
	query notices {
		notices {
			_id
			scope
			subject
			validFor
			createdAt
		}
	}
`
