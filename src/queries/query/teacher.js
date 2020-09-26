import gql from "graphql-tag"

export default gql`
	query teacher($username: String) {
		teacher(username: $username) {
			_id
			username
			designation
			registrationNumber
			name {
				first
				last
			}
			bloodGroup
			gender
			caste
			religion
			dateOfBirth
			dateOfJoining
			dateOfLeaving
			address {
				current {
					locality
					district
					tehsil
				}
				permanent {
					locality
					district
					tehsil
				}
			}
			aadharNumber
			photo
			email
			teaches {
				_id
				name
			}
			contactNumber
			alternativeContact
			classTeacherOf {
				_id
				name
			}
			teaches {
				_id
				name
				class
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
