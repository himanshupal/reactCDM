import gql from "graphql-tag"

export default gql`
	query teachers($department: ID) {
		teachers(department: $department) {
			_id
			username
			designation
			registrationNumber
			department {
				_id
				name
			}
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
