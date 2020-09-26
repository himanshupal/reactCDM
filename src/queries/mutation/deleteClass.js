import gql from "graphql-tag"

export default gql`
	mutation deleteClass($_id: ID!) {
		deleteClass(_id: $_id)
	}
`
