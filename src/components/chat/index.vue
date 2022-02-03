<template>
  <div id="userlist">
    <el-menu>
      <el-menu-item class="userListItem" v-for="(item) in userList[type]" :key="getKey(item)" @click="select2(item, getKey(item))">
        <div class="listhead">
          <div class="custom-title">
            <span>{{item.name}}</span>
          </div>
          <div class="time-style">
            <span>{{getLastMsg(item).msgTime}}</span>
          </div>
        </div>

        <div class="msgText">
          <span class="msgTextSpan">{{getLastMsg(item).lastMsg}}</span>
          <div class="icon-style" v-if="getUnreadNum(item) != 0">
            <span class="unreadNum">{{getUnreadNum(item)}}</span>
          </div>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import _ from "lodash";
export default {
  props: [
    "type", // 聊天类型 contact, group, chatroom
    "username", // 选中的聊天对象
    "select"
  ],
  data() {
    return {
      activedKey: {
        contact: "",
        group: "",
        chatroom: ""
      },
      message: "",
      isHttps: window.location.protocol === "https:",
      loadText: "加载更多",
      status: {
        sending: "发送中",
        sent: "已发送",
        read: "已读"
      },
      isCollapse: true,
      unRead: "",
      cccc: ""
      // selectedKeys: [ this.getKey(this.activedKey[this.type]) ]
    };
  },

  beforeMount() {
    if (this.type === "contact") {
      setTimeout(() => {
        this.onGetFirendBlack();
        this.onGetContactUserList();
      }, 100);
    } else if (this.type === "group") {
      this.onGetGroupUserList();
    } else if (this.type === "chatroom") {
      this.onGetChatroomUserList();
    }
  },
  mounted() {
    // 取到黑名单列表值将黑名单匹配用户列表进行筛选
    let blackList = this.$store.state.friendModule.blackList;
    this.$store.commit("changeUserList", blackList);
  },
  updated() {
    this.scollBottom();
  },
  computed: {
    ...mapGetters({
      contact: "onGetContactUserList",
      group: "onGetGroupUserList",
      chatroom: "onGetChatroomUserList",
      msgList: "onGetCurrentChatObjMsg"
    }),
    userList() {
      return {
        contact: this.contact.filter(item => {
          if (item && !this.blackList.includes(item.name)) {
            return item;
          }
        }),
        group: this.group.filter(item => {
          if (item && item.groupid) {
            return item;
          }
        }),
        chatroom: this.chatroom
      };
    },
    blackList() {
      return Object.keys(this.$store.state.friendModule.blackList);
    },
    chatList() {
      return this.$store.state.chat.msgList;
    },
    selectedKeys() {
      return [this.getKey(this.activedKey[this.type]) || ""];
    }
  },
  methods: {
    ...mapActions([
      "onGetContactUserList",
      "onGetGroupUserList",
      "onGetChatroomUserList",
      "onGetCurrentChatObjMsg",
      "onSendText",
      "getGroupMembers",
      "onAddBlack",
      "onDelteFirend",
      "recallMessage",
      "onGetGroupBlack",
      "onGetFirendBlack"
    ]),
    getKey(item) {
      let key = "";
      switch (this.type) {
        case "contact":
          key = item.name;
          break;
        case "group":
          key = item.groupid;
          break;
        case "chatroom":
          key = item.id;
          break;
        default:
          break;
      }
      _ && (this.cccc = "");
      return key;
    },
    getUnreadNum(item) {
      const { name } = this.$store.state.chatRouter;
      const chatList = this.chatList[name];
      let userId = "";
      if (name == "contact") {
        userId = item.name;
      } else if (name == "group") {
        userId = item.groupid;
      } else {
        userId = item.id;
      }
      const currentMsgs = chatList[userId] || [];
      let unReadNum = 0;
      currentMsgs.forEach(msg => {
        if (msg.status !== "read" && msg.status !== "recall" && !msg.bySelf) {
          unReadNum++;
        }
      });
      return unReadNum;
    },
    select2(key, index) {
      this.$data.selectedKeys = [index];
      this.select(key);
      this.$data.activedKey[this.type] = key;
    },
    changeMenus() {
      if (this.type === "contact") {
        this.$data.showFirendMenus = !this.$data.showFirendMenus;
      }
    },
    /* 将时间戳转换为标准时间 */
    renderTime(time) {
      const nowStr = new Date().toLocaleString();
      return time ? new Date(time).toLocaleString() : nowStr;
    },
    getLastMsg(item) {
      const { name } = this.$store.state.chatRouter;
      const chatList = this.chatList[name];
      let userId = "";
      if (name == "contact") {
        userId = item.name;
      } else if (name == "group") {
        userId = item.groupid;
      } else {
        userId = item.id;
      }
      const currentMsgs = chatList[userId] || [];
      let lastMsg = "";
      let lastType = currentMsgs.length && currentMsgs[currentMsgs.length - 1].type;
      if (currentMsgs.length) {
        if (lastType === "img") {
          lastMsg = "[image]";
        } else if (lastType === "file") {
          lastMsg = currentMsgs[currentMsgs.length - 1].filename;
        } else if (lastType === "audio") {
          lastMsg = "[audio]";
        } else if (lastType === "vidio") {
          lastMsg = "[vidio]";
        } else {
          lastMsg = currentMsgs[currentMsgs.length - 1].msg;
        }
      }
      const msgTime = currentMsgs.length ? this.renderTime(currentMsgs[currentMsgs.length - 1].time) : "";
      return { lastMsg, msgTime };
    },
    scollBottom() {
      setTimeout(() => {
        const dom = this.$refs.msgContent;
        if (!dom) return;
        dom.scrollTop = dom.scrollHeight;
      }, 0);
    }
  }
};
</script>

<style scoped lang='less'>
#userlist {
  .userListItem {
    padding: 0 10px !important;
    height: 80px;
    display: flex;
    flex-direction: column;
    .listhead {
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      .custom-title {
        height: 40px;
        color: black;
        font-size: 14px;
      }
      .time-style {
        font-size: 12px;
        color: #888c98;
      }
    }
    .msgText {
      position: relative;
      height: 40px;
      line-height: 40px;
      color: black;
      font-size: 14px;
      .msgTextSpan {
        display: inline-block;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .icon-style {
        position: absolute;
        top: 10px;
        right: 0px;
        display: inline-block;
        background-color: #f04134;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        color: white;
        text-align: center;
      }
    }
  }
}
</style>
