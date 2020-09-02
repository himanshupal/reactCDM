import gql from "graphql-tag"

export default gql`
	mutation($_id: ID!, $classes: Boolean) {
		deleteCourse(_id: $_id, classes: $classes)
	}
`
