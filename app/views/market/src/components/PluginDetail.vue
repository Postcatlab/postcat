<template>
  <div class="border-b py-4">
    <a-button @click="handleBack" type="link">&lt; 返回列表</a-button>
  </div>
  <section class="">
    <div class="flex p-8">
      <i
        class="block h-40 w-40 bg-cover bg-center bg-no-repeat mr-8"
        :style="{ backgroundImage: `url(${require('../assets/logo.png')})` }"
      ></i>
      <div class="flex flex-col flex-1">
        <div class="flex flex-col">
          <span class="text-lg mb-2">插件名称</span>
          <span>作者: {author}</span>
          <span class="mb-4">Tags: {Tags}</span>
          <p class="w-full h-20">desc</p>
        </div>
        <div class="flex">
          <div class="flex items-center">
            <a-button type="primary mr-4" size="large">安装</a-button>
            <span>安装完成后需要重启</span>
          </div>
          <a-button type="primary" size="large" danger>卸载</a-button>
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
import { useRouter } from "vue-router";

const router = useRouter();

const handleBack = () => {
  router.go(-1);
};
</script>
<style lang="stylus" scoped>
.ant-btn-dangerous.ant-btn-primary {
  background: #ff3c32;
}
</style>