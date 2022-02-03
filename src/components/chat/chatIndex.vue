<template>
  <el-container id="chatBox">
    <el-header>
      <!-- <div class="list">
        <div :class="activeKey=='contact'?'item activeItem':'item'" @click="contactTypeChange({key:'contact'})">
          <span>好友</span>
          <div class="tip-style" v-if="getUnread('contact').contact">&nbsp;</div>
        </div>
        <div :class="activeKey=='group'?'item activeItem':'item'" @click="contactTypeChange({key:'group'})">
          <span>群聊</span>
          <div class="tip-style" v-if="getUnread('group').group">&nbsp;</div>
        </div>
      </div> -->
    </el-header>
    <el-container>
      <el-aside width="290px !important">
        <MessageBox :type="activeKey" :select="select" ref="messageBox" />
      </el-aside>
      <el-main>
        <Message :type="activeKey" :broken="broken" :hideUserList="hideUserList" :showUserList="showUserList" ref="messageList" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MessageBox from "../../components/chat/index.vue";
import Message from "../../components/chat/message.vue";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      showSettingOptions: false,
      activeKey: "contact",
      userName: localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")).userId,
      collapsed: false,
      broken: false,
      current: ["contact"]
    };
  },
  computed: {
    chatList() {
      return this.$store.state.chat.msgList;
    }
  },
  methods: {
    ...mapActions(["onLogout"]),
    toLogout() {
      this.onLogout();
    },
    onBreakpoint(broken) {
      this.$data.broken = broken;
    },
    hideUserList() {
      this.$data.collapsed = true;
    },
    showUserList() {
      this.$data.collapsed = false;
    },
    select(i) {
      this.$refs.messageList.select(i);
      if (this.broken) {
        this.$data.collapsed = true;
      }
    },
    contactTypeChange(type) {
      this.$data.activeKey = type.key;
      this.$store.commit("changeChatRouter", { name: type.key });
      if (this.broken && this.collapsed) {
        this.$data.collapsed = false;
      }
      switch (type.key) {
        case "contact":
          this.$refs.messageBox.onGetContactUserList();
          break;
        case "group":
          this.$refs.messageBox.onGetGroupUserList();
          break;
        case "chatroom":
          this.$refs.messageBox.onGetChatroomUserList();
          break;
        default:
          break;
      }
      this.$refs.messageList.getCurrentMsg(type.key);
    },
    getUnread(type) {
      const chatList = this.chatList[type];
      let obj = {
        contact: false,
        group: false
      };
      if (JSON.stringify(chatList) != "{}") {
        for (const item in chatList) {
          chatList[item].map((v, k) => {
            if (v.status === "unread") {
              if (v.chatType === "group") {
                obj.group = true;
              }
              if (v.chatType === "contact") {
                obj.contact = true;
              }
            }
            return obj;
          });
        }
      }
      return {
        contact: obj.contact,
        group: obj.group
      };
    }
  },
  components: {
    MessageBox,
    Message
  }
};
</script>
<style lang="less">
#chatBox {
  height: 100%;
  width: 100%;
  .el-header {
    background-color: #d3dce6 !important;
    .list {
      display: flex;
      justify-content: space-evenly;
      .item {
        position: relative;
        margin: 0 20px;
        cursor: pointer;
      }
      .activeItem {
        color: green;
        border-bottom: 2px solid green;
      }
    }
  }
  .tip-style {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    position: relative;
    top: 10px;
  }
  .el-container {
    height: 100%;
    width: 100%;
    .el-main {
      overflow: hidden !important;
      padding: 0 !important;
      border: 1px solid #d6dce0;
    }
  }
}
</style>