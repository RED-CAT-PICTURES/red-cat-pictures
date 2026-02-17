<template>
  <section class="mt-8">
    <h3 class="font-semibold text-lg">Comments</h3>
    <form class="mt-4 flex items-start gap-3" @submit.prevent="addComment">
      <img src="https://i.pravatar.cc/50" alt="me" class="h-10 w-10 rounded-full" />
      <div class="flex-1">
        <input v-model="text" placeholder="Add a public comment..." class="border-slate-300 focus:ring-brand w-full rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2" />
        <div class="mt-2 flex justify-end gap-2">
          <button type="button" class="rounded-md border px-3 py-1" @click="text = ''">Cancel</button>
          <button type="submit" :disabled="!text.trim()" class="bg-brand rounded-md px-3 py-1 text-white disabled:opacity-50">Comment</button>
        </div>
      </div>
    </form>
    <ul class="mt-6 space-y-4">
      <li v-for="c in comments" :key="c.id" class="flex gap-3">
        <img :src="c.avatar" :alt="c.author" class="h-10 w-10 rounded-full" />
        <div>
          <p class="text-sm">
            <span class="font-semibold">{{ c.author }}</span>
            <span class="text-slate-500">• {{ c.date }}</span>
          </p>
          <p class="mt-1">
            {{ c.text }}
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
interface CommentItem {
  id: string
  author: string
  avatar: string
  date: string
  text: string
}

const props = defineProps<{ initial?: CommentItem[] }>()
const comments = ref<CommentItem[]>(
  props.initial ?? [
    {
      id: '1',
      author: 'Alex',
      avatar: 'https://i.pravatar.cc/100?img=14',
      date: 'Today',
      text: 'Great stream!',
    },
    {
      id: '2',
      author: 'Jordan',
      avatar: 'https://i.pravatar.cc/100?img=25',
      date: 'Yesterday',
      text: 'Loved the insights.',
    },
  ]
)

const text = ref('')
function addComment() {
  if (!text.value.trim()) return
  comments.value.unshift({
    id: Math.random().toString(36).slice(2),
    author: 'You',
    avatar: 'https://i.pravatar.cc/100?img=49',
    date: 'Now',
    text: text.value,
  })
  text.value = ''
}
</script>
