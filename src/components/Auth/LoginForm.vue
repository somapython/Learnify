<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-blue-500 text-white px-4">
    <div class="w-full max-w-md bg-white text-gray-900 rounded-lg shadow-lg p-6 relative">
    <button class="absolute top-4 left-8 text-purple-700 hover:text-purple-900" @click="goBack">
        <i class="fa fa-arrow-left text-2xl"></i>
      </button> 

      <!-- Header Section -->
      <div class="absolute top-4 right-24 text-purple-700 animate-spin-slow mt-1">
        <i class="fa fa-lock text-2xl"></i>
      </div>
      <div class="text-right mb-6">
        <h1 class="text-xl font-bold">Login</h1>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-6">
         <label class="block text-base font-semibold text-purple-700 mb-2">Mobile Number</label>
          <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <i class="fa fa-phone text-purple-600 mr-2"></i>
            <input
              type="tel"
              v-model="mobile"
              pattern="^[0-9]{10}$"
              placeholder="Mobile no"
              maxlength="10"
              class="w-full bg-transparent outline-none"
              required
            />
          </div>
        </div>
        <div class="mb-4">
         <label class="block text-base font-semibold text-purple-700 mb-2">Enter PIN</label>
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
        <div class="mb-6">
          <div class="flex items-center px-3 py-2 ">
            <span class="absolute right-8 text-purple-600 underline text-base cursor-pointer mt-4 hover:text-purple-800"
            @click="forgotPin" >Forgot PIN?</span>
          </div>
        </div>
        <button type="submit" 
        class="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-bold flex items-center justify-center space-x-2">
          <i class="fa fa-lock"></i><span>Login</span> 
        </button>
      </form>
      <!-- Create an Account -->
      <p
        class="text-center mt-6 text-base text-gray-700 cursor-pointer"
        @click="navigateToSignup"
      >
        Don't have an account? <span class="text-purple-700 underline hover:text-purple-900">Sign Up</span>
      </p>
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
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
      mobile: '',
      pin: ['', '', '', ''],
      isLoading: false,
      toastMessage: '',
      toastType: '',
      postData: [],
      localStorageData: '',
    };
  },
  mounted() {
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
    navigateToSignup() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/signup');
      }, 1000);
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
    formatPostData(data){
      this.postData=[];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    forgotPin() {
        if (this.mobile.length !== 10 || !/\d{10}/.test(this.mobile)) {
            this.showToast('Invalid mobile number', 'danger');
            return;
        }else{
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
                this.$router.push({ name: 'ForgotPin', params: { mobile: this.mobile }});
            }, 500);
        } 
    },
    goBack() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/');
      }, 500);
    },
    async handleLogin() {
      const pinCode = this.pin.join('');
      const userData = {
            mobile: this.mobile,
            pin: pinCode
        };
        if (this.mobile.length !== 10 || !/\d{10}/.test(this.mobile)) {
            this.showToast('Invalid mobile number', 'danger');
            return;
        }
        if (!/\d{4}/.test(pinCode)) {
            this.showToast('Invalid PIN', 'danger');
            return;
        }
        this.isLoading = true;
        try{
            const response = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            this.formatPostData(response.data);
            const user = this.postData.find(user => user.mobile === userData.mobile);
           // console.log("2222",user)
            // user.email === "edutech2019@gmail.com"
            if(user.mobile === "9665345990" && user.pin === "9665" ){
              user.isAdmin = true;
            }

            if (user) {
                if (user.pin === userData.pin) {
                    this.localStorageData = JSON.parse(localStorage.getItem('studentData'));
                    for(var i in this.localStorageData){
                        if(this.localStorageData[i].mobile == userData.mobile ){
                            this.localStorageData[i].isLogged = true;
                            const updatedData = JSON.stringify(this.localStorageData);
                            localStorage.setItem('studentData', updatedData);
                        }
                    }

                    await axios.patch(`https://edutech-b196d-default-rtdb.firebaseio.com/studentData/${user.id}.json`, {
                        isLogged: true, isAdmin:true });
                    this.showToast('User Login successful', 'success');
                    this.mobile = '';
                    this.pin = ['', '', '', '']; 
                    this.isLoading = false;
                    this.$router.push('/');
                } else {
                    this.isLoading = false;
                    this.showToast('Invalid PIN', 'danger');
                }
            } else {
                this.isLoading = false;
                this.showToast('User Does not Exist', 'danger');
            } 
        } catch(error){
            this.isLoading = false;
            this.showToast('An error occurred during login', 'danger');
           return;
        }
        finally {
        this.isLoading = false;
        }
    },
  },
};
</script>
<style scoped>
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
</style>
