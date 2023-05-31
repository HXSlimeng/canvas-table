<template>
  <canvas id="l-table"></canvas>
</template>

<script setup lang="ts">
// import { onMounted } from "vue";
import { onMounted } from "vue";
import { setUpTable } from "../core/index";

onMounted(() => {
  setTable();
});

function setTable() {
  const tbInstance = setUpTable("#l-table");
}
</script>
<style>
#l-table {
  border: solid 1px #8f8f8f;
  border-radius: 20px;
}
</style>
