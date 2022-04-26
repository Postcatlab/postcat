<template>
  <div class="border-b px-3 py-4">
    <a-input v-model:value="search" placeholder="搜索关键字" class="w-60">
      <template #prefix>
        <search-outlined type="user" />
      </template>
    </a-input>
  </div>
  <div class="list-block grid grid-cols-4 gap-6 py-5 px-3">
    <div
      class="border w-full h-70 py-2 px-3 border rounded-lg flex items-center flex-col flex-wrap plugin-block"
      v-for="(it, index) in renderList"
      :key="index"
      @click="handleClickPlugin(it)"
    >
      <span class="h-8 w-full text-lg flex justify-end items-center text-gray-400" @click.stop="handleSetingPlugin(it)" v-if="localModules.has(it.moduleID) && localModules.get(it.moduleID).configuration">
        <setting-outlined type="user" />
      </span>
      <i
        class="block w-20 h-20 my-3 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${it.logo || ''})` }"
      ></i>
      <span class="text-lg font-bold">{{ it.name }}</span>
      <span class="text-gray-400 my-2">{{ it.author }}</span>
      <span class="text-gray-500 my-1 desc">{{ it.description }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { getList } from '../http';
import { useStore } from '../store';

let search = ref('');
const store = useStore();
const renderList = ref([]);
const router = useRouter();
const route = useRoute();

const localModules = store.getLocalModules;

const handleClickPlugin = ({ name, moduleID }) => {
  router.push({ path: '/plugin-detail', query: { name, moduleID } });
};
const handleSetingPlugin = ({ moduleID }) => {
  router.push({ path: '/plugin-detail', query: { moduleID, isSetting: true } });
};

const searchPlugin = async (type = 'all') => {
  if (type === 'local') {
    const map = window.eo.getModules();
    return [...map].map((it) => it[1]);
  }
  const [res, err] = await getList();
  if (err) {
    return;
  }
  if (type === 'official') {
    return res.filter((it) => it.name.includes('eo-module-'));
  }
  return res;
};

onMounted(async () => {
  const type = route.query.type || '';
  renderList.value = await searchPlugin(type);
});

watch(
  () => route.query,
  async ({ type }) => {
    renderList.value = await searchPlugin(type);
  }
);
</script>
<style lang="less" scoped>
.desc {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
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
