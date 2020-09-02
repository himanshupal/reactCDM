import gql from "graphql-tag"

export default gql`
	mutation addTeacher(
		$firstName: String
		$lastName: String
		$bloodGroup: String
		$username: String
		$caste: String
		$photo: String
		$email: String
		$gender: String
		$religion: String
		$department: ID
		$designation: String
		$dateOfBirth: String
		$aadharNumber: String
		$contactNumber: String
		$dateOfJoining: String
		$registrationNumber: String
		$alternativeContact: String
		$addressCurrentTehsil: String
		$addressPermanentTehsil: String
		$addressCurrentDistrict: String
		$addressCurrentLocality: String
		$addressPermanentDistrict: String
		$addressPermanentLocality: String
	) {
		addTeacher(
			data: {
				name: { first: $firstName, last: $lastName }
				bloodGroup: $bloodGroup
				username: $username
				caste: $caste
				photo: $photo
				email: $email
				gender: $gender
				religion: $religion
				department: $department
				designation: $designation
				dateOfBirth: $dateOfBirth
				aadharNumber: $aadharNumber
				contactNumber: $contactNumber
				registrationNumber: $registrationNumber
				address: {
					current: { locality: $addressCurrentLocality, tehsil: $addressCurrentTehsil, district: $addressCurrentDistrict }
					permanent: { locality: $addressPermanentLocality, tehsil: $addressPermanentTehsil, district: $addressPermanentDistrict }
				}
				alternativeContact: $alternativeContact
				dateOfJoining: $dateOfJoining
			}
		) {
			_id
			name {
				first
				last
			}
			username
			contactNumber
			email
		}
	}
`
