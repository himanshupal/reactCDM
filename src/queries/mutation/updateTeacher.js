import gql from "graphql-tag"

export default gql`
	mutation updateTeacher(
		$_id: ID!
		$firstName: String
		$lastName: String
		$bloodGroup: String
		$caste: String
		$photo: String
		$email: String
		$gender: String
		$religion: String
		$designation: String
		$dateOfBirth: String
		$aadharNumber: String
		$contactNumber: String
		$dateOfJoining: String
		$dateOfLeaving: String
		$registrationNumber: String
		$alternativeContact: String
		$addressCurrentTehsil: String
		$addressPermanentTehsil: String
		$addressCurrentDistrict: String
		$addressCurrentLocality: String
		$addressPermanentDistrict: String
		$addressPermanentLocality: String
	) {
		updateTeacher(
			_id: $_id
			data: {
				name: { first: $firstName, last: $lastName }
				bloodGroup: $bloodGroup
				caste: $caste
				photo: $photo
				email: $email
				gender: $gender
				religion: $religion
				designation: $designation
				dateOfBirth: $dateOfBirth
				aadharNumber: $aadharNumber
				contactNumber: $contactNumber
				registrationNumber: $registrationNumber
				address: {
					current: {
						locality: $addressCurrentLocality
						tehsil: $addressCurrentTehsil
						district: $addressCurrentDistrict
					}
					permanent: {
						locality: $addressPermanentLocality
						tehsil: $addressPermanentTehsil
						district: $addressPermanentDistrict
					}
				}
				alternativeContact: $alternativeContact
				dateOfJoining: $dateOfJoining
				dateOfLeaving: $dateOfLeaving
			}
		) {
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
			contactNumber
			alternativeContact
			dateOfJoining
			dateOfLeaving
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
