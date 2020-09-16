import gql from "graphql-tag"

export default gql`
	mutation deleteTeacher($_id: ID!) {
		deleteTeacher(_id: $_id)
	}
`
