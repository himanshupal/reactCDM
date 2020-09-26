import gql from "graphql-tag"

export default gql`
	{
		getClass {
			_id
			students {
				name {
					first
				}
			}
		}
	}
`
