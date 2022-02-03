import WebIM from "../utils/WebIM";
import Vue from '../main'

const Chat = {
	state: {
		userList: {
			contactUserList: [],
			groupUserList: [],
			chatroomUserList: []
		},
		msgList: {
			contact: {},
			group: {},
			chatroom: {},
		},
		currentMsgs: []
	},
	mutations: {
		/**
		 * 添加临时对话用户
		 * @param {*} payload 
		 */
		addUserList(state, payload) {
			const { user, type } = payload
			state.userList[type].push(user)
		},
		updateUserList(state, payload) {
			const { userList, type } = payload;
			// 如果是添加黑名单，则从当前用户列表中删掉此人
			// if(payload.black && payload.black.type === "addBlack"){
			// 	const addName = payload.black.addName;
			// 	const userList = state.userList[type];
			// 	let newUserList = _.pullAllBy(userList, [{ name: addName }], "name");
			// 	state.userList[type] = newUserList;
			// }
			// else{
			// 	state.userList[type] = userList;
			// }
			let notFriend = []
			if (state.userList[type].length == 0) {
				state.userList[type] = userList;
			} else {
				state.userList[type].forEach(item => {
					!JSON.stringify(userList).includes(JSON.stringify(item)) && notFriend.push(item)
				})
				state.userList[type] = userList.concat(notFriend)
			}
		},
		updateMsgList(state, payload) {
			const { chatType, chatId, msg, bySelf, type, id } = payload;
			const { params } = Vue.$store.state.chatRouter;
			/* 新增临时会话 */
			let has = false
			new Promise(resolve => {
				state.userList[`${chatType}UserList`].forEach(item => {
					/* 判断当前用户列表中是否有这个用户 */
					if (chatType == "contact") {
						item.name == chatId && (has = true)
					}
					if (chatType == "group") {
						item.groupid == chatId && (has = true)
					}
				})
				resolve()
			}).then(() => {
				if (!has) {
					/* 由于该项目中的环信对话由前端发起 没有添加好友 所以所有的会话没有在好友列表 需要手动添加上去 */
					Vue.$store.commit("addUserList", { type: `${chatType}UserList`, user: { name: chatId } })
				}
			})

			let status = "unread";
			if (payload.chatType == "contact") {
				if (params && params.id == payload.from) {
					status = "read";
				}
			} else if (payload.chatType == "group") {
				if (params && params.id == payload.chatId) {
					status = "read";
				}
			}
			if (!state.msgList[chatType][chatId]) {
				state.msgList[chatType][chatId] = [{
					msg,
					bySelf,
					type: type || "",
					mid: id,
					status: status,
					...payload
				}];
			} else {
				state.msgList[chatType][chatId].push({
					msg,
					bySelf,
					type: type || "",
					mid: id,
					status,
					...payload
				});
				state.msgList[chatType][chatId] = state.msgList[chatType][chatId].sort((a, b) => {
					return a.time - b.time;
				});
			}
			state.currentMsgs = Object.assign({}, state.msgList[chatType][(params && params.id) || chatId]); // 这里params.id在路由跳转的时候会undefind，取chatId兼容
			state.msgList = Object.assign({}, state.msgList);

			/* 获取所有的未读条数 */
			let num = 0
			let getUnreadNum = function (obj) {
				if (obj) {
					Object.keys(obj).forEach((key1) => {
						Object.keys(obj[key1]).forEach(key2 => {
							obj[key1][key2] && obj[key1][key2].forEach(item => {
								item.status === "unread" && num++
							})
						})
					})
				}
			}
			getUnreadNum(state.msgList);
			Vue.$store.commit("changeUnReadNum", num)
		},
		updateCurrentMsgList(state, messages) {
			state.currentMsgs = messages;
		},
		updateMessageMid(state, message) {
			const { id, mid } = message;
			const { name } = Vue.$store.state.chatRouter;
			Object.keys(state.msgList[name]).forEach((user) => {
				if (state.msgList[name][user].length) {
					state.msgList[name][user].forEach((msg) => {
						if (msg.mid == id) {
							msg.mid = mid;
						}
					});
				}
			});
		},
		updateMessageStatus(state, message) {
			const { id, mid, action, readUser } = message;
			const { name } = Vue.$store.state.chatRouter;
			Object.keys(state.msgList[name]).forEach((user) => {
				if (action == "oneUserReadMsgs") {
					if (state.msgList[name][readUser]) {
						state.msgList[name][readUser].forEach((msg) => {
							if (msg.status != "recall") {
								msg.status = "read";
							}
						});
					}
				}
				else if (state.msgList[name][user].length) {
					state.msgList[name][user].forEach((msg) => {
						if (action === "readMsgs" && !msg.bySelf) {
							if (msg.status != "recall") {
								msg.status = "read";
							}
						}
						else if (msg.mid == id || msg.mid == mid) {
							msg.status = message.status;
							if (message.msg) {
								msg.msg = message.msg;
							}
						}
					});
				}
			});
			/* 获取所有的未读条数 */
			let num = 0
			let getUnreadNum = function (obj) {
				if (obj) {
					Object.keys(obj).forEach((key1) => {
						Object.keys(obj[key1]).forEach(key2 => {
							obj[key1][key2] && obj[key1][key2].forEach(item => {
								item.status === "unread" && num++
							})
						})
					})
				}
			}
			getUnreadNum(state.msgList);
			Vue.$store.commit("changeUnReadNum", num)
		},
		// 黑名单筛选用户列表
		changeUserList() {
			// let ary = [];
			// _.forIn(payload, function (key) {
			// 	ary.push({ name: key });
			// });
			// state.userList.contactUserList = _.pullAllBy(state.userList.contactUserList, ary, "name");
		}
	},
	actions: {
		onGetContactUserList: function (context, payload) {
			try {
				WebIM.conn.getRoster({
					success: function (roster) {
						const userList = roster.filter(user => ["both", "to"].includes(user.subscription));
						context.commit("updateUserList", {
							userList,
							type: "contactUserList",
							black: payload
						});
					}
				});
			}
			catch (e) {
				Vue.$message.error(e)
			}
		},
		onGetGroupUserList: function (context) {
			var options = {
				success: function (resp) {
					let userList = resp.data;
					userList.forEach((user, index) => {
						userList[index].name = user.groupname;
					});
					context.commit("updateUserList", {
						userList,
						type: "groupUserList"
					});
				}
			};
			WebIM.conn.getGroup(options);
		},
		onGetChatroomUserList: function (context) {
			var option = {
				apiUrl: "https://a1.easemob.com",
				pagenum: 1,                                 // 页数
				pagesize: 20,                               // 每页个数
				success: function (list) {
					context.commit("updateUserList", {
						userList: list.data,
						type: "chatroomUserList"
					});
				},
				error: function (error) {
					Vue.$message.error(error)
				}
			};
			WebIM.conn.getChatRooms(option);
		},
		// 获取当前聊天对象的记录 @payload： {key, type}
		onGetCurrentChatObjMsg: function (context, payload) {
			const { id, type } = payload;
			context.commit("updateCurrentMsgList", context.state.msgList[type][id]);
		},
		onSendText: function (context, payload) {
			const { chatType, chatId, message } = payload;
			const id = WebIM.conn.getUniqueId();
			const time = +new Date();
			const chatroom = chatType === "chatroom";
			const type = chatType === "contact" ? "singleChat" : "groupChat";
			const jid = {
				contact: "name",
				group: "groupid",
				chatroom: "id"
			};
			const msgObj = new WebIM.message("txt", id);
			msgObj.set({
				msg: message,
				to: chatId[jid[chatType]],
				chatType: type,
				roomType: chatroom,
				success: function () {
					context.commit("updateMsgList", {
						chatType,
						chatId: chatId[jid[chatType]],
						msg: message,
						bySelf: true,
						time: time,
						mid: id,
						status: "sending"
					});
				},
				fail: function (e) {
					Vue.$message.error(e)
				}
			});
			if (chatType === "group" || chatType === "chatroom") {
				msgObj.setGroup("groupchat");
			}
			WebIM.conn.send(msgObj.body);
		},
		sendImgMessage: function (context, payload) {
			const { chatType, chatId, roomType, file, callback } = payload;
			const id = WebIM.conn.getUniqueId();
			const jid = {
				contact: "name",
				group: "groupid",
				chatroom: "id"
			};
			const msgObj = new WebIM.message("img", id);
			msgObj.set({
				apiUrl: WebIM.config.apiURL,
				file: file,
				to: chatId[jid[chatType]],
				roomType: roomType,
				onFileUploadError: function (error) {
					Vue.$message.error(error)
					callback();
				},
				onFileUploadComplete: function (data) {
					let url = data.uri + "/" + data.entities[0].uuid;
					context.commit("updateMsgList", {
						msg: url,
						chatType,
						chatId: chatId[jid[chatType]],
						bySelf: true,
						type: "img",
						time: data.timestamp,
						mid: id,
						status: "sending"
					});
					callback();
				}
			});
			if (chatType === "group" || chatType === "chatroom") {
				msgObj.setGroup("groupchat");
			}
			WebIM.conn.send(msgObj.body);
		},
		sendFileMessage: function (context, payload) {
			const { chatType, chatId, roomType, file, callback } = payload;
			const id = WebIM.conn.getUniqueId();
			const jid = {
				contact: "name",
				group: "groupid",
				chatroom: "id"
			};
			const msgObj = new WebIM.message("file", id);
			msgObj.set({
				apiUrl: WebIM.config.apiURL,
				file: file,
				ext: {
					file_length: file.data.size
				},
				to: chatId[jid[chatType]],
				roomType: roomType,
				onFileUploadError: function (error) {
					Vue.$message.error(error)
					callback();
				},
				onFileUploadComplete: function (data) {
					let url = data.uri + "/" + data.entities[0].uuid;
					context.commit("updateMsgList", {
						msg: url,
						chatType,
						chatId: chatId[jid[chatType]],
						bySelf: true,
						type: "file",
						filename: file.data.name,
						file_length: file.data.size,
						time: data.timestamp,
						mid: id,
						status: "sending"
					});
					callback();
				}
			});
			if (chatType === "group" || chatType === "chatroom") {
				msgObj.setGroup("groupchat");
			}
			WebIM.conn.send(msgObj.body);
		},
		sendRecorder: function (context, payload) {
			const { useId, type, file } = payload;
			const id = WebIM.conn.getUniqueId();
			const msgObj = new WebIM.message("audio", id);
			let isRoom = type == "chatroom" || type == "groupchat";
			// const jid = {
			// 	contact: "name",
			// 	group: "groupid",
			// 	chatroom: "id"
			// };
			// // console.log('bold>>>', bold);
			// // console.log('newBold>>', WebIM.utils.parseDownloadResponse.call(WebIM.conn, bold));
			// let newBold = WebIM.utils.parseDownloadResponse.call(WebIM.conn, bold)
			// var file = WebIM.utils.getFileUrl(input);
			msgObj.set({
				apiUrl: WebIM.config.apiURL,
				file: file,
				to: useId,
				type: "audio",
				roomType: isRoom,

				onFileUploadError: function (error) {
					Vue.$message.error(error)
				},
				onFileUploadComplete: function (data) {
					let url = data.uri + "/" + data.entities[0].uuid;
					context.commit("updateMsgList", {
						msg: url,
						chatType: type,
						chatId: useId,
						bySelf: true,
						type: "audio",
						filename: file.data.name,
						// file_length: file.data.size,
						// time: data.timestamp,
						mid: id,
						status: "sending"
					});
				},
				flashUpload: WebIM.flashUpload
			});

			if (type === "group" || type === "chatroom") {
				msgObj.setGroup("groupchat");
			}
			WebIM.conn.send(msgObj.body);
		},



		onCallVideo: function (context, payload) {
			const { chatType, to } = payload;
			// const type = chatType === "contact" ? "singleChat" : "groupChat";
			const userInfo = JSON.parse(localStorage.getItem("userInfo"));
			if (chatType === "contact") {
				// this.setState({
				//     showWebRTC: true
				// })
				WebIM.call.caller = userInfo.userId;
				WebIM.call.makeVideoCall(to, null, payload.rec, payload.recMerge);
			}
		},
		onCallVoice: function (context, payload) {
			const { chatType, to } = payload;
			// const type = chatType === "contact" ? "singleChat" : "groupChat";
			const userInfo = JSON.parse(localStorage.getItem("userInfo"));
			if (chatType === "contact") {
				WebIM.call.caller = userInfo.userId;
				WebIM.call.makeVoiceCall(to, null, payload.rec, payload.recMerge);
			}
		},

		getHistoryMessage: function (context, payload) {
			const options = {
				queue: payload.name,
				isGroup: payload.isGroup,
				count: 10, // 每次获取消息条数
				success: function (msgs) {
					try {
						payload.success && payload.success(msgs);
						if (msgs.length) {
							const userInfo = JSON.parse(localStorage.getItem("userInfo"));
							const userId = userInfo && userInfo.userId;
							msgs.forEach((item) => {
								let time = Number(item.time);
								let msg = {};
								const bySelf = item.from == userId;
								if (!item.filename) {
									msg = {
										chatType: payload.isGroup ? "group" : "contact",
										chatId: bySelf ? item.to : item.from,
										msg: item.data,
										bySelf: bySelf,
										time: time,
										mid: item.id,
										status: "read"
									};
									if (payload.isGroup) {
										msg.chatId = item.to;
									}
									else {
										msg.chatId = bySelf ? item.to : item.from;
									}
								}
								else if (!item.ext.file_length && item.filename !== "audio" && item.filename.substring(item.filename.length - 3) !== "mp4") { // 为图片的情况
									msg = {
										msg: item.url,
										chatType: payload.isGroup ? "group" : "contact",
										chatId: bySelf ? item.to : item.from,
										bySelf: bySelf,
										type: "img",
										time: time,
										mid: item.id,
										status: "read"
									};
									if (payload.isGroup) {
										msg.chatId = item.to;
									}
									else {
										msg.chatId = bySelf ? item.to : item.from;
									}
								}
								else if (item.filename === "audio") {
									msg = {
										msg: item.url,
										chatType: payload.isGroup ? "group" : "contact",
										chatId: bySelf ? item.to : item.from,
										bySelf: bySelf,
										type: "audio"
									};
									if (payload.isGroup) {
										msg.chatId = item.to;
									}
									else {
										msg.chatId = bySelf ? item.to : item.from;
									}
								}
								else if (item.filename.substring(item.filename.length - 3) === "mp4") {
									msg = {
										msg: item.url,
										chatType: payload.isGroup ? "group" : "contact",
										chatId: bySelf ? item.to : item.from,
										bySelf: bySelf,
										type: "video"
									};
									if (payload.isGroup) {
										msg.chatId = item.to;
									}
									else {
										msg.chatId = bySelf ? item.to : item.from;
									}
								}
								else {
									msg = {
										msg: item.url,
										chatType: payload.isGroup ? "group" : "contact",
										chatId: bySelf ? item.to : item.from,
										bySelf: bySelf,
										type: "file",
										filename: item.filename,
										file_length: item.file_length,
										time: time,
										mid: item.id,
										status: "read"
									};
									if (payload.isGroup) {
										msg.chatId = item.to;
									}
									else {
										msg.chatId = bySelf ? item.to : item.from;
									}
								}
								msg.isHistory = true;
								context.commit("updateMsgList", msg);
							});
							context.commit("updateMessageStatus", { action: "readMsgs" });
						}
					}
					catch (e) {
						Vue.$message.error(e)
					}
				},
				fail: function () { }
			};
			WebIM.conn.fetchHistoryMessages(options);
		},

		recallMessage: function (context, payload) {
			const { chatType, mid } = payload.message;
			const to = payload.to;
			const chatTypeObj = {
				contact: "chat",
				group: "groupchat",
				chatroom: "chatroom"
			};
			const option = {
				mid,
				to,
				type: chatTypeObj[chatType],
				success: function () {
					payload.message.status = "recall";
					payload.message.msg = "消息已撤回";
					Vue.$store.commit("updateMessageStatus", payload.message);
				},
				fail: function () {
					// me.$message('消息撤回失败');
				},
			};
			WebIM.conn.recallMessage(option);
		}
	},
	getters: {
		onGetContactUserList(state) {
			return state.userList.contactUserList;
		},
		onGetGroupUserList(state) {
			return state.userList.groupUserList;
		},
		onGetChatroomUserList(state) {
			return state.userList.chatroomUserList;
		},
		onGetCurrentChatObjMsg(state) {
			return state.currentMsgs;
		},
		fetchHistoryMessages(state) {
			return state.currentMsgs;
		}
	}

};
export default Chat;
