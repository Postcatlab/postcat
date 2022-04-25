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
          <div class="flex items-center" v-if="!pluginList.includes(pluginDetail.name)">
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
        <a-tab-pane key="setting" tab="设置">
          <Codemirror v-model:value="code" border :options="cmOptions" :height="330" @change="onChangeCode" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/dracula.css';
import { getDetail } from '../http';
import { useStore } from '../store';

const store = useStore();
const pluginDetail = reactive({});
const tab = ref('desc');
const router = useRouter();
const route = useRoute();
const code = ref(`{
        "title": "模块远程同步配置",
          "properties": {
            "modulename.username": {
              "type": "string",
              "default": "",
              "description": "username."
            },
            "modulename.password": {
              "type": "string",
              "default": "",
              "description": "password."
            },
            "modulename.other": {
              "type": ["string", "null"],
              "default": null,
              "description": "其他字段XXX等."
            }
        }
      }`);
const cmOptions = {
  mode: 'application/json',
  theme: 'default', // 主题
  lineNumbers: true, // 显示行号
  smartIndent: true, // 智能缩进
  indentUnit: 2, // 智能缩进单位为4个空格长度
  foldGutter: true, // 启用行槽中的代码折叠
  styleActiveLine: true, // 显示选中行的样式
};

const pluginList = computed(() => store.getPluginList);
const handleBackArrow = () => {
  router.go(-1);
};

const onChangeCode = (code) => {
  console.log(code);
};

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
  const { name, isSetting } = route.query;
  if (isSetting === 'true') {
    tab.value = 'setting';
    console.log('=>', tab.value);
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
  font-size: 18px;
}
</style>