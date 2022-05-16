<template>
  <div class="bdb px-3 py-4">
    <a-input v-model:value="search" @change="handleSearch(search)" placeholder="搜索关键字" class="w-60">
      <template #prefix>
        <search-outlined type="user" />
      </template>
    </a-input>
  </div>
  <div class="list-block grid gap-6 py-5 px-3 grid-cols-4 <xl:grid-cols-3 <lg:grid-cols-2 <sm:grid-cols-1">
    <div
      class="border w-full h-76 py-2 px-3 border rounded-lg flex flex-col flex-wrap items-center plugin-block"
      v-for="(it, index) in renderList"
      :key="index"
      @click="handleClickPlugin(it)"
    >
      <span class="h-8 w-full flex justify-between items-center">
        <span v-if="localModules.has(it.moduleID)" class="text-xs bg-green-700 text-white p-1 rounded-sm">已安装</span>
        <span v-else class="text-xs p-1 border rounded-sm text-green-700 border-green-700">未安装</span>
        <setting-outlined
          type="user"
          class="text-gray-400 text-lg"
          v-show="localModules.has(it.moduleID) && localModules.get(it.moduleID).configuration"
          @click.stop="handleSetingPlugin(it)"
        />
      </span>
      <i
        :class="['block w-20 h-20 my-3 rounded-lg bg-cover bg-center bg-no-repeat', it.logo || 'bg-gray-100']"
        :style="{ backgroundImage: `url(${it.logo || ''})` }"
      ></i>
      <!-- <i
        class="block w-20 h-20 my-3 rounded-lg bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${it.logo || ''})` }"
      ></i> -->
      <span class="text-lg font-bold">{{ it.moduleName }}</span>
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

const searchPlugin = async (type = 'all', string = '') => {
  if (type === 'installed') {
    const map = window.eo.getModules();
    return [...map]
      .map((it) => it[1])
      .filter((it) => store.getPluginList.includes(it.moduleID))
      .filter((it) => it.moduleID.includes(string) || it.name.includes(string) || it.keywords.includes(string));
  }
  const [res, err] = await getList();
  if (err) {
    return;
  }
  if (type === 'official') {
    return res
      .filter((it) => it.author === 'Eolink')
      .filter((it) => it.moduleID.includes(string) || it.name.includes(string) || it.keywords.includes(string));
  }
  return res.filter((it) => it.moduleID.includes(string) || it.name.includes(string) || it.keywords.includes(string));
};

const handleSearch = async (string = '') => {
  const type = route.query.type || '';
  renderList.value = await searchPlugin(type, string);
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
.warn-color {
  color: #00785a;
}
</style>
