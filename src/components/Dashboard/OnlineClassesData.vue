<template>
    <div class="online-classes bg-gradient-to-r from-purple-200 to-purple-300 min-h-screen">
      <!-- Top Bar -->
      <div class="flex items-center justify-between bg-purple-100 shadow-lg py-2 px-4 sticky top-0 z-10">
        <button 
          @click="goBack" 
          class="flex items-center font-bold text-lg text-purple-600 hover:text-purple-700 transition-all">
          <i class="fas fa-arrow-left mr-2"></i> 
        </button>
        <h1 class="text-xl font-bold text-purple-700">Online Classes</h1>
        <i class="fas fa-video text-2xl text-blue-500"></i>
      </div>
  
      <!-- Main Content -->
      <div class="content mt-2">
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold text-indigo-800 flex items-center justify-center">
            <i class="fas fa-chalkboard-teacher text-indigo-600 mr-2 spin-icon"></i>
            Explore Online Learning
          </h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 mt-2">
          <div 
            v-for="(classItem, index) in classes" 
            :key="classItem.id" 
            class="class-card rounded-lg shadow-lg transform hover:scale-105 transition-all cursor-pointer relative"
            :style="{ background: gradients[index % gradients.length] }"
            @click="joinClass(classItem.id)"
          >
            <img :src="classItem.image" alt="Class Thumbnail" class="rounded-t-lg h-20 w-full object-contain">
            <div class="p-2 relative">
              <h5 class="text-base font-semibold text-white mb-1">{{ classItem.title }}</h5>
              <p class="text-xs text-white mb-1">{{ classItem.description }}</p>
              <button 
                v-if="classItem.locked"
                @click.stop="showToast('Unlock Premium to Access!', 'warning')"
                class="bg-gray-500 text-white py-1 px-2 text-sm rounded-lg cursor-not-allowed">
                <i class="fas fa-lock mr-2"></i> Enroll Now
              </button>
              <button 
                v-else 
                @click.stop="joinClass(classItem.id)"
                class="bg-purple-800 text-white py-1 px-2 text-sm rounded-lg hover:bg-purple-900 transition">
                <i class="fas fa-video mr-2"></i> Watch Video
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Advertisement Section -->
      <div class="ad-section bg-gradient-to-r from-yellow-400 via-orange-500 to-red-300 text-white py-2 px-4 mt-1 text-center rounded-lg flex flex-col items-center">
        <h4 class="text-lg font-bold mb-1 flex items-center justify-center">
            <i class="fas fa-gem mr-2 text-rose-800 spin-icon"></i> Upgrade to Premium <i class="fas fa-star text-teal-800 ml-2 spin-icon"></i>
        </h4>
        <p class="text-sm mb-2">Unlock exclusive content, live sessions, and more!</p>
        <router-link 
       to="/signup" v-if="!isLoggedIn" class="bg-white text-orange-500 font-bold py-1 px-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-110">
       <i class="fas fa-star mr-2 text-base"></i>Join Now
      </router-link>
      <router-link v-if="isLoggedIn" to="/enrollNow" class="text-white font-bold text-base bg-purple-700 py-1 px-2 rounded-lg hover:bg-purple-800 transition-all transform hover:scale-110">
        <i class="fas fa-rocket mr-2 text-base"></i>  Enroll Now 
      </router-link>
        <!-- <button class="bg-white text-base text-orange-600 py-2 px-4 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center">
            <i class="fas fa-star mr-2 text-base"></i> Enroll Now
        </button> -->
        </div>
    </div>
    <LoaderData v-if="isLoading" />
    <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </template>
  
  <script>
  import axios from 'axios';
  import LoaderData from '../../components/LoaderData.vue';
  import ToasterData from '../../components/ToasterData.vue';
  import sampleImage from '../../assets/Dashboard/sampleVideoImage.jpg';
  import sampleImage1 from '../../assets/Dashboard/sample1Image.jpg';
  import sampleImage2 from '../../assets/Dashboard/sample5Image.jpg';
  import sampleImage3 from '../../assets/Dashboard/sample8Image.png';
  
  export default {
    name: "OnlineClassesData",
    components: {
    LoaderData,
    ToasterData
  },
    data() {
      return {
        isPremium: false, // Variable to toggle locked/unlocked state
        classes: [
          {
            id: 1,
            title: "Sample Videos",
            description: "Learn the basic of all in One Patterns.",
            image: sampleImage,
            locked: false, // Always unlocked
          },
          {
            id: 2,
            title: "Level 1 Videos",
            description: "It consists of class 1 to class 4 Videos.",
            image: sampleImage1,
            locked: true, // Initially locked
          },
          {
            id: 3,
            title: "Level 2 Videos",
            description: "It consists of class 5 to class 7 Videos.",
            image: sampleImage2,
            locked: true, // Initially locked
          },
          {
            id: 4,
            title: "Level 3 Videos",
            description: "It consists of class 8 to class 10 Videos.",
            image: sampleImage3,
            locked: true, // Initially locked
          }
        ],
        gradients: [
          "linear-gradient(135deg, #6a11cb, #2575fc)",
          "linear-gradient(135deg, #ff6a00, #ee0979)",
          "linear-gradient(135deg, #02aab0, #00cdac)",
          "linear-gradient(135deg, #f7971e, #ffd200)"
        ],
        toastMessage: '',
        toastType: '',
        isLoading: false,
        isLoggedIn : false,
        postData:[],
        localStorageData:[],
        userData: '',
      };
    },
    mounted() {
      this.isLoading = true;
      this.fetchData();
      setTimeout(() => {
        this.isLoading = false;
      }, 500); 
      // Simulate a premium user for demo purposes
      // this.isPremium = true; // Set this to `false` to lock non-sample videos
  
      // Update lock status based on premium state
      this.classes.forEach((classItem) => {
        if (classItem.id !== 1) {
          classItem.locked = !this.isPremium;
        }
      });
    },
    methods: {
      async fetchData(){
        try {
            const responseNew = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            this.formatPostData(responseNew.data);
            this.localStorageData = JSON.parse(localStorage.getItem('studentData')) || [];

            if(this.localStorageData.length > 0)
            {
              for(var i in this.postData){
                for(var j in this.localStorageData){
                    if(this.postData[i].tokenId == this.localStorageData[j].tokenId){
                        this.isLoggedIn =  this.localStorageData[j].isLogged;
                        
                        // this.isPremium =  this.localStorageData[j].isPremium;
                    }

                    if(this.isLoggedIn){
                      this.userData = this.localStorageData[j];
                        // console.log("userData",this.userData);
                      // if(this.isPremium){
                      //   this.premium = true;
                      // }
                    }
                }
            }
            }   
        }catch(err){
            // console.log("2222",err)
            console.warn(err);
        } 
    },
    formatPostData(data){
      this.postData = [];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
      goBack() {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push("/dashboard");
        }, 500);   
      },
      joinClass(id) {
        console.log(`You joined class with ID: ${id}`);
        const selectedClass = this.classes.find((classItem) => classItem.id === id);
        if (!selectedClass.locked) {
            this.isLoading = true;
            setTimeout(() => {
              this.isLoading = false;
              this.$router.push({
                path: "/watchVideo",
                query: { category: selectedClass.title.toLowerCase().replace(/ /g, '') },
              });
            }, 500);
          } else {
            this.showToast("Unlock Premium to Access!", "warning");
          } 
      },
      showToast(message, type) {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
          this.toastMessage = '';
        }, 3000);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Card Hover Effects */
  .class-card img {
    transition: transform 0.3s ease-in-out;
  }
  .class-card:hover img {
    transform: scale(1.05);
  }
  .class-card {
    overflow: hidden;
    position: relative;
    color: white;
  }
  .class-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  .class-card div {
    position: relative;
    z-index: 2;
  }
  
  /* Advertisement Section */
  .ad-section button:hover {
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
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
  </style>
  