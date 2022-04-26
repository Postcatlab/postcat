<template>
  <div class="border-b py-4">
    <a-button @click="handleBackArrow()" type="link"><left-outlined />返回列表</a-button>
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
          <div class="flex items-center" v-if="!pluginDetail.installed">
            <a-button type="primary mr-4" size="large" @click="installApp(pluginDetail.name)">安装</a-button>
            <span>安装完成后需要重启</span>
          </div>
          <a-button v-else type="primary" size="large" @click="uninstallApp(pluginDetail.name)" danger>卸载</a-button>
        </div>
      </div>
    </div>
    <div>
      <a-tabs default-active-key="desc" v-model:activeKey="tab" :animated="false">
        <a-tab-pane key="desc" tab="概述"> {{ pluginDetail.description }} </a-tab-pane>
        <a-tab-pane key="more" tab="更多信息"> Content of Tab Pane 2 </a-tab-pane>
        <a-tab-pane key="setting" tab="设置" v-if="pluginDetail.configuration && pluginDetail.configuration.properties">
        <a-form name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
          <a-form-item v-for="(item, field) in pluginDetail.configuration.properties"
            :label="item.label"
            :name="field"
            :key="field"
            :rules="[{ required: item.required }]"
          >
            <a-input />
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
          </a-form-item>
        </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import { getDetail } from '../http';
import { useStore } from '../store';

const store = useStore();
const pluginDetail = reactive({});
const tab = ref('desc');
const router = useRouter();
const route = useRoute();
const handleBackArrow = () => {
  router.go(-1);
};

const localModules = store.getLocalModules;

const installApp = (name) => {
  console.log('Install module:', name);
  const { code, data, modules } = window.eo.installModule(name);
  if (code === 0) {
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
  const { name, moduleID, isSetting } = route.query;
  if (isSetting === 'true') {
    tab.value = 'setting';
    console.log('=>', tab.value);
  }
  if (localModules.has(moduleID)) {
    Object.assign(pluginDetail, localModules.get(moduleID), { installed: true });
  } 
  const [data, err] = await getDetail(name || '');
  if (err) {
    return;
  }
  Object.assign(pluginDetail, data);
});
</script>
<style lang="less" scoped>
.ant-btn-dangerous.ant-btn-primary {
  background: #ff3c32;
}
</style>
<style>
.CodeMirror {
  font-family: Arial, monospace;
  font-size: 16px;
}
</style>