import gql from "graphql-tag"

export default gql`
	mutation updateSubject(
		$_id: ID!
		$name: String
		$language: String
		$subjectCode: String
		$uniSubjectCode: String
		$teacher: ID
	) {
		updateSubject(
			_id: $_id
			data: {
				name: $name
				language: $language
				subjectCode: $subjectCode
				uniSubjectCode: $uniSubjectCode
				teacher: $teacher
			}
		) {
			_id
			name
			language
			subjectCode
			uniSubjectCode
			teacher {
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
