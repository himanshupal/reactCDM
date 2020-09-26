import gql from "graphql-tag"

export default gql`
	query departments {
		departments {
			_id
			name
		}
	}
`
