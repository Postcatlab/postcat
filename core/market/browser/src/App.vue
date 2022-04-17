<template>
  <section class="main">
    <section class="left flex-shrink-0">
      <div class="mb-2"><appstore-filled class="mr-2" />插件分类</div>
      <div :class="['plugin-link', 'px-1', 'py-2', { active: activeKey === 'all' }]" @click="handleSelect('all')">
        全部插件
      </div>
      <div
        :class="['plugin-link', 'px-1', 'py-2', { active: activeKey === 'official' }]"
        @click="handleSelect('official')"
      >
        官方插件
      </div>
      <div :class="['plugin-link', 'px-1', 'py-2', { active: activeKey === 'local' }]" @click="handleSelect('local')">
        已安装（{{ installedPlugin }}）
      </div>
    </section>
    <section class="right flex-1 px-4">
      <router-view> </router-view>
    </section>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AppstoreFilled } from '@ant-design/icons-vue';
import { useStore } from './store.js';

const store = useStore();
const router = useRouter();

const installedPlugin = computed(() => store.getPluginList.length);
const activeKey = ref('all');

const handleSelect = (key) => {
  activeKey.value = key;
  router.push({ path: '/', query: { type: key } });
};

onMounted(async () => {
  const list = window.eo.getModules();
  console.log('Installed module:', list);
  store.updatePluginList(list);
});
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  width: 100%;
  display: flex;

  .left {
    background: #f8f8f8;
    width: 250px;
    padding: 10px;

    .plugin-link {
      &:hover,
      &.active {
        color: #00785a;
        cursor: pointer;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }

  .right {
    height: 100vh;
  }
}
</style>
