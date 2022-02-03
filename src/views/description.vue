<template>
  <div>
    <h1>
      <a id="_0"></a>使用文档
    </h1>
    <h2>
      <a id="1_description_1"></a>
      <a href="#/description/#/%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86">1. 商品管理</a>
    </h2>
    <h3>
      <a id="11description_2"></a>
      <a href="#/description/#/%E5%88%86%E7%B1%BB">1.1分类</a>
    </h3>
    <h3>
      <a id="12description_3"></a>
      <a href="#/description/#/%E5%93%81%E7%89%8C">1.2品牌</a>
    </h3>
    <h3>
      <a id="13description_4"></a>
      <a href="#/description/#/%E5%95%86%E5%93%81">1.3商品</a>
    </h3>
    <h2>
      <a id="span_iddescription1_span_6"></a>
      <span id="/description/#/商品管理">1. 商品管理</span>
    </h2>
    <blockquote>
      <p>商品的流程是先添加商品分类，然后添加分类的属性；然后添加品牌；然后再是添加商品</p>
    </blockquote>
    <hr />
    <h3>
      <a id="span_iddescription11_span_9"></a>
      <span id="/description/#/分类">1.1 分类</span>
    </h3>
    <ol>
      <li>
        <p>
          <strong>分类增删改</strong>
        </p>
        <ol>
          <li>
            <strong>添加</strong>
          </li>
        </ol>
        <blockquote>
          <p>在首次添加分类是填写分类的基本信息</p>
        </blockquote>
        <ul>
          <li>
            <strong>所属分类</strong> : 不选则为以及分类 选择则为二级或三级分类 选择时只能选择一级和二级的分类(因为目前只有三级分类)
          </li>
          <li>
            <mark>
              <strong>分类名称</strong>
            </mark> : 分类的名称
          </li>
          <li>
            <mark>
              <strong>分类首字母</strong>
            </mark> : 分类的名称的首字母
          </li>
          <li>
            <mark>
              <strong>分类排序</strong>
            </mark> : 分类展示的排序
          </li>
          <li>
            <strong>筛选属性</strong> : 分类下的商品会有的属性,用于商城列表的筛选
          </li>
          <li>
            <mark>
              <strong>分类图片</strong>
            </mark> : 分类的展示图片
          </li>
          <li>
            <mark>
              <strong>分类状态</strong>
            </mark> : 分类的显示状态,是否在APP中展示的(默认为显示)
          </li>
        </ul>
        <ol start="2">
          <li>
            <strong>修改</strong>
          </li>
        </ol>
        <blockquote>
          <p>
            在对分类的信息进行修改的时候,对分类的信息进行修改
            <mark>
              已经添加的分类不可以在分类修改中修改属性，具体修改到
              <a href="#/description/#/%E5%B1%9E%E6%80%A7">属性</a>中改
            </mark>
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>所属分类</strong> : 不修改分类的父级分类则不选择 ，如果需要分类的父级才选择
          </li>
          <li>
            <mark>
              <strong>分类名称</strong>
            </mark> : 分类的名称
          </li>
          <li>
            <mark>
              <strong>分类首字母</strong>
            </mark> : 分类的名称的首字母
          </li>
          <li>
            <mark>
              <strong>分类排序</strong>
            </mark> : 分类展示的排序
          </li>
          <li>
            <mark>
              <strong>分类图片</strong>
            </mark> : 分类的展示图片
          </li>
          <li>
            <mark>
              <strong>分类状态</strong>
            </mark> : 分类的显示状态,是否在APP中展示的(默认为显示)
          </li>
        </ul>
        <ol start="3">
          <li>
            <strong>删除</strong>
          </li>
        </ol>
        <blockquote>
          <p>在分类列表对不需要的分类进行删除</p>
        </blockquote>
        <hr />
      </li>
      <li>
        <p>
          <strong>
            <span id="/description/#/属性">属性</span>
          </strong>
        </p>
        <blockquote>
          <p>在商品类型模块,每个列表中会展示当前分类的属性个数、以及查看下级分类的按钮、查看属性列表的的按钮</p>
        </blockquote>
        <p>
          <strong>属性列表</strong>
        </p>
        <blockquote>
          <p>
            属性列表中展示
            <mark>属性名称</mark> ,
            <mark>属性所属的分类</mark>,
            <mark>属性的可选值</mark>
          </p>
        </blockquote>
        <p>
          <strong>添加属性</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>属性名称</strong>
            </mark> : 当前需要添加的属性的名称
          </li>
          <li>
            <mark>
              <strong>商品类型</strong>
            </mark> : 当前添加属性所属的分类（三级均可选）
          </li>
          <li>
            <mark>
              <strong>是否在列表页展示</strong>
            </mark> : 当前属性给商品设置之后是否展示在商品的属性列表
          </li>
          <li>
            <mark>
              <strong>能否进行检索</strong>
            </mark> : 当前的属性是否可以在商城中进行检索
          </li>
          <li>
            <mark>
              <strong>属性值可选值列表</strong>
            </mark> : 当前添加的属性的可选值
          </li>
        </ul>
        <p>
          <strong>修改属性</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>属性名称</strong>
            </mark> : 当前需要修改的属性的名称
          </li>
          <li>
            <strong>商品类型</strong> : 不可以选择分类
          </li>
          <li>
            <mark>
              <strong>是否在列表页展示</strong>
            </mark> : 当前属性给商品设置之后是否展示在商品的属性列表
          </li>
          <li>
            <mark>
              <strong>能否进行检索</strong>
            </mark> : 当前的属性是否可以在商城中进行检索
          </li>
          <li>
            <mark>
              <strong>属性值可选值列表</strong>
            </mark> : 当前属性的可选值
          </li>
        </ul>
      </li>
    </ol>
    <hr />
    <h3>
      <a id="span_iddescription12_span_53"></a>
      <span id="/description/#/品牌">1.2 品牌</span>
    </h3>
    <ol>
      <li>
        <p>
          <strong>品牌增删改</strong>
        </p>
        <ol>
          <li>
            <strong>添加</strong>
          </li>
        </ol>
        <blockquote>
          <p>添加品牌时填写品牌的基本信息</p>
        </blockquote>
        <ul>
          <li>
            <mark>
              <strong>品牌名称</strong>
            </mark> : 品牌的名称
          </li>
          <li>
            <mark>
              <strong>品牌故事</strong>
            </mark> : 品牌故事
          </li>
          <li>
            <mark>
              <strong>品牌首字母</strong>
            </mark> : 品牌的名称的首字母
          </li>
          <li>
            <mark>
              <strong>所属分类(多选)</strong>
            </mark> : 该品牌下包含的商品的种类，用于商品界面三级分类的品牌推荐
          </li>
          <li>
            <mark>
              <strong>品牌图片</strong>
            </mark> : 品牌的展示图片
          </li>
          <li>
            <mark>
              <strong>品牌专区大图</strong>
            </mark> : 在品牌专区展示的品牌图片
          </li>
          <li>
            <strong>联系电话</strong> : 该品牌的联系电话
          </li>
        </ul>
        <ol start="2">
          <li>
            <strong>修改</strong>
          </li>
        </ol>
        <blockquote>
          <p>修改品牌时只用填写需要修改的品牌基本信息</p>
        </blockquote>
        <ul>
          <li>
            <mark>
              <strong>品牌名称</strong>
            </mark> : 品牌的名称
          </li>
          <li>
            <mark>
              <strong>品牌故事</strong>
            </mark> : 品牌故事
          </li>
          <li>
            <mark>
              <strong>品牌首字母</strong>
            </mark> : 品牌的名称的首字母
          </li>
          <li>
            <mark>
              <strong>所属分类(多选)</strong>
            </mark> : 该品牌下包含的商品的种类，用于商品界面三级分类的品牌推荐
            <mark>分类获取比较慢，如果不改动可以不管</mark>
          </li>
          <li>
            <mark>
              <strong>品牌图片</strong>
            </mark> : 品牌的展示图片
          </li>
          <li>
            <mark>
              <strong>品牌专区大图</strong>
            </mark> : 在品牌专区展示的品牌图片
          </li>
          <li>
            <strong>联系电话</strong> : 该品牌的联系电话
          </li>
        </ul>
        <ol start="3">
          <li>
            <strong>删除</strong>
          </li>
        </ol>
        <blockquote>
          <p>在品牌列表对不需要的品牌进行删除</p>
        </blockquote>
        <hr />
      </li>
    </ol>
    <h3>
      <a id="span_iddescription13_span_77"></a>
      <span id="/description/#/商品">1.3 商品</span>
    </h3>
    <ol>
      <li>
        <p>
          <strong>商品增删改</strong>
        </p>
        <ol>
          <li>
            <strong>添加商品</strong>
          </li>
        </ol>
        <blockquote>
          <p>添加商品时填写商品的基本信息</p>
        </blockquote>
        <p>
          <strong>第一步：选择商品所属分类</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>商品分类</strong>
            </mark> : 选择商品的分类 ，
            <mark>商品是属于三级分类</mark> ，用于后面的商品属性的加载
          </li>
        </ul>
        <p>
          <strong>第二步：填写商品信息</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>商品标题</strong>
            </mark> : 商品标题
          </li>
          <li>
            <mark>
              <strong>商品副标题</strong>
            </mark> : 商品的副标题，用于商品的简介
          </li>
          <li>
            <mark>
              <strong>所属品牌</strong>
            </mark> : 选择该商品所属的品牌
          </li>
          <li>
            <strong>排序</strong> : 商品的排序
          </li>
          <li>
            <mark>
              <strong>默认SKU价格</strong>
            </mark> : 该商品的默认价格（商品的spu可能有多个，这个默认价格是用于商品在商城列表中的展示的价格）
          </li>
          <li>
            <strong>销售量</strong> : 可不填
          </li>
          <li>
            <strong>商品评分</strong> ：可不填
          </li>
          <li>
            <strong>好评度</strong> ：可不填
          </li>
          <li>
            <strong>评论数量</strong> ：可不填
          </li>
          <li>
            <strong>关注数量</strong> ：可不填
          </li>
          <li>
            <mark>
              <strong>封面图片</strong>
            </mark> ： 商品的主图，用于商品在各个地方展示图
          </li>
          <li>
            <mark>
              <strong>商品轮播图</strong>
            </mark> ：商品的轮播图，用于商品的轮播图展示
          </li>
          <li>
            <mark>
              <strong>详情</strong>
            </mark> ：用于展示商品的详情
            <mark>批量上传图片的时候最好看到提示上传成功多少张图片之后再点击下一步</mark>
          </li>
          <li>
            <strong>是否为礼包</strong> ：该商品是否为一个礼包
          </li>
          <li>
            <strong>订单分发</strong> ：是否需要分发订单
          </li>
        </ul>
        <p>
          <strong>第三步：填写商品属性/规格</strong>
        </p>
        <ul>
          <li>
            <strong>填写商品属性</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            该商品包含的属性 ，
            <mark>这些属性全部都是从三级分类上查询的，如果没有在该分类下添加属性，商品将添加不成功</mark>，商品可以选填该商品符合的属性
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>填写商品规格</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            如果需要批量填充数据 ，
            <mark>先填写需要填充的数据再填写规格</mark>，
            <mark>填写完规格之后再开始填写各个规格的信息</mark> ，
            <mark>每个规格的如果有不同的图片则需要传上去，否则将会默认为商品主图作为该规格的商品图片</mark>
          </p>
        </blockquote>
        <p>
          <strong>第四步：选择商品关联</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>关联商品（选填，用于商品推荐）</strong>
            </mark> ：
          </li>
        </ul>
        <blockquote>
          <p>
            选择关联商品： 左侧为当前商品，
            <mark>右侧的商品列表是通过搜索出来的列表，选择右侧的商品对现在的商品进行关联</mark>，
            <mark>如果没有跳过即可</mark>
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>关联专题(暂未开放)</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            选择关联专题：
            <mark>左侧为当前商品</mark>，
            <mark>右侧的专题列表是通过搜索出来的列表，选择右侧的专题对现在的商品进行关联</mark>，
            <mark>如果没有跳过即可</mark>
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>关联文章(暂未开放)</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            选择关联文章：
            <mark>左侧为当前商品</mark>，
            <mark>右侧的文章列表是通过搜索出来的列表，选择右侧的文章对现在的商品进行关联</mark>，
            <mark>如果没有跳过即可</mark>
          </p>
        </blockquote>
        <hr />
        <ol start="2">
          <li>
            <strong>修改商品</strong>
          </li>
        </ol>
        <blockquote>
          <p>修改商品时填写商品的基本信息</p>
        </blockquote>
        <p>
          <strong>第一步：选择商品所属分类</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>商品分类</strong>
            </mark> : 修改时若不需要修改商品分类，则可以直接点击下一步
          </li>
        </ul>
        <p>
          <strong>第二步：填写商品信息</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>商品标题</strong>
            </mark> : 商品标题
          </li>
          <li>
            <mark>
              <strong>商品副标题</strong>
            </mark> : 商品的副标题，用于商品的简介
          </li>
          <li>
            <mark>
              <strong>所属品牌</strong>
            </mark> : 选择该商品所属的品牌
          </li>
          <li>
            <strong>排序</strong> : 商品的排序
          </li>
          <li>
            <mark>
              <strong>默认SKU价格</strong>
            </mark> : 该商品的默认价格（商品的spu可能有多个，这个默认价格是用于商品在商城列表中的展示的价格，
            <mark>最好是这个商品的多个规格组合中较低的价格</mark>）
            <mark>该价格不起实际作用，只做展示</mark>
          </li>
          <li>
            <strong>销售量</strong> : 可不填
          </li>
          <li>
            <strong>商品评分</strong> ：可不填
          </li>
          <li>
            <strong>好评度</strong> ：可不填
          </li>
          <li>
            <strong>评论数量</strong> ：可不填
          </li>
          <li>
            <strong>关注数量</strong> ：可不填
          </li>
          <li>
            <mark>
              <strong>封面图片</strong>
            </mark> ： 商品的主图，用于商品在各个地方展示图
          </li>
          <li>
            <mark>
              <strong>商品轮播图</strong>
            </mark> ：商品的轮播图，用于商品的轮播图展示
          </li>
          <li>
            <mark>
              <strong>详情</strong>
            </mark> ：用于展示商品的详情
            <mark>批量上传图片的时候最好看到提示上传成功多少张图片之后再点击下一步</mark>
          </li>
          <li>
            <strong>是否为礼包</strong> ：该商品是否为一个礼包
          </li>
          <li>
            <strong>订单分发</strong> ：是否需要分发订单
          </li>
        </ul>
        <p>
          <strong>第三步：填写商品属性/规格</strong>
        </p>
        <ul>
          <li>
            <strong>填写商品属性</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            该商品包含的属性 ，
            <mark>这些属性全部都是从三级分类上查询的，如果在商品中有该属性，则会在输入框中显示，如果没有则为空</mark>，商品可以选填该商品符合的属性
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>填写商品规格</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            如果修改商品的规格信息，各个规格组合的商品信息也需要重新填
            <mark>如果要修改规格！！！请慎重</mark>
          </p>
        </blockquote>
        <p>
          <strong>第四步：选择商品关联</strong>
        </p>
        <ul>
          <li>
            <mark>
              <strong>关联商品（选填，用于商品推荐,建议填写）</strong>
            </mark> ：
          </li>
        </ul>
        <blockquote>
          <p>
            选择关联商品： 左侧为当前商品，
            <mark>右侧的商品列表是现在已有的商品关联</mark>，
            <mark>关联方式默认为单向关联</mark>，
            <mark>如若不选择关联方式则之前的双向关联都会变为单向关联</mark>
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>关联专题(暂未开放)</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            选择关联专题： 左侧为当前商品，
            <mark>右侧的专题列表是通过搜索出来的列表，选择右侧的专题对现在的商品进行关联</mark>，
            <mark>如果没有跳过即可</mark>
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>关联文章(暂未开放)</strong> ：
          </li>
        </ul>
        <blockquote>
          <p>
            选择关联文章： 左侧为当前商品，
            <mark>右侧的文章列表是通过搜索出来的列表，选择右侧的文章对现在的商品进行关联</mark>，
            <mark>如果没有跳过即可</mark>
          </p>
        </blockquote>
        <hr />
        <ol start="3">
          <li>
            <strong>删除</strong>
          </li>
        </ol>
        <blockquote>
          <p>在商品列表对不需要的商品进行删除</p>
        </blockquote>
      </li>
    </ol>
    <el-button @click="goHome" class="descriotionfixed">返回首页</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ name: "index" });
    }
  }
};
</script>

<style lang="less">
blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin-bottom: 16px;
}
.descriotionfixed {
  position: fixed;
  bottom: 30px;
  right: 30px;
}
</style>