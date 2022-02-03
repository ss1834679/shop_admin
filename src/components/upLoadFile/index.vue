<template>
  <el-button circle @click="clickFile" class="uploadFileChat">
    <input type="file" class="hide" ref="imgDom" @change="fileChange" />
  </el-button>
</template>

<script>
import WebIM from "../../utils/WebIM";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      file: null
    };
  },
  methods: {
    ...mapActions(["sendFileMessage"]),
    clickFile() {
      let img = this.$refs.imgDom;
      img && img.click();
    },
    inputRef(node) {
      this.file = node;
    },
    fileChange(e) {
      let isRoom = this.type == "chatroom" || this.type == "groupchat";
      let file = WebIM.utils.getFileUrl(e.target);
      if (!file.filename) {
        this.$refs.imgDom.value = null;
        return false;
      }

      let obj = {
        chatType: this.type,
        chatId: this.chatId,
        file: file,
        roomType: isRoom,
        callback: () => {
          this.$refs.imgDom.value = null;
        }
      };
      this.sendFileMessage(obj);
    }
  },
  props: [
    "type", // 聊天类型 contact, group, chatroom
    "chatId" // 选中的聊天对象
  ]
};
</script>
<style scoped>
.hide {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  filter: alpha(opacity=0);
  opacity: 0;
  cursor: inherit;
  display: none;
}
</style>
