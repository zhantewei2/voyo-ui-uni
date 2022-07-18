<template>
  <div class="voyo-full-page">
    <voyo-tab-group>
      <voyo-tabbars>
        <voyo-tabbar v-for="(i, index) in tabs" :key="i.name">{{ i}}</voyo-tabbar>
      </voyo-tabbars>

      <voyo-tabbars :stand-alone="true">
        <voyo-tabbar v-for="(i, index) in tabs" :key="i.name">{{ i}}</voyo-tabbar>
      </voyo-tabbars>

      <voyo-tabs class="flex-1">
        <voyo-tab v-for="(i, index) in tabs" :key="index">
          {{i}}
        </voyo-tab>
      </voyo-tabs>
    </voyo-tab-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [1,2,3,4]
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
