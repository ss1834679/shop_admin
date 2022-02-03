import Vue from '../main'
import WebIM from '../utils/WebIM'

const FriendModule = {
	state: {
		friendRequest: [],
		blackList: {}
	},
	mutations: {
		changeFriendRequestState(state, data) {
			state.friendRequest = data;
		},
		updateBlackList(state, blackList) {
			state.blackList = blackList;
		}
	},
	actions: {
		addfirend: function (payload) {
			const username = localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")).userId;
			const { id } = payload;
			WebIM.conn.subscribe({
				to: id,
				message: username + "请求添加你为好友"
			});
		},

		// 接受好友请求
		acceptSubscribe: function (payload) {
			WebIM.conn.subscribed({
				to: payload,
				message: "[resp:true]"
			});
		},

		// 拒绝好友请求
		declineSubscribe: function (payload) {
			const username = localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")).userId;
			const { id } = payload;
			WebIM.conn.unsubscribed({
				to: id,
				message: username + "拒绝您的好友请求"
			});
		},
		// 添加黑名单-单人
		onAddBlack: function (payload) {
			let addName = payload.userId.name;
			WebIM.conn.addToBlackList({
				name: addName,
			});
			Vue.$store.dispatch("onGetContactUserList", { type: "addBlack", addName });
		},
		// 获取黑名单
		onGetFirendBlack: function () {
			WebIM.conn.getBlacklist();
		},

		// 移除黑名单
		onRemoveBlack: function (payload) {
			let blackName = payload.removeName;
			WebIM.conn.removeFromBlackList({
				name: blackName,
				success: function () {
					console.log("Remove from black list success.");
				},
				error: function () {
					console.log("Remove from black list error.");
				}
			});
		}
	},
	getters: {
		addfirend(state) {
			return state.firendList.myFirendList;
		}
	}

};
export default FriendModule;
