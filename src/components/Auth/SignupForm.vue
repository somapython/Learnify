<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-blue-500 text-white px-4">
        <div class="w-full max-w-lg bg-white text-gray-900 rounded-lg shadow-lg p-6 relative">
            <button class="absolute top-4 left-4 text-purple-700 hover:text-purple-900" @click="goBack">
                <i class="fa fa-arrow-left text-2xl"></i>
            </button>
            <div class="absolute top-4 right-28 text-purple-700 animate-spin-slow mt-1">
                <i class="fa fa-user-plus text-2xl"></i>
            </div>
            <div class="text-right mb-4">
                <h1 class="text-xl font-bold">Sign Up</h1>
            </div>
            <form @submit.prevent="handleSignup">
                <div class="mb-3">
                    <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                        <i class="fa fa-user text-purple-600 mr-2"></i>
                        <input type="text" v-model="name" placeholder="Name"
                        class="w-full bg-transparent outline-none" required />
                    </div>
                </div>
                <div class="mb-3">
                    <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                        <i class="fa fa-phone text-purple-600 mr-2"></i>
                        <input type="tel" v-model="mobile" placeholder="Mobile no"
                        class="w-full bg-transparent outline-none" pattern="^[0-9]{10}$"
                        title="Please enter a valid 10-digit mobile number" required />
                    </div>
                </div>
                <div class="mb-3">
                    <div class="flex justify-between space-x-2 px-4">
                        <input v-for="(digit, index) in pin" :key="index"
                        type="text" maxlength="1" class="w-10 h-10 text-center border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        v-model="pin[index]" @input="moveToNext(index, $event)"
                        @keydown.backspace="moveToPrev(index, $event)" ref="pins" required />
                    </div>
                </div>
                <div class="mb-3">
                    <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                        <i class="fa fa-graduation-cap text-purple-600 mr-2"></i>
                        <select v-model="standard" class="w-full bg-gray-100 outline-none" required >
                            <option value="" disabled selected>Select your standard</option>
                            <option v-for="i in 10" :key="i" :value="i">{{ i }} Class</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                        <i class="fa fa-envelope text-purple-600 mr-2"></i>
                        <input type="email" v-model="email" placeholder="Email"
                        class="w-full bg-transparent outline-none" required />
                    </div>
                </div>
                <div class="mb-3">
                    <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                        <i class="fa fa-file-upload text-purple-600 mr-2"></i>
                        <input type="file" @change="handleImageUpload" accept="image/*"
                        class="w-full bg-transparent outline-none" required />
                    </div>
                </div>
                <div class="mb-3">
                    <div class="flex items-start border rounded-lg px-3 py-2 bg-gray-50">
                        <i class="fa fa-home text-purple-600 mr-2 mt-1"></i>
                        <input v-model="city" placeholder="Enter your city" class="w-full bg-transparent outline-none"
                        required />
                    </div>
                </div>
                <div class="mb-3">
                    <div class="flex items-start border rounded-lg px-3 py-2 bg-gray-50">
                        <i class="fa fa-location-dot text-purple-600 mr-2 mt-1"></i>
                        <input v-model="zipcode" placeholder="Enter your pincode"
                        class="w-full bg-transparent outline-none" required />
                    </div>
                </div>
                <div class="mb-3">
                    <button type="submit" class="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-bold flex items-center justify-center space-x-2" >
                        <i class="fa fa-user-plus"></i>
                        <span>Sign Up</span>
                    </button>
                </div>
                <p class="text-center">
                        Already have an account?
                    <span class="text-purple-700 underline cursor-pointer hover:text-purple-800"
                    @click="navigateToLogin" >
                        Login
                    </span>
                </p>
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
  components: {
    LoaderData,
    ToasterData,
  },
  data() {
    return {
      name: '',
      mobile: '',
      standard: '',
      email: '',
      city: '',
      zipcode:'',
      toastMessage: '',
      toastType: '',
      profileImage: null,
      pin: ['', '', '', ''],
      isLoading: false,
      postData: [],
      isUserExists: false,
      isLoggedIn: false,
      isAdmin:false,
      tokenId:'',
    };
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
        this.$router.push('/');
      }, 500);
    },
    navigateToLogin() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/login');
      }, 500);
    },
    handleImageUpload(event) {
      this.profileImage = event.target.files[0];
    },
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
    resetForm() {
      this.name = '';
      this.city = '';
      this.zipcode = '',
      this.mobile = '';
      this.pin = ['', '', '', ''];
      this.profilePicture = null;
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    async handleSignup() {
      const pinCode = this.pin.join('');
      if (!this.name || !this.mobile || !this.standard || !this.city || !this.zipcode || !this.email || !this.pin.some((val) => val) || !this.profileImage) {
        this.showToast('Please fill out the form', 'danger');
        return;
      }

      if (this.mobile.length !== 10 || !/^\d{10}$/.test(this.mobile)) {
        this.showToast('Invalid mobile number', 'danger');
        return;
      }

      if (!/^\d{4}$/.test(pinCode)) {
        this.showToast('Invalid PIN format. Only numbers allowed', 'danger');
        return;
      }

      this.isLoading = true;
      try{
            const tokenId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            this.tokenId =  tokenId;
            const base64Image = await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = () => reject(new Error('Error reading profile picture'));
                fileReader.readAsDataURL(this.profileImage);
            });
            const userData = {
              name: this.name,
              mobile: this.mobile,
              standard: this.standard,
              city: this.city,
              zip: this.zipcode,
              email: this.email,
              pin: pinCode,
              profileImage: base64Image,
              isLogged: false,
              tokenId:  this.tokenId,
              isAdmin: false,
            }
            const response = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            const existingUsers = response.data ? this.formatPostData(response.data) : [];

            const userExists = existingUsers.some(user => user.mobile === userData.mobile);
            if (userExists) {
                this.showToast('User Already Exists', 'danger');
                this.isLoading = false;
            return;
            }
            await axios.post('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json', userData);
            this.showToast('User registered successfully!', 'success');
            let users = JSON.parse(localStorage.getItem('studentData')) || [];
            users.push(userData);
            localStorage.setItem('studentData', JSON.stringify(users));
            this.isLoading = false;
            this.$router.push('/login');
        } catch(error){
            const fallbackUserData = {
                name: this.name,
                city: this.city,
                zip: this.zipcode,
                mobile: this.mobile,
                pin: pinCode,
                isLogged: false,
                profileImage: this.profileImage ? await new Promise((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.onload = () => resolve(fileReader.result);
                    fileReader.onerror = () => reject(new Error('Error reading profile picture'));
                    fileReader.readAsDataURL(this.profileImage);
                }) : null,
                tokenId:  this.tokenId,
            };
            localStorage.setItem('studentData', JSON.stringify(fallbackUserData));
            this.isLoading = false;
            this.showToast('Firebase failed. User registered locally!', 'warning');
            this.$router.push('/');
        }
        finally {
            this.isLoading = false;
            this.resetForm();
        }
    },
    formatPostData(data){
      this.postData=[];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
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

.text-purple-700:hover {
  color: #5a2d82;
}
</style>
