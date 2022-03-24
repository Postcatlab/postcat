<template>
  <div class="border-b px-4 py-4">
    <a-input v-model:value="search" placeholder="搜索关键字" class="w-60">
      <template #prefix>
        <search-outlined type="user" />
      </template>
    </a-input>
  </div>
  <div class="list-block grid grid-cols-4">
    <div
      class="
        min-w-1/2
        max-w-11/12
        h-60
        p-4
        m-4
        border
        rounded-lg
        flex
        items-center
        justify-self-center
        flex-col flex-wrap
        plugin-block
      "
      v-for="(it, index) in renderList"
      :key="index"
      @click="handleClick(it)"
    >
      <i
        class="block w-20 h-20 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${it.logo})` }"
      ></i>
      <span>{{ it.name }}</span>
      <span>{{ it.author }}</span>
      <div class="desc">{{ it.desc }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { SearchOutlined } from "@ant-design/icons-vue";

let search = ref("");
const renderList = ref([]);
const router = useRouter();
const route = useRoute();

const handleClick = () => {
  router.push("/plugin-detail");
};

const queryPlugin = (type = "all") => {
  console.log("type", type);
  return Array(17)
    .fill(0)
    .map(() => ({
      logo: require("../assets/logo.png"),
      name: "插件名称",
      author: "Eoapi",
      desc: "这段文字最多显示不超过3行，否则省略号显示。鼠标hover的时候可以显示完整的信息。这段文字最多显示不超过3行，否则省略号显示……鼠标hover的时候可以显示完整的信息。",
    }));
};

onMounted(() => {
  const type = route.query.type || "";
  renderList.value = queryPlugin(type);
});
watch(
  () => route.query,
  ({ type }) => {
    renderList.value = queryPlugin(type);
  }
);
</script>
<style lang="stylus" scoped>
.desc {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.plugin-block {
  user-select: none;
  cursor: pointer;
}

.list-block {
  height: calc(100vh - 65px);
  overflow: auto;
}
</style>
