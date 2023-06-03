<script setup lang="ts">
const { data } = await useFetch<number>("/api/counter");

const userCounter = ref(0);

const counter = ref<number>(data.value ?? 0);

const counterHistory = reactive<Date[]>([]);

const clickPerSecond = ref(0);

const storedCount = ref(0);

const audioRef = ref<HTMLAudioElement>();

const currentAudio = ref<string>("base");

const icons = computed(() => {
  if (clickPerSecond.value < 3) {
    return "😴😴😴😴";
  }

  if (clickPerSecond.value >= 3 && clickPerSecond.value < 5) {
    return "😳😳😳😳";
  }

  if (clickPerSecond.value >= 5 && clickPerSecond.value < 7) {
    return "😱😱😱😱";
  }

  if (clickPerSecond.value >= 7) {
    return "🤯🤯🤯🤯";
  }
});

function increment() {
  if (audioRef.value && audioRef.value.paused) {
    audioRef.value.src = `/audio/${currentAudio.value}.mp3`;
    audioRef.value.play();
  }

  counter.value++;
  storedCount.value++;
  userCounter.value++;
  counterHistory.push(new Date());
  if (counterHistory.length > 10) {
    counterHistory.shift();
  }
}

function updateServerCounter() {
  if (storedCount.value) {
    fetch("/api/counter", {
      method: "POST",
      body: storedCount.value.toString(),
    });
    storedCount.value = 0;
  }
}

onMounted(() => {
  setInterval(() => {
    clickPerSecond.value = counterHistory.filter((date) => {
      const now = new Date();
      return date.getTime() > now.getTime() - 1000;
    }).length;

    if (audioRef.value && !audioRef.value.paused) {
      const newAudio = clickPerSecond.value > 3 ? "high" : "base";
      if (newAudio !== currentAudio.value) {
        currentAudio.value = newAudio;

        audioRef.value.src = `/audio/${newAudio}.mp3`;
        audioRef.value.volume = newAudio === "high" ? 0.6 : 0.1;
        audioRef.value.play();
      }
    }
  }, 250);

  setInterval(() => updateServerCounter(), 8000);
});

onUnmounted(() => {
  updateServerCounter();
});
</script>

<template>
  <main
    :data-low-cps="clickPerSecond < 3"
    :data-medium-cps="clickPerSecond >= 3 && clickPerSecond < 5"
    :data-high-cps="clickPerSecond >= 5 && clickPerSecond < 7"
    :data-insane-cps="clickPerSecond >= 7"
  >
    <h1>{{ icons }}</h1>
    <button @click="increment">Counter is {{ counter }}</button>
  </main>

  <audio ref="audioRef" hidden loop></audio>
</template>

<style lang="scss">
h1 {
  margin-bottom: 2rem;
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

main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  font-size: 2rem;
  font-weight: bold;
  background-color: #8de06a;
  transition: background-color 0.5s ease-in-out;

  &[data-medium-cps="true"] {
    background-color: #fbef45;
    --translate-amount: 1px;

    button {
      padding: 1.5rem 3rem;
      font-size: 1.5rem;
      animation: vibration 0.3s infinite;
      background-color: #9e9512;
    }
  }

  &[data-high-cps="true"] {
    background-color: #e30c0c;
    --translate-amount: 4px;

    button {
      padding: 2rem 4rem;
      font-size: 2rem;
      animation: vibration 0.3s infinite;
      background-color: #881919;
    }
  }

  &[data-insane-cps="true"] {
    /* gradient  with moving effect*/
    background: linear-gradient(180deg, #ff0000, #000000);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;

    --translate-amount: 12px;

    button {
      padding: 3rem 5rem;
      font-size: 3rem;
      animation: vibration 0.3s infinite;
      background-color: #000000;
    }
  }
}

button {
  padding: 1rem 2rem;
  border: 0;
  border-radius: 0.5rem;
  font-size: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  background-color: #007bff;
  color: #fff;
  &:hover {
    scale: 1.05;
  }
}

@keyframes vibration {
  0% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(
      calc(-1 * var(--translate-amount)),
      calc(-1 * var(--translate-amount))
    );
  }
  20% {
    transform: translate(var(--translate-amount), var(--translate-amount));
  }
  30% {
    transform: translate(calc(-1 * var(--translate-amount)), 0);
  }
  40% {
    transform: translate(var(--translate-amount), 0);
  }
  50% {
    transform: translate(0, calc(-1 * var(--translate-amount)));
  }
  60% {
    transform: translate(0, var(--translate-amount));
  }
  70% {
    transform: translate(
      calc(-1 * var(--translate-amount)),
      calc(-1 * var(--translate-amount))
    );
  }
  80% {
    transform: translate(var(--translate-amount), var(--translate-amount));
  }
  90% {
    transform: translate(calc(-1 * var(--translate-amount)), 0);
  }
  100% {
    transform: translate(var(--translate-amount), 0);
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
