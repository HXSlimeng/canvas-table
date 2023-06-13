<template>
  <div style="display: flex; justify-content: center">
    <canvas id="l-table"> </canvas>
  </div>
</template>

<script setup lang="ts">
// import { onMounted } from "vue";
import { onMounted, onUnmounted } from "vue";
import { setUpTable } from "../core/index";
import { anyObj } from "../core/index.d";

onMounted(() => {
  setTable();
});

function setTable() {
  let mockData = Array.from({ length: 9 }).map((_, i) => ({
    title: `col-${i}`,
    prop: `col${i}`,
  }));
  const tbInstance = setUpTable("#l-table", {
    column: mockData,
    columnH: 50,
  });
  console.time("开始时间");
  let data = Array.from({ length: 100000 }).map((_, y) => {
    let obj: anyObj = {};
    mockData.forEach(({ prop }, x) => {
      obj[prop] = `${x}-${y}`;
    });
    return obj;
  });
  console.timeEnd("开始时间");

  tbInstance.data = data;
}
onUnmounted(() => {});
</script>
<style>
#l-table {
  border: solid 1px #8f8f8f;
  /* border-radius: 20px; */
}
</style>
