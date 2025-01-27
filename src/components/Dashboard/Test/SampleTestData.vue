<template>
  <div class="sample-test bg-gradient-to-tr from-purple-200 to-purple-300 min-h-screen px-4 py-4">
    <!-- Header -->
    <div class="flex items-center justify-between bg-indigo-100 text-white py-2 px-2 shadow-lg sticky top-0 z-10">
      <button 
        @click="goBack" 
        class="flex items-center text-purple-600 font-medium py-2 px-2 hover:text-purple-900 rounded-full transition-all">
        <i class="fas fa-arrow-left mr-2"></i>
      </button>
      <h1 class="text-lg font-bold text-purple-700">Sample Test</h1>
      <i class="fas fa-file-alt text-2xl text-purple-700"></i>
    </div>

    <!-- Test Details -->
    <div class="test-details bg-white rounded-lg shadow-md px-6 py-4 mt-4">
      <h2 class="text-xl font-bold text-gray-800 mb-2">Test Overview</h2>
      <p class="text-gray-600 mb-4">This is a practice test designed to give you a feel for the actual competition. Answer all questions to the best of your ability.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-center space-x-2">
          <i class="fas fa-question-circle text-purple-700 text-xl"></i>
          <p class="text-gray-700">Questions: <span class="font-bold">20</span></p>
        </div>
        <div class="flex items-center space-x-2">
          <i class="fas fa-clock text-purple-700 text-xl"></i>
          <p class="text-gray-700">Duration: <span class="font-bold">20 mins</span></p>
        </div>
        <div class="flex items-center space-x-2">
          <i class="fas fa-bullseye text-purple-700 text-xl"></i>
          <p class="text-gray-700">Target Score: <span class="font-bold">80%</span></p>
        </div>
      </div>
    </div>

    <!-- Start Test Button -->
    <div class="flex justify-center mt-6">
      <button 
        class="bg-purple-700 text-white py-2 px-6 rounded-lg font-bold hover:bg-purple-900 transition-all"
        @click="startTest"
      >
        Start Test
      </button>
    </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
import LoaderData from '../../../components/LoaderData.vue';
import ToasterData from '../../../components/ToasterData.vue';
export default {
  name: "SampleTestData",
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
        isLoading: false,
      toastMessage: '',
      toastType: '',
    };
    },
    mounted() {
    this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500); 
  },
  methods: {
    showToast(message, type) {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
            this.toastMessage = '';
        }, 3000);
    },
    goBack() {
        this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push("/dashboard");
      }, 500);
      
    },
    startTest() {
        this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push("/sampleTest/start");
      }, 500);   
    },
  },
};
</script>

<style scoped>
/* Styling specific to this component */
.sample-test {
  font-family: "Inter", sans-serif;
}
</style>
