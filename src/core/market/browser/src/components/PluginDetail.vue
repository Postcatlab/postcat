<template>
  <div class="border-b py-4">
    <a-button @click="handleBackArrow()" type="link"><left-outlined />返回列表</a-button>
  </div>
  <section class="">
    <div class="flex p-8">
      <i
        class="block border rounded-lg h-40 w-40 bg-cover bg-center bg-no-repeat mr-8"
        :style="{ backgroundImage: `url(${pluginDetail.logo || ''})` }"
      ></i>
      <div class="flex flex-col flex-1">
        <div class="flex flex-col">
          <span class="text-xl mb-2 font-bold">{{ pluginDetail.name }}</span>
          <span>作者: {{ pluginDetail.author }}</span>
          <!-- <span class="mb-4">Tags: {{ pluginDetail.keywords }}</span> -->
          <span class="mb-2">Version: {{ pluginDetail.version }}</span>
          <p class="w-full h-20">{{ pluginDetail.description }}</p>
        </div>
        <div class="flex">
          <div class="flex items-center" v-if="!pluginDetail.installed">
            <a-button type="primary mr-4" @click="installApp(pluginDetail.name)">安装</a-button>
            <!-- <span class="text-gray-500">安装完成后需要重启</span> -->
          </div>
          <a-button v-else type="primary" @click="uninstallApp(pluginDetail.name)" danger>卸载</a-button>
        </div>
      </div>
    </div>
    <div>
      <a-tabs default-active-key="desc" v-model:activeKey="tab" :animated="false">
        <a-tab-pane key="desc" tab="概述"> {{ pluginDetail.description }} </a-tab-pane>
        <a-tab-pane key="more" tab="更多信息"> Content of Tab Pane 2 </a-tab-pane>
        <a-tab-pane key="setting" tab="设置" v-if="pluginDetail.configuration && pluginDetail.configuration.properties">
          <a-form name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
            <a-form-item
              v-for="(item, field) in pluginDetail.configuration.properties"
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
  console.log('Done', code);
  if (code === 0) {
    pluginDetail.installed = true;
    store.updateLocalModules(modules);
    store.updatePluginList(modules);
    return;
  }
  console.error(data);
};

const uninstallApp = (name) => {
  console.log('Uninstall module:', name);
  const { code, data, modules } = window.eo.uninstallModule(name);
  if (code === 0) {
    console.log(modules);
    pluginDetail.installed = false;
    store.updateLocalModules(modules);
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
  background: #ff3d33;
}
</style>
<style>
.CodeMirror {
  font-family: Arial, monospace;
  font-size: 16px;
}
</style>