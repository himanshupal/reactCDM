import gql from "graphql-tag"

export default gql`
	mutation deleteNotice($_id: ID!) {
		deleteNotice(_id: $_id)
	}
`
