<template>
  <div style="display: flex; justify-content: center">
    <canvas id="l-table"> </canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { setUpTable } from "../core/index";
import { anyObj } from "../core/index.d";

onMounted(() => {
  setTable();
});

function setTable() {
  let mockData = Array.from({ length: 12 }).map((_, i) => ({
    title: `col-${i}`,
    prop: `col${i}`,
  }));
  const tbInstance = setUpTable("#l-table", {
    column: mockData,
    columnH: 50,
  });

  let data = Array.from({ length: 1000 }).map((_, y) => {
    let obj: anyObj = {};
    mockData.forEach(({ prop }, x) => {
      obj[prop] = `${x}-${y}`;
    });
    return obj;
  });

  tbInstance.data = data;
}
onUnmounted(() => {});
</script>
<style>
#l-table {
  /* border: solid 1px #8f8f8f; */
  /* border-radius: 20px; */
}
</style>
