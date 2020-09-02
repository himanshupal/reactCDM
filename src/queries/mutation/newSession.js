import gql from "graphql-tag"

export default gql`
	mutation newSession(
		$course: ID!
		$name0: String
		$newName0: String
		$sessionEnd0: String
		$sessionStart0: String
		$classTeacher0: ID
		$name1: String
		$newName1: String
		$sessionEnd1: String
		$sessionStart1: String
		$classTeacher1: ID
		$name2: String
		$newName2: String
		$sessionEnd2: String
		$sessionStart2: String
		$classTeacher2: ID
		$name3: String
		$newName3: String
		$sessionEnd3: String
		$sessionStart3: String
		$classTeacher3: ID
		$name4: String
		$newName4: String
		$sessionEnd4: String
		$sessionStart4: String
		$classTeacher4: ID
		$name5: String
		$newName5: String
		$sessionEnd5: String
		$sessionStart5: String
		$classTeacher5: ID
	) {
		newSession(
			course: $course
			data: [
				{
					name: $name0
					newName: $newName0
					sessionEnd: $sessionEnd0
					sessionStart: $sessionStart0
					classTeacher: $classTeacher0
				}
				{
					name: $name1
					newName: $newName1
					sessionEnd: $sessionEnd1
					sessionStart: $sessionStart1
					classTeacher: $classTeacher1
				}
				{
					name: $name2
					newName: $newName2
					sessionEnd: $sessionEnd2
					sessionStart: $sessionStart2
					classTeacher: $classTeacher2
				}
				{
					name: $name3
					newName: $newName3
					sessionEnd: $sessionEnd3
					sessionStart: $sessionStart3
					classTeacher: $classTeacher3
				}
				{
					name: $name4
					newName: $newName4
					sessionEnd: $sessionEnd4
					sessionStart: $sessionStart4
					classTeacher: $classTeacher4
				}
				{
					name: $name5
					newName: $newName5
					sessionEnd: $sessionEnd5
					sessionStart: $sessionStart5
					classTeacher: $classTeacher5
				}
			]
		) {
			_id
			name
			sessionStart
			sessionEnd
			totalStudents
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
