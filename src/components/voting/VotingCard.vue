<template>
  <div :class="['cursor-pointer dark:bg-twitch-dark rounded-lg relative', {
    'hover:scale-105 dark:hover:bg-twitch-selected dark:active:bg-twitch-selected': !voted
  }, {
    'shadow-[0px_0px_20px_1px] shadow-accent animate-pulsate' : option.new
  }, {
    'shadow-md' : !option.new
  }]">
    <template v-if="option.new">
      <div class="absolute text-[12px] -top-2 -right-4 bg-accent rounded-lg px-1.5">
        Neu
      </div>
    </template>

    <div class="flex flex-col rounded-lg text-center justify-center gap-4 py-5 px-5">
      <div class="relative flex justify-center">
        <img class="rounded shadow-md object-cover" :src="option.image_url" alt="">
        <div class="absolute text-[10px] -bottom-1.5 -right-2 bg-red-500 rounded-lg px-1.5">
          {{ option.votes }}
        </div>
      </div>

      <div class="flex flex-col gap-1 justify-center">
        <div class="text-sm font-medium text-gray-900">{{ option.name }}</div>
        <div class="text-[10px] text-gray-500 line-clamp-4" :title="option.description">{{ option.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VoteOption } from '@/types'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import type { PropType } from 'vue'

const { option } = defineProps({
  option: {
    required: true,
    type: Object as PropType<VoteOption>
  }
})

const state = useStateStore()
const { voted } = storeToRefs(state)
</script>