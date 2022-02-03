<template>
  <div class="messagebox" v-show="activedKey[type]!= ''">
    <div class="messagebox-header">
      <!-- <div>{{type}}</div> -->
      <div>
        <span>{{`${activedKey[type].name } &nbsp;&nbsp; ${activedKey[type].groupid || ''}`}}</span>
      </div>
    </div>

    <div class="messagebox-content" ref="msgContent">
      <div class="moreMsgs" @click="loadMoreMsgs">{{loadText}}</div>
      <div v-for="(item,i) in msgList" :key="i" class="message-group" :style="{'float':item.bySelf ? 'right':'left'}">
        <h4 style="text-align: left;margin:0">{{item.from}}</h4>
        <!-- 撤回消息 -->
        <div v-if="item.status == 'recall'" class="recallMsg">{{item.msg}}</div>
        <div v-if="item.status == 'recall'" class="recallMsg">{{renderTime(item.time)}}</div>
        <!-- 撤回消息 end -->
        <div v-else :style="{'float':item.bySelf ? 'right':'left'}" :disabled="!item.bySelf">
          <span style="user-select: none">
            <img :key="item.msg" :src="item.msg?item.msg:''" v-if="item.type === 'img'" class="img-style" />
            <!-- 文件card -->
            <div v-else-if="item.type==='file'" class="file-style" :style="{'float':item.bySelf ? 'right':'left'}">
              <el-card :body-style="{ padding: '0px' }">
                <div style="padding: 14px;">
                  <h2>文件</h2>
                  <span>
                    <h3>{{item.filename}}</h3>
                  </span>
                  <div class="bottom clearfix">
                    <span>{{readablizeBytes(item.file_length)}}</span>
                    <a :href="item.msg" :download="item.filename">点击下载</a>
                  </div>
                </div>
              </el-card>
            </div>
            <!-- 音频消息 -->
            <div v-else-if="item.type==='audio'" :style="{'float':item.bySelf ? 'right':'left'}">
              <audio :src="item.msg" controls></audio>
            </div>
            <!-- 视频消息 -->
            <div v-else-if="item.type==='video'">
              <video :src="item.msg" width="100%" controls></video>
            </div>
            <!-- 聊天消息 -->
            <p style="user-select: text" v-else v-html="renderTxt(item.msg)" :class="{ 'byself': item.bySelf}" />
          </span>
        </div>
        <!-- 聊天时间 -->
        <div
          v-if="item.status !== 'recall'"
          class="time-style"
          :style="{'text-align':item.bySelf ? 'right':'left'}"
        >{{renderTime(item.time)}} {{item.bySelf?status[item.status]:''}}</div>
      </div>
    </div>
    <div class="messagebox-footer">
      <div class="footer-icon">
        <!-- 表情组件 -->
        <ChatEmoji v-on:selectEmoji="selectEmoji" :inpMessage="message" />
        <!-- 上传图片组件 -->
        <UpLoadImage :type="this.type" :chatId="activedKey[type]" />
        <!-- 上传文件组件 -->
        <!-- <UpLoadFile :type="this.type" :chatId="activedKey[type]" /> -->
      </div>
      <div class="fotter-send">
        <el-input type="textarea" v-model="message" resize="none" placeholder="消息" class="sengTxt" @keyup.native.enter="onSendTextMsg" ref="txtDom" />
      </div>
    </div>
    <!-- <GetGroupInfo ref="groupInfoModel" @closeGroupMessage="closeGroupMessage" /> -->

    <!-- <EmediaModal ref="emediaModal" @changeIsVideoState="changeIsVideoState" /> -->
    <!-- <MultiAVModal :to="activedKey[type]" /> -->
    <!-- <AddAVMemberModal ref="addAvMembertModal" :to="activedKey[type]" /> -->
  </div>
</template>

<script>
import ChatEmoji from "../chatEmoji/index.vue";
import Vue from "../../main";
import emoji from "../../config/emoji";
import UpLoadImage from "../upLoadImage/index.vue";
// import UpLoadFile from "../upLoadFile/index.vue";
import { mapActions, mapGetters } from "vuex";
// import AddAVMemberModal from "../emediaModal/addAVMemberModal";

export default {
  data() {
    return {
      activedKey: {
        contact: "",
        group: "",
        chatroom: ""
      },
      message: "",
      loadText: "加载更多",
      status: {
        sending: "发送中",
        sent: "已发送",
        read: "已读"
      },
      nowIsVideo: false
    };
  },
  beforeMount() {
    if (this.type === "contact") {
      this.onGetContactUserList();
    } else if (this.type === "group") {
      this.onGetGroupUserList();
    } else if (this.type === "chatroom") {
      this.onGetChatroomUserList();
    }
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
        contact: this.contact,
        group: this.group,
        chatroom: this.chatroom
      };
    },
    selectedKeys() {
      return [this.getKey(this.activedKey[this.type]) || ""];
    }
  },
  props: [
    "type", // 聊天类型 contact, group, chatroom
    "username", // 选中的聊天对象
    "broken", // 是否适应移动端
    "showUserList",
    "hideUserList"
  ],
  methods: {
    ...mapActions([
      "onGetContactUserList",
      "onGetGroupUserList",
      "onGetChatroomUserList",
      "onGetCurrentChatObjMsg",
      "onSendText",
      "onCallVideo",
      "onCallVoice",
      "getGroupMembers",
      "getHistoryMessage",
      "onAddBlack",
      "onDelteFirend",
      "onGetGroupinfo",
      "recallMessage",
      "onGetGroupBlack"
    ]),
    getKey(item, type) {
      let key = "";
      switch (type) {
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
      return key;
    },
    getCurrentMsg(props) {
      this.onGetCurrentChatObjMsg({
        type: props,
        id: this.getKey(this.activedKey[props], props)
      });
    },
    select(key) {
      this.$data.activedKey[this.type] = key;
      const me = this;
      me.$data.loadText = "加载更多";
      if (this.type === "group") {
        this.$store.commit("changeChatRouter", { name: this.type, params: { id: key.groupid } });
        this.onGetCurrentChatObjMsg({ type: this.type, id: key.groupid });
        setTimeout(() => {
          Vue.$store.commit("updateMessageStatus", {
            action: "oneUserReadMsgs",
            readUser: key.groupid
          });
          this.$forceUpdate();
        }, 100);
        if (!this.msgList) {
          this.getHistoryMessage({ name: key.groupid, isGroup: true });
        }
      } else if (this.type === "contact") {
        /* 将demo中的路由改为仓库变量 */
        this.$store.commit("changeChatRouter", { name: this.type, params: { id: key.name } });
        this.onGetCurrentChatObjMsg({ type: this.type, id: key.name });
        setTimeout(() => {
          Vue.$store.commit("updateMessageStatus", {
            action: "oneUserReadMsgs",
            readUser: key.name
          });
          this.$forceUpdate();
        }, 100);

        if (!this.msgList) {
          this.getHistoryMessage({ name: key.name, isGroup: false });
        }
      }
    },
    loadMoreMsgs() {
      const me = this;
      const success = function(msgs) {
        if (msgs.length === 0) {
          me.$data.loadText = "已无更多数据";
        }
      };
      let name = "";
      let isGroup = false;
      if (this.type === "contact") {
        name = this.$data.activedKey[this.type].name;
      } else if (this.type === "group") {
        name = this.$data.activedKey[this.type].groupid;
        isGroup = true;
      } else if (this.type === "chatroom") {
        name = this.$data.activedKey[this.type].id;
        isGroup = true;
      }
      this.getHistoryMessage({ name, isGroup, success });
    },
    onSendTextMsg() {
      if (this.$data.message == "" || this.$data.message == "\n") {
        this.$data.message = "";
        return;
      }
      this.onSendText({
        chatType: this.type,
        chatId: this.$data.activedKey[this.type],
        message: this.$data.message
      });
      this.$data.message = "";
    },

    selectEmoji(v) {
      this.$data.message = v;
      this.$refs.txtDom.focus();
    },

    customEmoji(value) {
      return `<img src="/faces/${value}" style="width:20px"/>`;
    },

    renderTxt(txt = "") {
      let rnTxt = [];
      let match = null;
      const regex = /(\[.*?\])/g;
      let start = 0;
      let index = 0;
      while ((match = regex.exec(txt))) {
        index = match.index;
        if (index > start) {
          rnTxt.push(txt.substring(start, index));
        }
        if (match[1] in emoji.obj) {
          const v = emoji.obj[match[1]];
          rnTxt.push(this.customEmoji(v));
        } else {
          rnTxt.push(match[1]);
        }
        start = index + match[1].length;
      }
      rnTxt.push(txt.substring(start, txt.length));
      return rnTxt.toString().replace(/,/g, "");
    },
    readablizeBytes(value) {
      let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      let e = Math.floor(Math.log(value) / Math.log(1024));
      return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },
    /* 将时间戳转换为标准时间 */
    renderTime(time) {
      const nowStr = new Date().toLocaleString();
      return time ? new Date(time).toLocaleString() : nowStr;
    },
    scollBottom() {
      setTimeout(() => {
        const dom = this.$refs.msgContent;
        if (!dom) return;
        dom.scrollTop = dom.scrollHeight;
      }, 0);
    },
    closeGroupMessage() {
      //退出群组或解散群组时关闭聊天框
      this.$data.activedKey["group"] = "";
    },
    changeIsVideoState(v) {
      v ? (this.$data.nowIsVideo = true) : (this.$data.nowIsVideo = false);
    }
  },
  components: {
    // AddAVMemberModal,
    ChatEmoji,
    UpLoadImage
    // UpLoadFile
  }
};
</script>

<style scoped lang='less'>
.messagebox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  .messagebox-header {
    border-bottom: 1px solid #d6dce0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    outline: none;
    margin: 0;
    padding-left: 0;
    padding: 0 16px;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .messagebox-content {
    width: auto;
    height: 445px;
    background: #fff;
    padding: 10px 15px;
    overflow: scroll;
    overflow-x: hidden;
    .byself {
      float: right;
    }
    .recallMsg {
      font-size: 12px;
      color: #aaa;
      width: 100%;
      text-align: center;
    }
    .moreMsgs {
      // padding-left: 10px;
      text-align: center;
      background: #ccc !important;
      border-radius: 8px;
      cursor: pointer;
    }
    .img-style {
      max-width: 350px;
    }
    .time-style {
      clear: both;
      margin-left: 2px;
      margin-top: 3px;
      font-size: 12px;
      color: #888c98;
    }
    .file-style {
      width: 240px;
      margin: 2px 2px 2px 0;
      font-size: 13px;
      h2 {
        border-bottom: 1px solid #e0e0e0;
        font-weight: 300;
        text-align: left;
      }
      h3 {
        max-width: 100%;
        font-size: 15px;
        height: 20px;
        line-height: 20px;
        font-weight: 600;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: left;
        margin-bottom: 20px;
      }
      .bottom {
        span {
          color: #999999;
          text-align: left;
        }
      }
      a {
        color: #999999;
        float: right;
        text-decoration: none;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
    .message-group {
      padding-top: 3px;
      font-size: 14px;
      line-height: 1.5;
      clear: both;
      width: 100%;
      p {
        list-style: none;
        min-width: 100px;
        background: #fff;
        text-align: left;
        padding: 13px 15px;
        margin: 5px 0 0 0;
        border-radius: 25px;
        border: 1px solid #eceff1;
        display: inline-block;
        padding: 13px 15px;
        margin-top: 11px;
        border-radius: 25px;
        border: 1px solid #eceff1;
        min-width: 100px;
        word-break: break-all;
        &.byself {
          background: #eceff1;
          float: right;
        }
      }
    }
  }
  .messagebox-footer {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 135px;
    width: 100%;
    .footer-icon {
      padding: 5px 15px;
      height: 30px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #d6dce0;
      border-top: 1px solid #d6dce0;
    }
    .fotter-send {
      height: 85px;
      padding: 5px 10px;
      .sengTxt {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>

