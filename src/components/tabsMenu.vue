<template>
  <!-- tabs 跟路由动态改变 -->
  <el-tabs :value="activeName" tabPosition="left">
    <!-- <el-tabs value="index" tabPosition="left"> -->
    <template v-for="(item,index) in list">
      <el-tab-pane v-if="item.status!==false" :key="index" :name="item.name">
        <span slot="label">
          <i :class="item.icon"></i>
          {{item.title}}
        </span>
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :router="true">
          <template v-for="child in item.children">
            <el-menu-item-group v-if="child.status!==false" :key="child.title">
              <template slot="title">{{child.title}}</template>
              <template v-for="list in child.children">
                <el-menu-item v-if="list.status!==false" :index="list.path" :key="list.title">{{list.title}}</el-menu-item>
              </template>
            </el-menu-item-group>
          </template>
        </el-menu>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "tabsMenu",
  data() {
    return {
      list: []
    };
  },
  computed: {
    activeName() {
      return this.$store.state.activeName;
    }
    // ...mapGetters({
    //   list: "onGetUserMenu"
    // })
  },
  mounted() {
    this.list = this.$store.state.allMenu;
    // if (!(Array.isArray(this.list) && this.list.length > 0)) {
    //   this.getMyMenu();
    // }
  },
  methods: {
    ...mapActions(["getMyMenu"])
  }
  /* 登录之后获取一个权限列表  然后权限列表中会有每个权限的name */
  /* 细分到添加修改 路由可以通过这个name去拦截 菜单的话 通过name加载 ？？是否可行 */
};
</script>

<style lang='less'>
</style>
