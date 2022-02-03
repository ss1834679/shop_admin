import config from "./WebIMConfig";
import websdk from "easemob-websdk";
import Vue from "../main";
// import webrtc from "easemob-webrtc";
import { Message } from "element-ui";
function ack(message) {
	var bodyId = message.id; // 需要发送已读回执的消息id
	var msg = new WebIM.message("read", WebIM.conn.getUniqueId());
	msg.set({
		id: bodyId,
		to: message.from
	});
	WebIM.conn.send(msg.body);
}

// 初始化IM SDK
var WebIM = {};
WebIM = window.WebIM = websdk;
WebIM.config = config;
WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isHttpDNS: WebIM.config.isHttpDNS,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: WebIM.config.https,
	url: WebIM.config.xmppURL,
	apiUrl: WebIM.config.apiURL,
	isAutoLogin: true,
	heartBeatWait: WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	isStropheLog: WebIM.config.isStropheLog,
	delivery: WebIM.config.delivery
});
if (!WebIM.conn.apiUrl) {
	WebIM.conn.apiUrl = WebIM.config.apiURL;
}

// 注册监听回调
WebIM.conn.listen({
	onOpened: () => {
		Vue.$store.commit("changeChatRouter", { name: "contact" });
		Vue.$message({ type: "success", message: "客服连接成功" })
	},// 连接成功回调
	onClosed: () => {
		Vue.$message("客服断开链接")
	}, // 连接关闭回调
	onTextMessage: function (message) {
		const { from, to, type } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		Vue.$store.commit("updateMsgList", {
			chatType: typeMap[message.type],
			chatId: chatId,
			msg: message.data,
			bySelf: false,
			from: message.from,
			mid: message.id
		});
		type === 'chat' && ack(message);
		if (WebIM && WebIM.call && message && message.ext && message.ext.msg_extension) {
			var msgExtension = message.ext.msg_extension && JSON.parse(message.ext.msg_extension);
			var options = {
				confrId: message.ext.conferenceId,
				password: message.ext.password || "",
				gid: msgExtension.group_id,
				inviter: msgExtension.inviter
			};
			WebIM.call.listener.onInvite(message.from, options);
		}
	}, // 收到文本消息
	onEmojiMessage: function (message) {
		// console.log("onEmojiMessage", message);
		const { type } = message;
		type === 'chat' && ack(message);
	}, // 收到表情消息
	onPictureMessage: function (message) {
		const { from, to, type } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		Vue.$store.commit("updateMsgList", {
			chatType: typeMap[message.type],
			chatId: chatId,
			msg: message.url,
			bySelf: false,
			type: "img",
			from: message.from
		});
		type === 'chat' && ack(message);
	}, // 收到图片消息
	// onCmdMessage: function (message) {
	// 	console.log("onCmdMessage", message);
	// }, // 收到命令消息
	onAudioMessage: function (message) {
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		const chatId = message.type !== "chat" ? message.to : message.from;
		let options = {
			url: message.url,
			headers: { Accept: "audio/mp3" },
			onFileDownloadComplete: function (response) {
				let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
				Vue.$store.commit("updateMsgList", {
					chatType: typeMap[message.type],
					chatId: chatId,
					msg: objectUrl,
					bySelf: false,
					type: "audio",
					from: message.from
				});
			},
			onFileDownloadError: function () {
				Vue.$message.error("音频下载失败")
			}
		};
		WebIM.utils.download.call(WebIM.conn, options);
		message.type === 'chat' && ack(message);
	}, // 收到音频消息
	onFileMessage: function (message) {
		const { from, to, type } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		Vue.$store.commit("updateMsgList", {
			chatType: typeMap[message.type],
			chatId: chatId,
			msg: message.url,
			bySelf: false,
			type: "file",
			filename: message.filename,
			file_length: message.file_length,
			from: message.from
		});
		type === 'chat' && ack(message);
	}, // 收到文件消息
	// onRoster: function (message) {
	// 	console.log("onRoster", message);
	// }, // 处理好友申请
	// onInviteMessage: function (message) {
	// 	console.log("onInviteMessage", message);
	// }, // 处理群组邀请
	// onOnline: function () {
	// 	console.log("onOnline 网络已连接");
	// }, // 本机网络连接成功
	onOffline: function () {
		Vue.$message({ type: "warning", message: "客服连接已断开，请刷新页面", duration: 0, showClose: true })
	}, // 本机网络掉线
	onError: function (message) {
		if (message.type == 0) {
			Vue.$message({ type: "warning", message: "请输入环信账号密码" })
		} else if (message.type == 28) {
			Vue.$message({ type: "warning", message: "当前聊天未登录" })
		} else if (message && message.data && message.data.data && JSON.parse(message.data.data).error_description == "user not found") {
			Message.error("用户名不存在！登录失败")
		} else if (message && message.data && message.data.data && JSON.parse(message.data.data).error_description == "invalid password") {
			Vue.$message({ type: "warning", message: "密码失效" })
		} else if (message && message.data && message.data.data && JSON.parse(message.data.data).error_description == "user not activated") {
			Message.error("用户已被封禁！")
		} else if (message.type == "504") {
			Message("消息撤回失败");
		}
	}, // 失败回调
	onRecallMessage: message => {
		message.status = "recall";
		message.msg = "对方撤回了一条消息";
		Vue.$store.commit("updateMessageStatus", message);
	},
	onBlacklistUpdate: function (list) { // 黑名单变动
		// 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
		// 更新好友黑名单
		let blackList = list;
		Vue.$store.commit("updateBlackList", blackList);
	},
	onReceivedMessage: function (message) {
		Vue.$store.commit("updateMessageMid", message);
		message.status = "sent";
		// 消息状态更新
		Vue.$store.commit("updateMessageStatus", message);
	}, // 收到消息送达服务器回执

	onDeliveredMessage: function (message) {
		Vue.$store.commit('updateMessageStatus', message)
	}, // 收到消息送达客户端回执

	onReadMessage: function (message) {
		message.status = "read";
		Vue.$store.commit("updateMessageStatus", message);
	} // 收到消息已读回执
});

// WebIM.WebRTC = webrtc;
// WebIM.EMedia = emedia;
export default WebIM;
