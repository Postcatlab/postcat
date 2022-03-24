<template>
  <section class="main">
    <section class="left flex-shrink-0">
      <div class="mb-2"><appstore-filled class="mr-2" />插件分类</div>
      <div
        :class="[
          'plugin-link',
          'px-1',
          'py-2',
          { active: activeKey === 'all' },
        ]"
        @click="handleSelect('all')"
      >
        全部插件
      </div>
      <div
        :class="[
          'plugin-link',
          'px-1',
          'py-2',
          { active: activeKey === 'official' },
        ]"
        @click="handleSelect('official')"
      >
        官方插件
      </div>
      <div
        :class="[
          'plugin-link',
          'px-1',
          'py-2',
          { active: activeKey === 'owm' },
        ]"
        @click="handleSelect('owm')"
      >
        已安装（3）
      </div>
    </section>
    <section class="right flex-1 px-4">
      <router-view> </router-view>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AppstoreFilled } from "@ant-design/icons-vue";

const router = useRouter();

const activeKey = ref("all");

const handleSelect = (key) => {
  activeKey.value = key;
  router.push({ path: "/", query: { type: key } });
};
</script>

<style lang="stylus" scoped>
.main {
  height: 100vh;
  width: 100%;
  display: flex;

  .left {
    background: #f8f8f8;
    width: 250px;
    padding: 10px;

    .plugin-link {
      &:hover, &.active {
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
