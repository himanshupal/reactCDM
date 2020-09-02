import gql from "graphql-tag"

export default gql`
	mutation updateCourse(
		$_id: ID!
		$name: String
		$duration: String
		$identifier: String
		$headOfDepartment: ID
		$semesterBased: Boolean
	) {
		updateCourse(
			_id: $_id
			data: {
				name: $name
				duration: $duration
				identifier: $identifier
				headOfDepartment: $headOfDepartment
				semesterBased: $semesterBased
			}
		) {
			_id
			name
			duration
			identifier
			semesterBased
			headOfDepartment {
				_id
				username
				name {
					first
					last
				}
			}
			createdAt
			createdBy {
				_id
				username
				name {
					first
					last
				}
			}
			updatedAt
			updatedBy {
				_id
				username
				name {
					first
					last
				}
			}
		}
	}
`
