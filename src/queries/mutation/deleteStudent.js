import gql from "graphql-tag"

export default gql`
	mutation deleteStudent($_id: ID!) {
		deleteStudent(_id: $_id)
	}
`
