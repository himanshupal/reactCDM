import gql from "graphql-tag"

export default gql`
	mutation updateTeacher(
		$teacherId: ID!
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
			tid: $teacherId
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
					current: { locality: $addressCurrentLocality, tehsil: $addressCurrentTehsil, district: $addressCurrentDistrict }
					permanent: { locality: $addressPermanentLocality, tehsil: $addressPermanentTehsil, district: $addressPermanentDistrict }
				}
				alternativeContact: $alternativeContact
				dateOfJoining: $dateOfJoining
				dateOfLeaving: $dateOfLeaving
			}
		)
	}
`
