<template>
  <div class="scholarship-dashboard bg-gradient-to-tr from-purple-200 to-purple-300 min-h-screen">
    <!-- Top Navigation Bar -->
    <div class="flex items-center justify-between bg-purple-100 text-white py-2 px-4 shadow-lg sticky top-0 z-10">
      <button 
        @click="goBack" 
        class="flex items-center text-purple-600 font-medium py-2 px-2 hover:text-purple-900 rounded-full transition-all">
        <i class="fas fa-arrow-left mr-2"></i> 
      </button>
      <h1 class="text-lg font-bold text-purple-700">Scholarship Competitions</h1>
      <i class="fas fa-graduation-cap text-2xl text-blue-700"></i>
    </div>

    <!-- Performance Overview -->
    <div class="performance-overview bg-rose-50 rounded-lg shadow-md px-4 py-2 mt-1 mx-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-1 flex items-center">
        <i class="fas fa-chart-pie text-purple-700 mr-1 spin-icon"></i>Your Performance Overview
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <!-- Circular Metrics -->
        <div class="flex flex-col items-center">
          <div class="relative w-24 h-24">
            <svg class="w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="gray"
                stroke-width="8"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                :stroke="circleColor"
                stroke-width="8"
                fill="none"
                stroke-dasharray="283"
                :stroke-dashoffset="progressOffset"
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-purple-600 text-l font-bold">
              {{ completionPercentage }}%
            </div>
          </div>
          <p class="text-purple-600 mt-1 text-base font-bold">Tests Completed</p>
          <div class="flex space-x-4 ">
            <div class="text-center">
              <p class="text-lg font-bold text-blue-600 border border-1 rounded-full border-blue-600 bg-blue-100 w-10 h-10 flex items-center justify-center mx-auto">{{ attemptedTests }}</p>
              <p class="text-sm text-gray-500">Attempted</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-green-600 border border-1 rounded-full border-green-600 bg-green-100 w-10 h-10 flex items-center justify-center mx-auto">{{ overallScore }}</p>
              <p class="text-sm text-gray-500">Overall Score</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-yellow-600 border border-1 rounded-full border-yellow-600 bg-yellow-100 w-10 h-10 flex items-center justify-center mx-auto">{{ accuracy }}%</p>
              <p class="text-sm text-gray-500">Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Performance Line Graph -->
          <!-- <div>
            <LineChartData :data="performanceData" />
          </div> -->
    <!-- Subject-wise Strength -->
    <div class="subject-strength bg-teal-50 rounded-lg shadow-md px-4 py-2 mt-1 mx-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
        <i class="fas fa-flask text-teal-700 mr-2 spin-icon"></i>Subject-wise Strength
      </h2>
      <div v-for="subject in subjects" :key="subject.name" class="mb-2">
        <div class="flex justify-between items-center">
          <p class="text-gray-800 text-sm flex items-center">
            {{ subject.name }}
          </p>
          <p :class="['font-bold text-sm', subject.accuracy >= 75 ? 'text-green-600' : subject.accuracy >= 50 ? 'text-yellow-600' : 'text-red-600']">
            {{ subject.accuracy }}%
          </p>
        </div>
        <div class="w-full bg-gray-200 h-2 rounded-full">
          <div
            class="h-2 rounded-full"
            :class="subject.accuracy >= 75 ? 'bg-green-500' : subject.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
            :style="{ width: subject.accuracy + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Advertisement Section -->
    <div class="advertisement bg-gradient-to-r from-cyan-600 to-blue-700 py-1 px-1 mt-2 mx-1 rounded-lg shadow-lg text-center flex items-center justify-between">
      <i class="fas fa-crown text-2xl text-rose-700 spin-icon"></i>
      <div>
        <h3 class="text-lg font-bold text-white">Unlock Premium Features!</h3>
        <p class="text-sm text-white mb-1">Get exclusive access to the top scholarships and competitions!</p>
        <div class="flex justify-center space-x-2">
          <button 
            @click="takeSampleTest"
            class="bg-gray-300 text-purple-600 font-medium py-1 px-4 rounded-full hover:bg-purple-200 transition-all">
            Sample Test
          </button>
          <button 
            @click="upgradeOrTakeTest"
            :class="isUpgraded ? 'bg-green-600' : 'bg-orange-600'"
            class="text-white font-medium py-1 px-4 rounded-full hover:bg-opacity-90 transition-all">
            {{ isUpgraded ? 'Take a Test' : 'Upgrade Now' }}
          </button>
        </div>
      </div>
      <i class="fas fa-star text-2xl text-yellow-500 spin-icon"></i>
    </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
// import LineChartData from "../../components/Dashboard/LineChartData.vue";
import LoaderData from '../../components/LoaderData.vue';
import ToasterData from '../../components/ToasterData.vue';
export default {
  name: "ScholarshipCompetitions",
  components: {
    LoaderData,
    ToasterData,
    // LineChartData,
  },
  data() {
    return {
      completionPercentage: 70,
      attemptedTests: 12,
      overallScore: 85,
      accuracy: 78,
      isUpgraded: false, // Track whether the user is upgraded
      performanceData: [
        { label: "Week 1", score: 60, avg: 55 },
        { label: "Week 2", score: 65, avg: 60 },
        { label: "Week 3", score: 75, avg: 65 },
        { label: "Week 4", score: 85, avg: 70 },
      ],
      subjects: [
        { name: "Mathematics", accuracy: 80 },
        { name: "Physics", accuracy: 70 },
        { name: "Chemistry", accuracy: 50 },
        { name: "English", accuracy: 45 },
      ],
        toastMessage: '',
        toastType: '',
        isLoading: false,
    };
  },
  computed: {
    progressOffset() {
      const circumference = 283; // 2 * Math.PI * 45
      return circumference - (this.completionPercentage / 100) * circumference;
    },
    circleColor() {
      return this.completionPercentage >= 75
        ? "green"
        : this.completionPercentage >= 50
        ? "yellow"
        : "red";
    },
  },
  mounted() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500); 
    },
  methods: {
    goBack() {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push("/dashboard");
        }, 500);   
      },
    takeSampleTest() {
      // alert("Taking a sample test!");
      this.$router.push("/sampleTest");
    },
    upgradeOrTakeTest() {
      if (this.isUpgraded) {
        alert("Taking a premium test!");
      } else {
        this.$router.push("/test");
      }
    },
    showToast(message, type) {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
            this.toastMessage = '';
        }, 3000);
    },
  },
};
</script>

<style scoped>
svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.spin-icon {
  display: inline-block;
  animation: spin 2s linear infinite;
}

/* Keyframes for Spinning */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
