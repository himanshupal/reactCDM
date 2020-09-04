import gql from "graphql-tag"

export default gql`
	mutation updateClass(
		$_id: ID!
		$name: String
		$newName: String
		$sessionEnd: String
		$sessionStart: String
		$classTeacher: ID
	) {
		updateClass(
			_id: $_id
			data: {
				name: $name
				newName: $newName
				sessionEnd: $sessionEnd
				sessionStart: $sessionStart
				classTeacher: $classTeacher
			}
		) {
			_id
			name
			sessionEnd
			sessionStart
			classTeacher {
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
