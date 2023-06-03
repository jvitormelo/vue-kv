<script setup lang="ts">
const { data } = await useFetch<number>("/api/counter");

const userCounter = ref(0);

const counter = ref<number>(data.value ?? 0);

const counterHistory = reactive<Date[]>([]);

const clickPerSecond = ref(0);

function increment() {
  fetch("/api/counter", { method: "POST" });

  counter.value++;

  userCounter.value++;

  counterHistory.push(new Date());

  if (counterHistory.length > 10) {
    counterHistory.shift();
  }
}

onMounted(() => {
  setInterval(() => {
    clickPerSecond.value = counterHistory.filter((date) => {
      const now = new Date();
      return date.getTime() > now.getTime() - 1000;
    }).length;
  }, 250);
});
</script>

<template>
  <main
    :data-low-cps="clickPerSecond < 3"
    :data-medium-cps="clickPerSecond >= 3 && clickPerSecond < 5"
    :data-high-cps="clickPerSecond >= 5 && clickPerSecond < 7"
    :data-insane-cps="clickPerSecond >= 7"
  >
    {{ clickPerSecond }}

    <button
      :data-low-count="userCounter < 10"
      :data-medium-count="userCounter >= 10 && userCounter < 20"
      :data-high-count="userCounter >= 20"
      @click="increment"
    >
      Global Counter is: {{ counter }}
    </button>
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  background-color: #5e2ca5;

  transition: background-color 1s ease-in-out;

  &[data-low-cps="true"] {
    /* a green bg */
    background-color: #8de06a;
  }

  &[data-medium-cps="true"] {
    background-color: #fbef45;
  }

  &[data-high-cps="true"] {
    background-color: #e30c0c;
  }

  &[data-insane-cps="true"] {
    /* gradient  with moving effect*/
    background: linear-gradient(
      45deg,
      #ff004e,
      #ec2f4b,
      #009fff,
      #ec2f4b,
      #ff004e
    );
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

button {
  padding: 1rem 2rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }

  &[data-low-count="true"] {
    background-color: #fde047;
  }

  &[data-medium-count="true"] {
    background-color: #ffa801;
    /* some cool effects and animations */
    animation: pulse 1s ease-in-out infinite;
  }

  &[data-high-count="true"] {
    background-color: #ff3e00;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
