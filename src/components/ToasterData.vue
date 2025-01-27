<!-- <template>
  <div v-if="show" :class="toastClass" class="fixed top-4 right-4 px-4 py-2 rounded shadow-md flex items-center space-x-2 transition-transform transform" :style="toastStyle">
    <span class="text-xl">{{ icon }}</span>
    <span class="text-sm font-medium">{{ message }}</span>
    <button @click="close" class="ml-4 text-white font-bold text-lg hover:scale-125 transition-transform">&times;</button>
  </div>
</template>

<script>
export default {
  name: 'ToasterData',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
    },
    duration: {
      type: Number,
      default: 3000, 
    },
  },
  data() {
    return {
      show: true,
      timer: null,
    };
  },
  computed: {
    toastClass() {
      switch (this.type) {
        case 'success':
          return 'bg-green-500 text-white';
        case 'danger':
          return 'bg-red-500 text-white';
        case 'warning':
          return 'bg-yellow-500 text-black';
        case 'info':
        default:
          return 'bg-gray-500 text-white';
      }
    },
    icon() {
      switch (this.type) {
        case 'success':
          return '✅';
        case 'danger':
          return '❌';
        case 'warning':
          return '⚠️';
        case 'info':
        default:
          return 'ℹ️';
      }
    },
    toastStyle() {
      return {
        animation: this.show ? 'slide-in 0.5s ease' : 'slide-out 0.5s ease',
      };
    },
  },
  methods: {
    close() {
      this.show = false;
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
  },
  watch: {
    message() {
      this.show = true;
      this.startTimer();
    }
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
};
</script>
<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style> -->

<template>
  <div
    v-if="show"
    :class="toastClass"
    class="fixed top-4 right-4 px-4 py-2 rounded shadow-md flex items-center space-x-2 transition-transform transform z-50"
    :style="toastStyle"
  >
    <span class="text-xl">{{ icon }}</span>
    <span class="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{{ message }}</span>
    <button @click="close" class="ml-4 text-white font-bold text-lg hover:scale-125 transition-transform">&times;</button>
  </div>
</template>

<script>
export default {
  name: 'ToasterData',
  props: {
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    duration: { type: Number, default: 3000 },
  },
  data() {
    return {
      show: true,
      timer: null,
    };
  },
  computed: {
    toastClass() {
      switch (this.type) {
        case 'success':
          return 'bg-green-500 text-white';
        case 'danger':
          return 'bg-red-500 text-white';
        case 'warning':
          return 'bg-yellow-500 text-black';
        default:
          return 'bg-gray-500 text-white';
      }
    },
    icon() {
      switch (this.type) {
        case 'success':
          return '✅';
        case 'danger':
          return '❌';
        case 'warning':
          return '⚠️';
        default:
          return 'ℹ️';
      }
    },
    toastStyle() {
      return {
        animation: this.show ? 'slide-in 0.5s ease' : 'slide-out 0.5s ease',
      };
    },
  },
  methods: {
    close() {
      this.show = false;
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
  },
  watch: {
    message() {
      this.show = true;
      this.startTimer();
    },
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
};
</script>

<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.toast-slide-in {
  animation: slide-in 0.5s ease forwards;
}

.toast-slide-out {
  animation: slide-out 0.7s ease forwards;
}
</style>
