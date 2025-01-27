<template>
  <div class="original-test bg-gradient-to-tr from-purple-200 to-purple-300 min-h-screen px-4 py-4">
    <!-- Header -->
    <div class="flex items-center justify-between bg-purple-100 text-white py-2 px-2 shadow-lg sticky top-0 z-10">
      <button 
        @click="goBack" 
        class="flex items-center text-purple-600 font-medium py-2 px-2 hover:text-purple-900 rounded-full transition-all">
        <i class="fas fa-arrow-left mr-2"></i>
      </button>
      <h1 class="text-lg font-bold text-teal-700">Final Test</h1>
      <i class="fas fa-file-alt text-2xl text-purple-700"></i>
    </div>

    <!-- Test Details -->
    <div class="test-details bg-white rounded-lg shadow-md px-6 py-4 mt-4">
      <h2 class="text-xl font-bold text-gray-800 mb-2 text-center">Test Details</h2>
      <p class="text-gray-600 mb-4">
        This is the official test. Answer all questions carefully and submit within the allocated time.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="flex items-center space-x-2">
          <i class="fas fa-question-circle text-purple-700 text-xl"></i>
          <p class="text-gray-700">Questions: <span class="font-bold">30</span></p>
        </div>
        <div class="flex items-center space-x-2">
          <i class="fas fa-clock text-purple-700 text-xl"></i>
          <p class="text-gray-700">Duration: <span class="font-bold">20 Minutes</span></p>
        </div>
        <div class="flex items-center space-x-2">
          <i class="fas fa-bullseye text-purple-700 text-xl"></i>
          <p class="text-gray-700">Passing Score: <span class="font-bold">80%</span></p>
        </div>
        <div class="flex items-center space-x-2">
          <i class="fas fa-trophy text-purple-700 text-xl"></i>
          <p class="text-gray-700">Top 10 candidates will receive a <span class="font-bold text-green-600 text-lg">Bumper Lucky Prize</span> based on their timing and accuracy.</p>
        </div>
        <div class="flex items-center space-x-2">
          <i class="fas fa-certificate text-purple-700 text-xl"></i>
          <p class="text-gray-700">Attempt <span class="font-bold text-lg">at least 10 papers</span> to earn an online certificate sent to your registered email.</p>
        </div>
      </div>
    </div>

    <!-- Start Test Button -->
    <div class="flex justify-center mt-6">
      <button 
        class="bg-purple-700 text-white py-2 px-6 rounded-lg font-bold hover:bg-purple-900 transition-all"
        @click="showConfirmation"
      >
      <i class="fas fa-play-circle mr-2"></i> Start Test
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg px-6 py-2 w-[90%] md:w-1/3">
        <h2 class="text-2xl font-bold text-red-600 mb-2 text-center"><i class="fas fa-check-circle mr-2"></i> Confirm Test Start</h2>
        <p class="text-gray-600 mb-4">
          Please review and agree to the following rules before starting the test:
        </p>
        <ul class="list-disc list-inside text-gray-600 mb-4">
          <li>Maintain a stable internet connection throughout the test.</li>
          <li>Do not refresh or close the test page during the test.</li>
          <li>Complete the test within the allocated time frame.</li>
          <li>Avoid any unfair practices or external assistance.</li>
          <li>Final decisions regarding disputes or results will be made by the management.</li>
        </ul>
        <form>
          <div class="mb-2 flex items-center">
            <input type="checkbox" v-model="rulesAccepted" id="acceptRules" class="mr-2" />
            <label for="acceptRules" class="text-gray-600">
              By submitting, I agree to all the rules and regulations mentioned above.
            </label>
          </div>
        </form>
        <div class="flex justify-end space-x-4 mt-2">
          <button 
            class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-bold hover:bg-gray-400 transition-all"
            @click="closeModal"
          >
            Cancel
          </button>
          <button 
            class="bg-purple-700 text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-900 transition-all"
            :disabled="!rulesAccepted"
            @click="confirmStart"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>


    <LoaderData v-if="isLoading" />
    <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script>
import LoaderData from '../../../components/LoaderData.vue';
import ToasterData from '../../../components/ToasterData.vue';

export default {
  name: "OriginalTestData",
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
      isLoading: false,
      toastMessage: '',
      toastType: '',
      showModal: false,
      rulesAccepted: false, 
    };
  },
  computed: {
    isRulesAccepted() {
    return this.rulesAccepted;  // Just check if it's true or false
  },
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
    showConfirmation() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    confirmStart() {
      this.showModal = false;
      this.startTest();
    },
    startTest() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push("/test/start");
        this.showToast('Test started successfully!', 'success');
      }, 500);
    },
  },
};
</script>

<style scoped>
.original-test {
  font-family: "Inter", sans-serif;
}
</style>
