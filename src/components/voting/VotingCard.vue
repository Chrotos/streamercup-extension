<template>
  <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow w-1/2">
    <div class="flex flex-1 flex-col p-8">
      <img class="mx-auto h-32 w-32 flex-shrink-0 rounded-full" :src="option.image_url" alt="">
      <h3 class="mt-6 text-sm font-medium text-gray-900">{{ option.name }}</h3>
      <dl class="mt-1 flex flex-grow flex-col justify-between">
        <dd class="text-sm text-gray-500">{{ option.description }}</dd>
      </dl>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { VoteOption } from '@/types'

const option: VoteOption = defineModel<VoteOption>()
</script>