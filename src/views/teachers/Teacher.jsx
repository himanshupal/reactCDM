import React from "react";

const Teacher = ({
	match: {
		params: { username },
	},
}) => {
	return <div>{username} Page</div>;
};

export default Teacher;
