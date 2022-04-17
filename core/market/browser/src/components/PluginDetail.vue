<template>
  <div class="border-b py-4">
    <a-button @click="handleBack" type="link">&lt; 返回列表</a-button>
  </div>
  <section class="">
    <div class="flex p-8">
      <i
        class="block h-40 w-40 bg-cover bg-center bg-no-repeat mr-8"
        :style="{ backgroundImage: `url(${pluginDetail.logo || ''})` }"
      ></i>
      <div class="flex flex-col flex-1">
        <div class="flex flex-col">
          <span class="text-lg mb-2">{{ pluginDetail.name }}</span>
          <span>作者: {{ pluginDetail.author }}</span>
          <!-- <span class="mb-4">Tags: {Tags}</span> -->
          <span class="mb-4">Version: {{ pluginDetail.version }}</span>
          <p class="w-full h-20">{{ pluginDetail.description }}</p>
        </div>
        <div class="flex">
          <div class="flex items-center" v-if="!pluginList.includes(pluginDetail.name)">
            <a-button type="primary mr-4" size="large" @click="installApp(pluginDetail.name)">安装</a-button>
            <span>安装完成后需要重启</span>
          </div>
          <a-button v-else type="primary" size="large" @click="uninstallApp(pluginDetail.name)" danger>卸载</a-button>
        </div>
      </div>
    </div>
    <div>
      <a-tabs default-active-key="1" :animated="false">
        <a-tab-pane key="1" tab="概述"> Content of Tab Pane 1 </a-tab-pane>
        <a-tab-pane key="2" tab="更多信息"> Content of Tab Pane 2 </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getDetail } from '../http';
import { useStore } from '../store';

const store = useStore();
const pluginDetail = reactive({});
const router = useRouter();
const route = useRoute();

const pluginList = computed(() => store.getPluginList);
const handleBack = () => {
  router.go(-1);
};

const installApp = (name) => {
  console.log('Install module:', name);
  const { code, data, modules } = window.eo.installModule(name);
  if (code === 0) {
    console.log('=>', modules);
    store.updatePluginList(modules);
    return;
  }
  console.error(data);
};

const uninstallApp = (name) => {
  console.log('Uninstall module:', name);
  const { code, data, modules } = window.eo.uninstallModule(name);
  if (code === 0) {
    store.updatePluginList(modules);
    return;
  }
  console.error(data);
};

onMounted(async () => {
  const name = route.query.name || '';
  const [data, err] = await getDetail(name);
  if (err) {
    return;
  }
  console.log(pluginList.value);
  Object.assign(pluginDetail, data);
});
</script>
<style lang="less" scoped>
.ant-btn-dangerous.ant-btn-primary {
  background: #ff3c32;
}
</style>