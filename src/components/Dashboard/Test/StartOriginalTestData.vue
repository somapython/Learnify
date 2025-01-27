<template>
  <div class="start-test bg-gradient-to-br from-purple-200 to-purple-300 min-h-screen px-4 py-2">
    <!-- Header -->
    <div class="flex-1 overflow-y-auto">
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
        <p class="text-gray-700 font-medium">Time Remaining: <span class="font-bold text-purple-600">{{ formattedTime }}</span></p>
      </div>
      <p class="text-gray-700 font-medium">Question: <span class="font-bold text-purple-600">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span></p>
    </div>
    <!--Progress Bar-->
        <div class="progress-bar mt-2">
          <div class="w-full bg-gray-200 h-2 rounded-full">
            <div 
              class="bg-green-600 h-2 rounded-full" 
              :style="'width: ' + (currentQuestionIndex / questions.length) * 100 + '%'"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-1 text-right">
            {{ currentQuestionIndex + 1 }} / {{ questions.length }} Questions Completed
          </p>
        </div>

    <!-- Question Section -->
    <div v-if="currentQuestion" class="question bg-white rounded-lg shadow-md px-6 py-2 mt-2 transition-all ease-in-out">
      <h2 class="text-lg font-bold text-gray-800 mb-2">Question {{ currentQuestionIndex + 1 }}</h2>
      <p class="text-gray-700 mb-2">{{ currentQuestion.text }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-left hover:bg-green-100 transition-all "
          @click="selectOption(index)"
          :class="{
            'bg-purple-800 text-gray-200': selectedOption === index,
            'border-purple-500': selectedOption === index,
            'bg-green-100': isAttempted(currentQuestionIndex)
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
      <div class="grid grid-cols-10 gap-1">
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
    <div v-if="showSubmitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
  <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative max-w-full mx-4 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <!-- Add a premium background image with slight opacity -->
      <img src="../../../assets/books/background.png" alt="Background" class="w-full h-full object-cover opacity-50" />
    </div>
    <h2 class="text-xl font-bold text-purple-700 mb-4 text-center"><span class="spin-icon-premium">🎉</span> Test Submitted Successfully! <span class="spin-icon-premium">🎉</span></h2>
    <p class="text-blue-700 font-semibold text-lg mb-2">Total Questions: <span class="font-bold">{{ questions.length }}</span></p>
    <p class="text-green-700 font-semibold text-lg mb-2">Attempted Questions: <span class="font-bold">{{ attemptedQuestions }}</span></p>
    <p class="text-red-700 font-semibold text-lg mb-2">Unattempted Questions: <span class="font-bold">{{ unattemptedQuestion }}</span></p>
    <button
      class="bg-red-500 text-white py-2 px-4 rounded-lg font-bold mt-6 hover:bg-red-600 transition-all mx-auto block text-center"
      @click="closeModal"
    >
      Close
    </button>
  </div>
</div>
    <!-- <div v-if="showSubmitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
    </div> -->
  </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </div>
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
     // Maths Questions
        { text: "What is 9 × 7?", options: ["56", "63", "72", "49"], correctIndex: 1 },
        { text: "What is the perimeter of a rectangle with length 10 cm and width 4 cm?", options: ["28 cm", "36 cm", "24 cm", "40 cm"], correctIndex: 0 },
        { text: "What is the area of a square with side 8 cm?", options: ["64 cm²", "48 cm²", "72 cm²", "100 cm²"], correctIndex: 0 },
        { text: "If you divide 56 by 7, what is the quotient?", options: ["6", "7", "8", "9"], correctIndex: 2 },
        { text: "What is the value of 10²?", options: ["100", "20", "50", "10"], correctIndex: 0 },
        { text: "If a circle has a radius of 7 cm, what is its diameter?", options: ["14 cm", "21 cm", "7 cm", "28 cm"], correctIndex: 0 },
        { text: "‘माझे नाव राजा आहे.’ या वाक्यात क्रियापद कोणते आहे?", options: ["नाव", "आहे", "राजा", "माझे"], correctIndex: 1 },
        { text: "‘तुम्ही कुठे जात आहात?’ या वाक्यात सर्वनाम कोणते आहे?", options: ["तुम्ही", "आहेत", "कुठे", "जात"], correctIndex: 0 },
        { text: "‘आकाश गडद झाले आहे.’ वाक्यातील विशेषण कोणते आहे?", options: ["आकाश", "गडद", "झाले", "आहे"], correctIndex: 1 },
        { text: "‘ती माझी सहलीसाठी तयार आहे.’ या वाक्यात ‘सहलीसाठी’ कोणता प्रकार आहे?", options: ["विशेषण", "सर्वनाम", "उपसर्ग", "संधी"], correctIndex: 2 },
        { text: "‘पाणी स्वच्छ आहे.’ वाक्यात ‘स्वच्छ’ कोणता प्रकार आहे?", options: ["विशेषण", "नाम", "सर्वनाम", "क्रियापद"], correctIndex: 0 },
        { text: "‘मी पुस्तक वाचत आहे.’ या वाक्यात क्रियापद कोणते आहे?", options: ["वाचत", "पुस्तक", "मी", "आहे"], correctIndex: 0 },
        { text: "What comes next in the sequence: 1, 4, 9, 16, ?", options: ["25", "18", "20", "22"], correctIndex: 0 },
        { text: "If it takes 2 hours for 5 workers to build a wall, how long will it take for 10 workers to build the same wall?", options: ["1 hour", "2 hours", "3 hours", "5 hours"], correctIndex: 0 },
        { text: "What is the next number in the pattern: 2, 6, 12, 20, ?", options: ["30", "28", "35", "24"], correctIndex: 0 },
        { text: "Which of these numbers is a prime number?", options: ["4", "6", "7", "8"], correctIndex: 2 },
        { text: "If a day in a week is 30 hours long, how many hours are in 2 days?", options: ["60", "70", "50", "75"], correctIndex: 1 },
        { text: "What is the smallest prime number?", options: ["1", "2", "3", "4"], correctIndex: 1 },
        // Image-based Intellectual Questions
      // { text: "What is the shape of this object?", image: "image1.jpg", options: ["Circle", "Square", "Triangle", "Hexagon"], correctIndex: 0 },
        //{ text: "How many sides does this shape have?", image: "image2.jpg", options: ["3", "4", "5", "6"], correctIndex: 3 },
        { text: "Which one of these is an adverb?", options: ["Quickly", "Run", "Beautiful", "Jump"], correctIndex: 0 },
        { text: "What is the opposite of ‘happy’?", options: ["Sad", "Angry", "Joyful", "Sleepy"], correctIndex: 0 },
        { text: "Which of the following is a plural noun?", options: ["Cat", "Cats", "Dog", "Child"], correctIndex: 1 },
        { text: "What is the past tense of ‘run’?", options: ["Ran", "Run", "Running", "Runned"], correctIndex: 0 },
        { text: "Identify the pronoun in the sentence: 'She is going to the park.'", options: ["She", "Going", "Park", "Is"], correctIndex: 0 },
        { text: "Which word is a verb?", options: ["Quick", "Jump", "Blue", "Table"], correctIndex: 1 },
        { text: "Who was the first President of India?", options: ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "Mahatma Gandhi", "Sardar Patel"], correctIndex: 1 },
        { text: "Who was the first ruler of the Maurya Dynasty?", options: ["Chandragupta Maurya", "Ashoka", "Bimbisara", "Bindusara"], correctIndex: 0 },
        { text: "Which year did India gain independence?", options: ["1942", "1947", "1950", "1960"], correctIndex: 1 },
        { text: "Who was the founder of the Gupta Empire?", options: ["Chandragupta Maurya", "Samudragupta", "Chandragupta I", "Ashoka"], correctIndex: 2 },
        { text: "Who led the Salt March in 1930?", options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"], correctIndex: 1 },
        { text: "Which battle is considered a turning point in Indian history?", options: ["Battle of Plassey", "Battle of Panipat", "Battle of Haldighati", "Battle of Tarain"], correctIndex: 0 },
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

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}
</style>
