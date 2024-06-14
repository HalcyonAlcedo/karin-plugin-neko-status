<script setup lang="ts">

const props = defineProps({
  request: Function,
  apiUrl: String,
  data: Object
})

</script>

<template>
  <v-card elevation="0" class="bg-primary overflow-hidden bubble-shape-sm bubble-primary mb-6">
    <v-card-text class="pa-5">
      <div class="d-flex align-center ga-4">
        <v-btn color="darkprimary" icon rounded="sm" variant="flat">
          <CpuIcon stroke-width="1.5" width="25" />
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{props.data.cpu.text}}</h4>
          <span class="text-subtitle-2 text-medium-emphasis text-white">CPU</span>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <v-card elevation="0" class="bubble-shape-sm overflow-hidden bubble-warning">
    <v-card-text class="pa-5">
      <div class="d-flex align-center ga-4">
        <v-btn color="lightwarning" icon rounded="sm" variant="flat">
          <Server2Icon stroke-width="1.5" width="25" class="text-warning" />
        </v-btn>
        <div>
          <h4 class="text-h4 font-weight-medium">{{props.data.memory.text}}</h4>
          <span class="text-subtitle-2 text-disabled font-weight-medium">内存</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
