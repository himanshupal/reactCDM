import gql from "graphql-tag"

export default gql`
	mutation deleteSubject($_id: ID!) {
		deleteSubject(_id: $_id)
	}
`
