import React, { useState, useContext } from "react"
import { Divider, Button, Icon, Card } from "semantic-ui-react"
import { useQuery } from "@apollo/react-hooks"

import NOTICES from "../../queries/query/notices"

import { AuthContext } from "../../common/context"

import Loading from "../shared/Loading"
import Error from "../shared/Error"

import { getTime } from "../shared/helpers"
import { Link } from "react-router-dom"
import NoticeModal from "./NoticeModal"

const Notices = ({ theme }) => {
	const { user } = useContext(AuthContext)

	const { loading, data, error } = useQuery(NOTICES)

	const [modal, setModal] = useState(false)

	if (loading) return <Loading />
	if (error) return <Error />

	document.title = `Notices`

	return (
		<>
			<h1>Notices</h1>
			<Divider />
			{data.notices.length > 0 ? (
				data.notices.map(notice => (
					<Card fluid key={notice._id}>
						<Card.Content>
							<Card.Header>
								<Link to={`/notice/` + notice._id}>{notice.subject}</Link>
							</Card.Header>
							<Card.Meta>
								<div>{`For ${notice.validFor} ${notice.scope.toLowerCase()} only`}</div>
								{getTime(notice.createdAt)}
							</Card.Meta>
						</Card.Content>
					</Card>
				))
			) : (
				<h3 className="highlight">No notices issued</h3>
			)}
			{user && user.access !== `Student` && (
				<div className="shift_right">
					<Button
						animated="fade"
						inverted={theme}
						onClick={() => setModal(true)}
						content={
							<>
								<Button.Content visible content={<Icon name="add circle" />} />
								<Button.Content hidden content="New" />
							</>
						}
					/>
				</div>
			)}
			<NoticeModal open={modal} close={() => setModal(false)} theme={theme} user={user} />
		</>
	)
}

export default Notices
