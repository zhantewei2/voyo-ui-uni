<!--
  @author ztw
  @createdDate 2020/9/10 0:16
-->
<template>
  <view>
    <slot></slot>
  </view>
</template>

<script>
  import { Subject } from "rxjs";
  import { isH5 } from "@voyo/ui-uni/components/utils/common";
  import { createScrollIntersection } from "@voyo/ui-uni/components/utils/scrollIntersection";
  import { ExcuteAfterConnected } from "@voyo/ui-uni/components/utils/excuteAfterConnected";

  export default {
    beforeCreate() {
      this.lazyListComponentName = "voyo-img-lazy-list";
      this.descendantRegistryCount = 0;
      this.descendantInitCount = 0;
      this.lazyDescendantComplete = new Subject();
      this.excuteAfterMounted = new ExcuteAfterConnected();
    },
    data() {
      return {};
    },
    mounted() {
      if (isH5) {
        this.intersection = createScrollIntersection();
        this.intersection.mounted(this.$el);
        this.excuteAfterMounted.connect();
      }
    },
    created() {},
    methods: {
      descendantRegistry() {
        this.descendantRegistryCount++;
      },
      descendantInitComplete() {
        this.descendantInitCount++;
        if (this.descendantInitCount === this.descendantRegistryCount)
          setTimeout(() => this.lazyDescendantComplete.next(true));
      },
      observe(el, cb) {
        return new Promise((resolve, reject) =>
          this.excuteAfterMounted.execute(() =>
            resolve(this.intersection && this.intersection.observe(el, cb)),
          ),
        );
      },
    },
    beforeDestroy() {
      this.intersection && this.intersection.disconnect();
    },
  };
</script>

<style lang="scss" scoped></style>
