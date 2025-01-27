<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between bg-purple-200 shadow-lg py-2 px-2 sticky top-0 z-10">
      <button
        @click="goHome"
        class="flex items-center font-bold text-lg text-purple-600 hover:text-purple-700 transition-all">
        <i class="fas fa-home mr-2"></i>
      </button>
      <div class="flex items-center">
        <i class="fas fa-graduation-cap text-2xl text-purple-600 animate-spin mr-2"></i>
        <h1 class="text-xl font-bold text-purple-800">Enrollment Form</h1>
      </div>
      <!-- <h1 class="text-xl font-bold text-purple-700">Enrollment Form</h1> -->
    </div>
    <!-- Form Section -->
    <div class="px-4 py-2">
      <form
        @submit.prevent="submitForm"
        class="bg-white rounded-lg shadow-xl px-8 py-6 max-w-3xl mx-auto mt-2 animate__animated animate__fadeIn">
        <!-- Name Field -->
        <div class="mb-3 relative">
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Enter your full name"
            class="w-full border border-gray-300 px-3 py-2 pl-12 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <i class="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600"></i>
        </div>

        <!-- Mobile Number Field -->
        <div class="mb-3 relative">
          <input
            id="mobile"
            v-model="formData.mobile"
            type="tel"
            placeholder="Enter your mobile number"
            class="w-full border border-gray-300 px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <i class="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600"></i>
        </div>

        <!-- Email Field -->
        <div class="mb-3 relative">
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Enter your email address"
            class="w-full border border-gray-300 px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <i class="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600"></i>
        </div>

        <!-- Class Dropdown -->
        <div class="mb-3 relative">
          <select
            id="class"
            v-model="formData.class"
            class="w-full border border-gray-300 px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          >
            <option value="" disabled selected>Select your standard</option>
            <option v-for="i in 10" :key="i" :value="i">Class {{ i }}</option>
          </select>
          <i class="fas fa-graduation-cap absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600"></i>
        </div>

        <!-- City Field -->
        <div class="mb-3 relative">
          <input
            id="city"
            v-model="formData.city"
            type="text"
            placeholder="Enter your city"
            class="w-full border border-gray-300 px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <i class="fas fa-city absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600"></i>
        </div>

        <!-- Pincode Field -->
        <div class="mb-3 relative">
          <input
            id="pincode"
            v-model="formData.pincode"
            type="text"
            placeholder="Enter your area pincode"
            class="w-full border border-gray-300 px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <i class="fas fa-location-dot absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600"></i>
        </div>

        <!-- Payment Options -->
        <div class="mb-6">
          <label class="block text-lg font-semibold mb-2 tex-gray-600">
            <i class="fas fa-credit-card mr-2 text-purple-700"></i> Payment Options
          </label>
          <div class="flex items-center gap-6">
            <label v-for="option in paymentOptions" :key="option.value" class="flex items-center gap-2">
              <input
                type="radio"
                :value="option.value"
                 @click="initiateUPIPayment(option.value)"
              />
              <i :class="option.icon" class="text-blue-700 text-2xl"></i> {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-1 rounded-lg font-bold text-lg hover:shadow-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
          <i class="fas fa-spinner animate-spin" v-if="loading"></i>
          <i class="fa fa-graduation-cap"></i>
          <span v-if="!loading">Submit</span>
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
  components: {
    LoaderData,
    ToasterData,
  },
  data() {
    return {
      formData: {
        name: "",
        mobile: "",
        email: "",
        class: "",
        city: "",
        pincode: "",
        paymentOption: "",
      },
      paymentOptions: [
        { value: "GPay", label: "GPay", icon: "fab fa-google-pay" },
        // { value: "PhonePe", label: "PhonePe", icon: "fas fa-phone" },
        { value: "Paytm", label: "Paytm", icon: "fab fa-amazon-pay" },
      ],
      loading: false,
      toastMessage: '',
        toastType: '',
        isLoading: false,
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
    async submitForm() {
     // || !this.formData.paymentOption
      // if (!this. formData.name || !this.formData.mobile || !this.formData.class || !this.formData.city || !this.formData.pincode || !this.formData.email ) {
      //   this.showToast('Please fill out the form', 'danger');
      //   return;
      // }
      const tokenId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.tokenId =  tokenId;
      console.log("2222",this.tokenId)
      this.isLoading = true;
      this.loading = true;
      const newUserData = {
              name: this.formData.name,
              mobile: this.formData.mobile,
              class: this.formData.class,
              city: this.formData.city,
              pincode: this.formData.pincode,
              email: this.formData.email,
              paymentOption: this.formData.paymentOption,
              id:this.tokenId,
            }
      try{
        await axios.post('https://edutech-b196d-default-rtdb.firebaseio.com/newUserData.json', newUserData);
        this.showToast('Enrollment successful! Thank you.', 'success');
            let users = JSON.parse(localStorage.getItem('newUserData')) || [];
            users.push(newUserData);
            localStorage.setItem('newUserData', JSON.stringify(users));
            this.isLoading = false;
            this.loading = false;
            this.resetForm();
            // this.$router.push('/login');
      } catch(error){
        console.warn(error);
        this.isLoading = false;
        this.loading = false;
        this.resetForm();
        }
    },
    initiateUPIPayment(app) {
    // Replace with your actual merchant details
    const upiDetails = {
      pa: 'merchant@upi',  
      appName: app,     // Payee UPI ID
      pn: 'MerchantName',       // Payee Name
      tid: 'Txn123456',         // Transaction ID
      tr: 'Order123',           // Transaction Reference ID
      tn: 'Payment for Order',  // Transaction Description
      am: '5',                // Amount
      cu: 'INR',                // Currency
    };

    // Construct UPI URI
    const upiUri = `upi://pay?pa=${upiDetails.pa}&pn=${upiDetails.pn}&tid=${upiDetails.tid}&tr=${upiDetails.tr}&tn=${upiDetails.tn}&am=${upiDetails.am}&cu=${upiDetails.cu}`;

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = upiUri; // Redirect to UPI app
    } else {
     // this.showToast('UPI payments are only supported on mobile devices with UPI apps installed.','danger')
     alert("UPI payments are only supported on mobile devices with UPI apps installed.");
    }
  },
    resetForm() {
        this.formData = {
          name: "",
          mobile: "",
          email: "",
          class: "",
          city: "",
          pincode: "",
          paymentOption: "",
        };
    },
    goHome() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/');
      }, 500);
    },
  //   async requestNotificationPermission() {
  //   try {
  //     const token = await messaging.getToken({
  //       vapidKey: "BOux5b-A33GBaCHi_GPbllmZCcxVIsuJ6_b0sE0XPZgfeuuFl5yZCK4QbvDlxTcx0zColvozc1o-XgMsH9vlSto",
  //     });
  //     console.log("FCM Token:", token);
  //     // Store this token on your server for sending notifications
  //   } catch (error) {
  //     console.error("Unable to get permission for notifications:", error);
  //   }
  // },
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
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
body {
  font-family: Arial, sans-serif;
}
</style>
