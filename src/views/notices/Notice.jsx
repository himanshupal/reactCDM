import React, { useState, useContext } from "react"
import { Dimmer, Divider, Icon } from "semantic-ui-react"
import MDEditor from "@uiw/react-md-editor"

import { useQuery, useMutation } from "@apollo/react-hooks"
import { AuthContext } from "../../common/context"

import NOTICE from "../../queries/query/notice"
import NOTICES from "../../queries/query/notices"
import DELETE_NOTICE from "../../queries/mutation/deleteNotice"

import Loading from "../shared/Loading"
import Error from "../shared/Error"
import { Link } from "react-router-dom"
import { getName, getTime } from "../shared/helpers"
import NoticeModal from "./NoticeModal"
import AreYouSure from "../shared/AreYouSure"
import MutationError from "../shared/MutationError"
import { toast } from "react-toastify"

const Notice = ({
	theme,
	history,
	match: {
		params: { _id },
	},
}) => {
	const { user } = useContext(AuthContext)

	const [deleteNotice, { loading: deletingNotice }] = useMutation(DELETE_NOTICE, {
		update: proxy => {
			try {
				const data = proxy.readQuery({ query: NOTICES })
				proxy.writeQuery({
					query: NOTICES,
					data: { notices: data.notices.filter(x => x._id !== _id) },
				})
			} catch (error) {
				console.error(error)
			}
			toast.success(<h3>Notice Deleted</h3>)
			history.goBack()
		},
		onError: e => MutationError(e),
		variables: { _id },
	})

	const [modal, setModal] = useState(false)
	const [deleteModal, setDeleteModal] = useState(false)

	const { loading, data, error } = useQuery(NOTICE, { variables: { _id } })

	if (loading) return <Loading />
	if (error) return <Error />

	document.title = data ? `Notice | ` + getTime(data.notice.createdAt) : `Notice`

	return (
		<>
			<div className="distributed_ends">
				<h1 style={{ color: `darkviolet`, marginBottom: 0 }}>{data.notice.subject}</h1>
				{user && user.access !== `Student` && (
					<div className="shift_right">
						<Icon
							style={{ cursor: `pointer` }}
							name="pencil square"
							onClick={() => setModal(true)}
						/>
						<Icon
							style={{ cursor: `pointer` }}
							name="delete"
							color="red"
							onClick={() => setDeleteModal(true)}
						/>
					</div>
				)}
			</div>
			<Dimmer active={deletingNotice} inverted={!theme} />
			<Divider />
			{data && (
				<MDEditor.Markdown source={data.notice.description || `***Description Not Provided***`} />
			)}
			<Divider />
			<h5 style={{ marginTop: `0.4rem` }}>
				Created by{" "}
				{user && user.access !== `Student` ? (
					<Link to={`/teacher/` + data.notice.createdBy.username}>
						{getName(data.notice.createdBy.name)}
					</Link>
				) : (
					getName(data.notice.createdBy.name)
				)}{" "}
				on {getTime(data.notice.createdAt)}
			</h5>
			{data.notice.updatedAt && (
				<h6 style={{ marginTop: 0 }}>
					Updated by{" "}
					{user && user.access !== `Student` ? (
						<Link to={`/teacher/` + data.notice.updatedBy.username}>
							{getName(data.notice.updatedBy.name)}
						</Link>
					) : (
						getName(data.notice.updatedBy.name)
					)}{" "}
					on {getTime(data.notice.updatedAt)}
				</h6>
			)}
			<NoticeModal
				open={modal}
				close={() => setModal(false)}
				theme={theme}
				user={user}
				update={data.notice}
			/>
			<AreYouSure
				open={deleteModal}
				theme={theme}
				onConfirm={deleteNotice}
				onCancel={() => setDeleteModal(false)}
				content="This will delete the selected Notice"
			/>
		</>
	)
}

export default Notice
