<template>
  <div class="start-test bg-gradient-to-br from-purple-200 to-purple-300 min-h-screen px-4 py-2">
    <!-- Header -->
    <div class="flex items-center justify-between bg-green-100 text-white py-2 px-2 shadow-lg sticky top-0 z-10">
      <button 
        @click="goBack" 
        class="flex items-center text-green-600 font-medium py-2 px-2 hover:text-green-900 rounded-full transition-all">
        <i class="fas fa-arrow-left mr-2"></i>
      </button>
      <h1 class="text-lg font-bold text-green-700">Test in Progress</h1>
      <i class="fas fa-clock text-2xl text-green-700"></i>
    </div>

    <!-- Timer and Progress -->
    <div class="test-status bg-white rounded-lg shadow-md px-6 py-2 mt-2 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <i class="fas fa-stopwatch text-green-600 text-xl animate-spin-slow"></i>
        <p class="text-gray-700 font-medium">Time Remaining: <span class="font-bold">{{ formattedTime }}</span></p>
      </div>
      <p class="text-gray-700 font-medium">Question: <span class="font-bold">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span></p>
    </div>

    <!-- Question Section -->
    <div v-if="currentQuestion" class="question bg-white rounded-lg shadow-md px-6 py-2 mt-2">
      <h2 class="text-lg font-bold text-gray-800 mb-2">Question {{ currentQuestionIndex + 1 }}</h2>
      <p class="text-gray-700 mb-2">{{ currentQuestion.text }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-left hover:bg-green-100 transition-all"
          @click="selectOption(index)"
          :class="{
            'bg-purple-800 text-gray-200': selectedOption === index,
          }"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-4">
      <button
        class="bg-gray-400 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all"
        :disabled="currentQuestionIndex === 0"
        @click="prevQuestion"
      >
        Previous
      </button>
      <button
        v-if="currentQuestionIndex < questions.length - 1"
        class="bg-green-700 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-800 transition-all"
       @click="validateAndNext"
      >
        Next
      </button>
      <button
        v-else
        class="bg-purple-700 text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-800 transition-all"
        @click="submitTest"
      >
        Submit
      </button>
    </div>

    <!-- Question Tracker -->
    <div class="mt-2 bg-white px-4 py-2 rounded-lg shadow-md">
      <h3 class="text-gray-700 font-medium mb-2">Question Tracker</h3>
      <div class="grid grid-cols-10 gap-2">
        <button
          v-for="(q, i) in questions"
          :key="i"
          class="w-8 h-8 rounded-full text-sm font-bold"
          :class="{
            'bg-green-500 text-white': isAttempted(i),
            'bg-gray-300': !isAttempted(i),
          }"
          @click="jumpToQuestion(i)"
        >
          {{ i + 1 }}
        </button>
      </div>
    </div>
    <div>
    <!-- Confirmation Modal -->
      <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 class="text-2xl font-bold text-red-600 mb-4 text-center">Are you sure?</h2>
        <p class="text-gray-700 mb-4 text-lg">Do you want to submit the test?</p>
        <div class="flex justify-between">
          <button
            class="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-all"
            @click="cancelSubmit"
          >
            Cancel
          </button>
          <button
            class="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition-all"
            @click="confirmSubmit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>

    <!-- Submission Success Modal -->
    <div v-if="showSubmitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg w-84 relative">
        <div id="confetti" class="absolute inset-0 pointer-events-none"></div>
        <h2 class="text-lg font-bold text-purple-700 mb-4 "><span class="spin-icon-premium">🎉</span> Test Submitted Successfully! <span class="spin-icon-premium">🎉</span></h2>
        <p class="text-blue-700 font-semibold text-lg mb-2 ">Total Questions: <span class="font-bold">{{ questions.length }}</span></p>
        <p class="text-green-700 font-semibold text-lg mb-2 ">Attempted Questions: <span class="font-bold">{{ attemptedQuestions }}</span></p>
        <p class="text-red-700 font-semibold text-lg mb-2 ">UnAttempted Questions: <span class="font-bold">{{ unattemptedQuestion }}</span></p>
        <button
          class="bg-red-500 text-white py-2 px-4 rounded-lg font-bold mt-6 hover:bg-red-600 transition-all mx-auto block text-center"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
import LoaderData from "../../../components/LoaderData.vue";
import ToasterData from "../../../components/ToasterData.vue";
import confetti from "canvas-confetti";

export default {
  name: "StartTestData",
  components: { LoaderData, ToasterData },
  data() {
    return {
      timer: 1200, // 20 minutes in seconds
      currentQuestionIndex: 0,
      selectedOption: null,
      isLoading: false,
      toastMessage: "",
      toastType: "",
      showSubmitModal: false,
      showConfirmationModal: false,
      attemptedQuestions: 0,
      unattemptedQuestion: 0,
      correctAnswers: 0,
      questions: [
      { text: "What is 12 × 8?", options: ["84", "96", "72", "64"], correctIndex: 1 },
      { text: "What is the perimeter of a square with side 6 cm?", options: ["18 cm", "36 cm", "24 cm", "30 cm"], correctIndex: 2 },
      { text: "If a bag has 24 apples and you divide them equally among 6 people, how many apples will each person get?", options: ["4", "5", "6", "7"], correctIndex: 2 },
      { text: "What is the value of 5³?", options: ["15", "25", "125", "75"], correctIndex: 2 },
      { text: "If the length of a rectangle is 12 cm and the width is 5 cm, what is its area?", options: ["60 cm²", "55 cm²", "72 cm²", "100 cm²"], correctIndex: 0 },
      { text: "‘राम आपल्या शाळेत जातो’ या वाक्यात क्रियापद कोणते आहे?", options: ["राम", "जातो", "शाळेत", "आपल्या"], correctIndex: 1 },
      { text: "‘आभाळात चांदण्या चमकत आहेत.’ वाक्यातील नाम कोणते आहे?", options: ["आभाळात", "चांदण्या", "चमकत", "आहेत"], correctIndex: 1 },
      { text: "मराठी मुळाक्षरे किती आहेत?", options: ["36", "42", "50", "48"], correctIndex: 3 },
      { text: "‘माझे बाबा डॉक्टर आहेत.’ या वाक्यात ‘डॉक्टर’ कोणता प्रकार आहे?", options: ["नाम", "सर्वनाम", "विशेषण", "क्रियापद"], correctIndex: 0 },
      { text: "‘दिवाळीचा सण आनंदाचा आहे.’ या वाक्यात ‘आनंदाचा’ कोणता प्रकार आहे?", options: ["सर्वनाम", "विशेषण", "नाम", "क्रियापद"], correctIndex: 1 },
      { text: "If John is older than Sam and Sam is older than Alex, who is the youngest?", options: ["John", "Sam", "Alex", "Cannot be determined"], correctIndex: 2 },
      { text: "If a clock shows 3:15, how many degrees is the angle between the hour hand and the minute hand?", options: ["0°", "7.5°", "37.5°", "90°"], correctIndex: 2 },
      { text: "Which of the following is a living thing?", options: ["Rock", "Tree", "Table", "Car"], correctIndex: 1 },
      { text: "If a bird has two wings, how many wings do 7 birds have?", options: ["12", "14", "10", "16"], correctIndex: 1 },
      { text: "Which one of these does not belong in the group?", options: ["Cat", "Dog", "Fish", "Parrot"], correctIndex: 2 },
      { text: "Which word is a noun?", options: ["Run", "Quickly", "River", "Beautiful"], correctIndex: 2 },
      { text: "What is the past tense of ‘go’?", options: ["Goes", "Went", "Going", "Gone"], correctIndex: 1 },
      { text: "Identify the adjective in the sentence: 'She wore a beautiful dress.'", options: ["She", "Wore", "Beautiful", "Dress"], correctIndex: 2 },
      { text: "Which of these is a synonym for ‘happy’?", options: ["Sad", "Angry", "Joyful", "Sleepy"], correctIndex: 2 },
      { text: "What is the plural form of ‘child’?", options: ["Childs", "Children", "Childes", "Childrens"], correctIndex: 1 },
          ],
      answers: {}, // Store user's answers
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    formattedTime() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },
  methods: {
    goBack() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push("/dashboard");
      }, 500);
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.timerInterval);
          this.confirmSubmit();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerInterval);
    },
    selectOption(index) {
      this.selectedOption = index;
      this.answers[this.currentQuestionIndex] = index;
    },
    isAttempted(index) {
      return this.answers[index] !== undefined;
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.selectedOption = this.answers[this.currentQuestionIndex] || null;
      }
    },
    validateAndNext() {
    if (this.selectedOption === null) {
        this.showToast("Please select at least one option.", "warning");
        return;
    } else {
      this.nextQuestion();
    }
  },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedOption = this.answers[this.currentQuestionIndex] || null;
      }
    },
    jumpToQuestion(index) {
      this.currentQuestionIndex = index;
      this.selectedOption = this.answers[index] || null;
    },
    submitTest() {
      this.showConfirmationModal = true;
    },
    cancelSubmit() {
      this.showConfirmationModal = false;
    },
    confirmSubmit() {
      this.stopTimer();
      this.showConfirmationModal = false;
      this.attemptedQuestions = Object.keys(this.answers).length;
      this.unattemptedQuestion = (this.questions.length - this.attemptedQuestions);
      this.correctAnswers = Object.entries(this.answers).filter(
        ([index, answer]) => this.questions[index].correctIndex === answer
      ).length;
      this.showSubmitModal = true;
      this.launchConfetti();
    },
    launchConfetti() {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    },
    showToast(message, type) {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
            this.toastMessage = '';
        }, 3000);
    },
    closeModal() {
      this.showSubmitModal = false;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push("/dashboard");
      }, 500);
    },
  },
  mounted() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
    this.startTimer();
  },
  beforeUnmount() {
    this.stopTimer();
  },
};
</script>

<style scoped>
.start-test {
  font-family: "Inter", sans-serif;
}
.option {
  cursor: pointer;
}
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.spin-icon-premium {
  display: inline-block;
  animation: spin 2s ease-in-out infinite;
  color: #ffeb3b; /* Premium gold color */
}
</style>
