<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-blue-500 text-white px-4">
    <div class="w-full max-w-lg bg-white text-gray-900 rounded-lg shadow-lg p-6 relative">
      <button class="absolute top-4 left-8 text-purple-700 hover:text-purple-900" @click="goBack">
        <i class="fa fa-arrow-left text-2xl"></i>
      </button>
      <div class="absolute top-4 right-32 text-purple-700 animate-spin-slow mt-1">
        <i class="fa fa-key text-2xl"></i>
      </div>
      <div class="text-right mb-6">
        <h1 class="text-xl font-bold">Reset PIN</h1>
      </div>
      <form @submit.prevent="handleForgotPin">
        <div class="mb-4">
          <label class="block text-base font-semibold text-purple-700 mb-2">Mobile Number</label>
          <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <i class="fa fa-phone text-purple-600 mr-2"></i>
            <input
              type="tel"
              v-model="mobile"
              placeholder="Mobile no"
              maxlength="10"
               pattern="^[0-9]{10}$"
              class="w-full outline-none text-gray-700 bg-gray-100 cursor-not-allowed focus:outline-none"
              disabled
            />
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-base font-semibold text-purple-700 mb-2">Enter New PIN</label>
          <div class="flex justify-between space-x-2 px-4">
            <input
              v-for="(digit, index) in pin"
              :key="index"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              v-model="pin[index]"
              @input="moveToNext(index, $event)"
              @keydown.backspace="moveToPrev(index, $event)"
               ref="pins"
               pattern="\d"
              required
            />
          </div>
        </div>
        <button type="submit" class="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-bold flex items-center justify-center space-x-2">
          <i class="fa fa-key"></i><span>Reset PIN</span>
        </button>
      </form>
    </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
import LoaderData from '../../components/LoaderData.vue';
import ToasterData from '../../components/ToasterData.vue';
import axios from 'axios';
export default {
  components: { LoaderData, ToasterData },
  data() {
    return {
      mobile: this.$route.params.mobile || '',
      pin: ['', '', '', ''],
      toastMessage: '',
      toastType: '',
      isLoading: false,
      postData:[],
      localStorageData: '',
    };
  },
  mounted() {
    if (!this.mobile) {
      this.showToast('Mobile number is required!', 'error');
      return
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  },
  methods: {
    moveToNext(index, event) {
      if (event.target.value && index < this.pin.length - 1) {
         this.$refs.pins[index + 1].focus();
      }
    },
    moveToPrev(index, event) {
      if (!event.target.value && index > 0) {
        this.$refs.pins[index - 1].focus();
      }
    },
   async handleForgotPin() {
      const pinCode = this.pin.join('');
      if (!this.validateForm()) return;

      if (!/\d{4}/.test(pinCode)) {
            this.showToast('Invalid PIN', 'danger');
            return;
        }
        this.isLoading = true;
        try {
            const response = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            this.formatPostData(response.data);
            const user = this.postData.find(user => user.mobile === this.mobile);
            if (!response.data) {
                this.showToast('User Does not exists.', 'error');
                return;
            }

            this.localStorageData = JSON.parse(localStorage.getItem('studentData'));
            for(var i in this.localStorageData){
              if(this.localStorageData[i].mobile == this.mobile){
                  this.localStorageData[i].pin = pinCode;
                  const updatedData = JSON.stringify(this.localStorageData);
                  localStorage.setItem('studentData', updatedData);
              }  
            }
            await axios.patch(`https://edutech-b196d-default-rtdb.firebaseio.com/studentData/${user.id}.json`,
                { pin: pinCode }  );
                this.isLoading = false;  
                setTimeout(()=>{
                    this.$router.push('/login');
                },500)
            this.showToast('PIN reset successful', 'success');
        } catch (error) {
            console.error('Error updating PIN:', error);
            this.showToast('Failed to reset PIN. Please try again.', 'error');
        } finally {
            this.isLoading = false;
            this.resetForm();
        }
    },
    validateForm() {
      this.errors = {};
      if (this.pin.some((digit) => digit === '')) {
        this.errors.pin = 'Please enter all 4 digits of the new PIN';
      }

      return Object.keys(this.errors).length === 0;
    },
    resetError(field) {
      this.errors[field] = '';
    },
    formatPostData(data){
      this.postData=[];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    resetForm() {
        this.mobile = '';
        this.pin = ['', '', '', ''];
    },
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
        this.$router.push('/');
      }, 500);
    }
  },
};
</script>

<style>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
