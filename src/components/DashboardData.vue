<template>
  <div class="dashboard bg-gradient-to-r from-purple-300 to-purple-400 min-h-screen">
    <!-- Top Navigation Bar -->
    <div class="flex items-center justify-between bg-purple-100 shadow-lg py-2 px-4 sticky top-0 z-10">
      <button
        @click="goHome"
        class="flex items-center font-bold text-lg text-purple-600 hover:text-purple-700 transition-all">
        <i class="fas fa-arrow-left mr-2"></i>
      </button>
      <h3 class="text-sm md:text-lg font-medium text-blue-500 ml-12">Hello, {{ username }}!<span class="text-yellow-300 bounce ml-1">&#128075;</span></h3>
      <h1 class="text-lg font-bold text-rose-700">Dashboard</h1>
    </div>

    <!-- Dashboard Content -->
    <div class="px-6 py-3">
      <div class="text-center mb-2">
        <h1 class="text-xl font-bold text-gray-800">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-800">
            <i class="fas fa-compass spin-icon-explore mr-2 "></i> Explore Your Categories
            <!-- <i class="fas fa-compass spin-icon-explore mr-2"></i> Explore Your Categories -->
          </span>
        </h1>
        <!-- <p class="text-gray-600 text-sm mt-1">
          Discover resources, competitions all in a single place.
        </p> -->
        <p class="text-gray-600 text-sm mt-1">
          Discover all resources in a single place.
        </p> 
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="item in categories"
          :key="item.name"
          class="category-card group relative overflow-hidden bg-white shadow-lg rounded-3xl px-6 py-2 transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer"
          @click="navigateTo(item.route)"
        >
          <div
            class="absolute inset-0 opacity-20"
            :style="{ background: item.gradient }"
          ></div>
          <div class="relative z-10 flex flex-col items-center text-center">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center mb-1 text-2xl"
              :style="{ background: item.iconBackground, color: item.iconColor }">
              <i :class="item.icon"></i>
            </div>
            <h2 class="text-lg font-bold text-gray-800">{{ item.name }}</h2>
            <p class="text-gray-600 text-sm">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Advertisement Section -->
    <div class="ad-section bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-2 px-2 mt-2 text-center">
      <h4 class="text-base font-extrabold mb-1">
         <span class="spin-icon mr-2"> 🎉 </span> Unlock Premium Features! <i class="fas fa-star spin-icon-premium ml-2"></i>
      </h4>
      <p class="text-sm mb-2">
        Upgrade now to get unlimited access to resources.
      </p>
      <router-link 
       to="/signup" v-if="!isLoggedIn" class="bg-white text-base text-orange-500 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-all transform hover:scale-110">
        Join Now
      </router-link>
      <router-link v-if="isLoggedIn" to="/enrollNow" class="text-white text-base bg-purple-700 font-bold  py-2 px-4 rounded-lg hover:bg-purple-800 transition-all transform hover:scale-110">
          Enroll Now <i class="fas fa-rocket"></i>
      </router-link>
    </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
import LoaderData from '../components/LoaderData.vue';
import ToasterData from '../components/ToasterData.vue';
import axios from 'axios';
export default {
  name: "DashboardData",
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
      categories: [
        {
          name: "Online Classes",
          description: "Access live and recorded classes.",
          route: "/onlineClasses",
          gradient: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
          icon: "fas fa-chalkboard-teacher",
          iconColor: "#ffffff",
          iconBackground: "#ff6f61",
        },
        {
          name: "Scholarship Competitions",
          description: "Compete for amazing scholarships.",
          route: "/scholarshipCompetitions",
          gradient: "linear-gradient(135deg, #42a5f5, #478ed1)",
          icon: "fas fa-trophy",
          iconColor: "#ffffff",
          iconBackground: "#ab47bc",
        },
        {
          name: "Book Library",
          description: "Dive into our vast collection of books.",
          route: "/bookLibrary",
          gradient: "linear-gradient(135deg, #66bb6a, #43a047)",
          icon: "fas fa-book",
          iconColor: "#ffffff",
          iconBackground: "#26a69a",
        },
      ],
      isLoading: false,
      toastMessage: '',
      toastType: '',
      isLoggedIn : true,
      username: "User",
      postData: [],
      localStorageData: [],
      isLoggedInToShowUserName: false,
    };
  },
  created(){
    this.fetchUserData();
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
    navigateTo(route) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push(route);
      }, 500); 
    },
    async fetchUserData() {
      try {
            const responseNew = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            this.formatPostData(responseNew.data);
            this.localStorageData = JSON.parse(localStorage.getItem('studentData')) || [];

            if(this.localStorageData.length > 0)
            {
              for(var i in this.postData){
                for(var j in this.localStorageData){
                    if(this.postData[i].tokenId == this.localStorageData[j].tokenId){
                        this.isLoggedInToShowUserName =  this.localStorageData[j].isLogged;
                    }

                    if(this.isLoggedInToShowUserName){ 
                        // this.username = this.postData[i].name || 'User';
                       this.username = this.postData[i].name ? this.capitalizeText(this.truncateText(this.postData[i].name, 10)) : 'User';
                        console.log(this.username)
                    }
                }
            }
            }   
        }catch(err){
            // console.log("2222",err)
            console.warn(err);
        } 
    },
    truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  },
  capitalizeText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
    formatPostData(data){
      this.postData = [];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    goHome(){
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/');
      }, 500); 
    },
  },
};
</script>

<style scoped>
/* Grid for cards */
.category-card:hover .group {
  transform: scale(1.05);
}

/* Advertisement Section Styling */
.ad-section h4 {
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.spin-icon {
  display: inline-block;
  animation: spin 2s linear infinite;
}

.spin-icon-premium {
  display: inline-block;
  animation: spin 2s ease-in-out infinite;
  color: #ffeb3b; /* Premium gold color */
}

.spin-icon-explore{
  display: inline-block;
  animation: spin 2s ease-in-out infinite;
  color: #5447e6
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

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.bounce {
  display: inline-block;
  animation: bounce 1s infinite;
}
</style>
