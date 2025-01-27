<template>
    <div class="bg-gradient-to-br from-purple-500 via-purple-500 to-blue-500 min-h-screen text-gray-900">
        <!-- Navbar -->
        <nav class="navbar bg-white text-white sticky-top py-1 px-4 flex justify-between items-center bg-gradient-to-r from-purple-200 to-purple-300 shadow-lg">
            <router-link to="/" class="flex items-center space-x-2">
                <i class="fas fa-graduation-cap text-purple-700 text-2xl"></i>
                <h2 class="text-purple-700 text-xl font-bold tracking-wide">Learnify</h2>
            </router-link>
            <router-link v-if="!isLoggedIn" to="/signup" class="text-white font-bold text-sm bg-purple-500 py-1 px-2 rounded-lg hover:bg-purple-700">
                Join Now <i class="fa fa-arrow-right"></i>
            </router-link>
            <router-link v-if="isLoggedIn" to="/enrollNow" class="text-white text-sm font-bold bg-yellow-500 py-1 px-2 rounded-lg hover:bg-yellow-700">
                Enroll Now <i class="fas fa-rocket"></i>
            </router-link>
            <button @click="enableNotifications" >
                <i :class="['fas fa-bell text-lg', isNotificationEnabled ? 'text-green-500' : 'text-gray-700']"></i>
            </button>
        </nav>


            <!-- Carousel Section -->
        <section class="relative w-full h-48">
            <div class="absolute inset-0 w-full h-full bg-cover bg-center rounded-lg" 
                :style="{ backgroundImage: 'url(' + carouselImages[currentIndex] + ')' }">
                <div class="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white text-center p-4">
                    <h2 class="text-2xl font-bold">Unlock Your Potential</h2>
                    <p class="text-sm my-2">Explore courses, tests, and books to excel in your journey.</p>
                    <router-link v-if="isLoggedIn" to="/dashboard" class="bg-purple-500 py-1 px-4 rounded-full text-sm hover:bg-purple-600">
                        Explore Dashboard
                    </router-link>
                    <router-link v-else to="/login" class="bg-purple-500 py-1 px-4 rounded-full text-sm hover:bg-purple-600">
                        Get Started
                    </router-link>
                </div>
            </div>
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div  v-for="(image, index) in carouselImages"  :key="index" 
                 :class="{'bg-white': currentIndex === index, 'bg-gray-500': currentIndex !== index}"
                    class="w-3 h-3 rounded-full cursor-pointer" @click="goToSlide(index)">
                </div>
            </div>
        </section>

        <!-- Sections -->
        <section class="px-2 py-1 bg-gray-100">
            <div class="container mx-auto">
                <div class="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-6 mt-2">
                <!-- Services Section -->
                    <div v-for="(service, index) in services" 
                        :key="`service-${index}`" 
                        @click="navigateRouter(service.routeName)"
                        class="relative shadow rounded-lg cursor-pointer h-64">
                        <!-- Background Image Container -->
                        <div :style="{ backgroundImage: `url(${service.backgroundImage})` }" 
                        class="bg-cover bg-center bg-no-repeat h-48 rounded-t-lg w-full">
                        </div>
                        <!-- Title and Icon Section with Background -->
                        <div class="absolute top-0 left-0 w-full bg-gray-900 bg-opacity-80 py-2 text-center rounded-t-lg">
                            <i :class="service.icon" class="text-lg md:text-xl text-purple-400 mb-1"></i>
                            <h4 class="text-sm md:text-base font-semibold text-purple-600 mt-1">{{ service.title }}</h4>
                        </div>

                        <!-- Price Section -->
                        <!-- <div class="absolute bottom-14 left-1/2 transform -translate-x-1/2 text-center bg-gray-900 bg-opacity-80 px-6 py-1 rounded-lg">
                            <span class="text-white text-sm">₹ {{ service.price }}</span>
                        </div> -->
                        <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center bg-gray-900 bg-opacity-80 px-4 py-1 rounded-l-full rounded-r-full">
                            <div class="text-purple-500 text-sm flex flex-row">
                                <span class="text-xs mt-1 mr-1">₹</span>
                                <span class="text-base ">{{ service.price }}</span>
                            </div>
                        </div>

                        <!-- Bottom Section: Star Rating, Duration, and Students -->
                        <div class="bg-gray-300 rounded-b-lg px-2 md:px-5 py-2">
                            <div class="flex justify-center items-center space-x-1 my-1">
                                <i v-for="star in 5" :key="star" class="fa fa-star text-yellow-500 text-xs"></i>
                            </div>
                            <div class="flex border-t divide-x text-sm text-gray-600">
                                <div class="flex-1 text-center py-1">
                                    <i class="fa fa-clock text-purple-700 mr-1 md:mr-2"></i>{{ service.duration }}
                                </div>
                                <div class="flex-1 text-center py-1">
                                    <i class="fa fa-user text-purple-700 mr-1 md:mr-2"></i>{{ service.students }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- Ready to Start Section as Carousel -->

        <section class="relative w-full h-16 bg-gray-100 overflow-hidden rounded-lg">
            <div class="flex transition-transform duration-500 h-full" 
              :style="{ transform: 'translateX(-' + currentAdIndex * 100 + '%)' }">

                <div v-for="(ad, index) in advertisements" :key="index" 
                    class="w-full flex-shrink-0 h-full flex items-center justify-center text-center text-white bg-rose-700">
                    <h4 class="text-lg font-bold mr-2">{{ ad.message }}</h4>
                    <router-link to="/enrollNow" class="bg-yellow-400 py-1 px-2 rounded-lg text-sm font-bold hover:bg-yellow-500 transition duration-300">
                        Enroll Now
                    </router-link>
                </div>
            </div>
        </section>
        <!-- Bottom Navbar (Mobile Only) -->
        <nav class="fixed bottom-0 left-0 w-full bg-purple-700 shadow-lg md:hidden">
            <ul class="flex justify-between px-6 py-2">
                <li class="flex flex-col items-center">
                    <router-link to="/" class="text-white hover:text-purple-300">
                        <i class="fa fa-home text-lg"></i>
                        <!-- <span class="text-xs">Home</span> -->
                    </router-link>
                </li>
                <li class="flex flex-col items-center" v-if="isAdmin">
                    <router-link to="/admin" class="text-white hover:text-purple-300">
                        <i class="fa fa-user-shield text-lg"></i>
                    </router-link>
                </li>
                <li class="flex flex-col items-center">
                    <router-link to="/dashboard" class="text-white hover:text-purple-300">
                        <i class="fa fa-tachometer-alt text-lg"></i>
                        <!-- <span class="text-xs">Dashboard</span> -->
                    </router-link>
                </li>
                <li class="flex flex-col items-center">
                    <router-link to="/scholarshipCompetitions" class="text-white hover:text-purple-300">
                        <i class="fa fa-trophy text-lg"></i>
                    </router-link>
                </li>
                <li class="flex flex-col items-center">
                    <router-link  v-if="!isLoggedIn" to="/login" class="text-white hover:text-purple-300">
                        <i class="fa fa-user text-lg"></i>
                    </router-link>
                    <div v-if="isLoggedIn" class="relative"  @click.stop :title="userName">
                        <button 
                            @click="toggleProfileDropdown" 
                            class="flex items-center text-sm font-semibold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white py-1 px-2 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
                            <img :src="userImage || defaultProfileImage" alt="Profile" class="w-5 h-5 rounded-full mr-1">
                            <!-- <span>{{ userName }}</span> -->
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <ul 
                            v-if="showProfileDropdown && isLoggedIn" 
                            class="absolute right-0 mt-0 w-60 bg-white text-gray-900 rounded-lg shadow-lg" style="margin-top: -104px;">
                            <li 
                                @click="changeProfilePicture" 
                                class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <i class="fas fa-user-edit text-purple-500 mr-3"></i> Change Profile Picture
                            </li>
                            <li 
                                @click="logout" 
                                class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <i class="fas fa-sign-out-alt text-red-500 mr-3"></i> Logout
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>
        <transition name="dropdown">
                <div v-if="isUpdateModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div class="bg-white p-6 rounded-lg w-[90%] md:w-96">
                        <h2 class="text-xl font-bold mb-4 text-slate-600">Update User</h2>
                        <form @submit.prevent="submitUpdate">
                            <div class="mb-4">
                                <label for="userImage" class="block text-sm font-medium text-gray-700">Upload Profile Picture</label>
                                <input type="file" id="userImage" class="mt-1 block w-full border rounded-md shadow-sm focus:ring focus:ring-blue-500"  @change="previewImage"/>
                                <!-- <img v-if="previewedImage" :src="previewedImage" alt="Preview" class="mt-4 w-20 h-20 rounded-full border" /> -->
                            </div>
                            <div class="flex justify-end space-x-4">
                                <button type="button" @click="closeUpdateModal" class="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        <!-- Footer (only on desktop) -->
        <footer class="bg-gray-800 p-1 text-white text-center hidden md:block">
            <p>&copy; 2025 MySite. All rights reserved.</p>
        </footer>
    </div>
    <LoaderData v-if="isLoading" />
    <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
import LoaderData from '../components/LoaderData.vue';
import ToasterData from '../components/ToasterData.vue';
import userImage from '../assets/Home/userImage1.png';
import axios from 'axios';
import carousal1 from "../assets/Home/carousel-1.jpg";
import carousal2 from "../assets/Home/carousel-2.jpg";
import carousal3 from "../assets/Home/carousel-3.jpg";
import course1 from "../assets/Home/course-11.jpg";
import course2 from "../assets/Home/course-21.jpg";
import course3 from "../assets/Home/course-31.jpg";
import { requestNotificationPermission,listenForForegroundMessages } from "@/firebase/messaging";
import { saveTokenToLocalStorage } from "@/utils/notificationHelpers";
export default {
    components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
        isLoading: false,
        toastMessage: '',
        toastType: '',
        postData: [],
        userId: '',
        localStorageData: '',
        isLoggedIn : false,
        isAdmin: false,
        userName: 'User',
        previewedImage: null,
        userImage,
        currentIndex: 0,
        currentAdIndex: 0,
        showProfileDropdown: false,
        isUpdateModalOpen: false,
        carouselImages: [carousal1, carousal2, carousal3],
        services: [
            { 
                title: "Online Classes", 
                icon: "fa fa-globe", 
                price: "49/M", 
                routeName: "onlineClasses", 
                description: "Access learning material.",
                backgroundImage: course1, 
                duration: "45", students: 30
            },
            { 
                title: "Competitions", 
                icon: "fa fa-graduation-cap", 
                price: "5/Test", 
                routeName: "scholarshipCompetitions", 
                description: "Engage in real-world Competition.",
                backgroundImage: course2,
                duration: "20", students: 125
            },
            { 
                title: "Book Library", 
                icon: "fa fa-book-open", 
                price: "99/B", 
                routeName: "bookLibrary", 
                description: "Expand your knowledge.",
                backgroundImage: course3,
                duration: "150", students: 55 
            },
        ],
        advertisements: [
            // { message: "Sign Up and Get 50% Off!" },
            // { message: "Learn Anywhere, Anytime!" },
            // { message: "Achieve Your Goals Today!" },
            // { message: "Upcoming Test: 10/02/2025,5:00 PM!, Worth Prizes,Join Today!"},
            // { message: "Win Big:Test on 14/02/2025,7.00 PM!, Win Prizes!Enroll Now!"},
            // { message: "Test Alert!: 14/04/2025,8.00 PM!, Exciting Prize!,Join Now!"},
            // { message: "Test Your Skills: 02/05/2025,11.00 PM, Worth Prizes,Enroll Now!"},
            // { message: "Participate in Test: 05/06/2025,4:00 PM,Bumper Gifts!,Register Now!"},
            // { message: "Don’t Miss Out!: 25/01/2025,3:00 PM!, Win,Hurry,Limited Slots!"},
            // { message: "Gear for Game Changer!,Test on 18/07/2025,3:00 PM!,Hurry to Join!"},
            // { message: "The Countdown Begins!,Test on: 20/05/2025,12:00 PM!,Join Now"},
        ],
        advertisementsNew: [],
        isNotificationEnabled: false,
    };
  },
  created(){
    this.fetchAdvertisements();
  },
  mounted() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    }, 3000);
    setInterval(() => {
      this.currentAdIndex = (this.currentAdIndex + 1) % this.advertisements.length;
    }, 5000);
    this.isLoading = true;
    //this.fetchAdvertisements();
    document.addEventListener("click", this.closeDropdown);
    this.fetchData();
      setTimeout(() => {
        this.isLoading = false;
      }, 500); 

      if (localStorage.getItem("notificationsEnabled") === "true") {
             this.isNotificationEnabled = true;
    }

    // Listen for foreground messages
    // onMessage(messaging, (payload) => {
    //   console.log("Message received:", payload);
    //   this.showToast(`New Advertisement: ${payload.notification?.title}`,'info');
    // });
    listenForForegroundMessages((payload) => {
        this.showToast(`New Advertisement: ${payload.notification?.title}`,'info');
    });
    
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },
  methods: {
    async enableNotifications() {
    //   const token = await requestNotificationPermission();
    //   if (token) {
    //     saveTokenToLocalStorage(token);
    //     alert("Notifications enabled!");
   
    //   }

    try {
        if (this.isNotificationEnabled) {
            this.showToast("Notifications are already enabled!",'warning');
                 return;
        }

        // const token = await getToken(messaging, {
        //   vapidKey: "YOUR_PUBLIC_VAPID_KEY",
        // });
        const token = await requestNotificationPermission();

        if (token) {
          this.isNotificationEnabled = true;
          saveTokenToLocalStorage(token);
          localStorage.setItem("notificationsEnabled", "true");
          this.showToast("Notifications enabled successfully!",'success');
        } else {
            this.showToast("Failed to enable notifications.",'error');
            return
        }
      } catch (error) {
        console.error("Error enabling notifications:", error);
        this.showToast("Notification permission denied.",'error');
        return
      }
    },
    showToast(message, type) {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
            this.toastMessage = '';
        }, 3000);
    },
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
                    }

                    if(this.isLoggedIn){
                        this.userId = this.postData[i].id; 
                        this.userName = this.postData[i].name || 'User';
                        const response = await axios.get(`https://edutech-b196d-default-rtdb.firebaseio.com/studentData/${this.userId}.json`);
                      // console.log(response.data)
                        if (response.data && response.data.profileImage) {
                            this.userImage = response.data.profileImage;
                            this.isAdmin = response.data.isAdmin;
                        } else {
                            // console.log('No profile image found, using default image.');
                             this.userImage = '';
                        }
                    }
                }
            }
            }   
        }catch(err){
            // console.log("2222",err)
            console.warn(err);
        } 
    },
    async submitUpdate() {
        const responseNew = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            this.formatPostData(responseNew.data);
            this.localStorageData = JSON.parse(localStorage.getItem('studentData'));
            const base64Image = await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = () => reject(new Error('Error reading profile picture'));
                fileReader.readAsDataURL(this.previewedImage);
            });
            for(var i in this.localStorageData){
                for(var j in this.postData){
                    if(this.localStorageData[i].tokenId == this.postData[j].tokenId){
                        this.localStorageData[i].profileImage = base64Image;
                        this.userId = this.postData[i].id; 
                        const updatedData = JSON.stringify(this.localStorageData);
                        localStorage.setItem('studentData', updatedData);
                        this.userImage = base64Image;
                    }
                }   
            }
            
          const response =   await axios.patch(`https://edutech-b196d-default-rtdb.firebaseio.com/studentData/${this.userId}.json`,
            { profileImage: base64Image } );

            if (response.data && response.data.profileImage) {
                this.userImage = response.data.profileImage;
                this.showToast(`User ${response.data.name} updated successfully!`,'success');
            } else {
                //console.warn('No profile image found, using default image.');
                this.userImage = '';
            }
        this.closeUpdateModal();
    },
    async fetchAdvertisements() {
      try {
        const response = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/advertisementData.json');
        this.advertisementsNew = response.data;
        const messages = this.extractMessages(response.data);
        this.advertisements = messages;
      } catch (error) {
        console.warn(error);
      }
    },
    extractMessages(data) {
        return Object.values(data)
        .flatMap(item => Array.isArray(item) ? item : [item]) // Flatten nested arrays or single objects
        .map(entry =>  ({ message: entry.message })) // Extract the 'message' field
        .filter(Boolean); // Remove undefined or null values
    },
    formatPostData(data){
      this.postData = [];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
    navigateRouter(route){
        this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push(route);
      }, 500); 
    },
    changeProfilePicture() {
      this.showProfileDropdown = false;
      this.isUpdateModalOpen = true;
    },
    closeDropdown() {
      if (this.showProfileDropdown) {
        this.showProfileDropdown = false;
      }
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        //this.previewedImage1 = URL.createObjectURL(file);
        this.previewedImage = file;
      }
    },
    async logout() {
        this.isLoading = true;
        try {
            const responseNew = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            this.formatPostData(responseNew.data);
            this.localStorageData = JSON.parse(localStorage.getItem('studentData'));
            for(var i in this.localStorageData){
                for(var j in this.postData){
                    if(this.localStorageData[i].tokenId == this.postData[j].tokenId){
                        this.localStorageData[i].isLogged = false;
                        this.localStorageData[i].isAdmin = false;
                        this.userId = this.postData[i].id; 
                        this.userName = 'User';
                        const updatedData = JSON.stringify(this.localStorageData);
                        localStorage.setItem('studentData', updatedData);
                        this.isLoggedIn = false;
                        this.isAdmin = false;
                    }
                }   
            }
            const response =   await axios.patch(`https://edutech-b196d-default-rtdb.firebaseio.com/studentData/${this.userId}.json`,
                { isLogged: false });
              if (response.data) {
                  this.userImage = '';
                } else {
                  //console.warn('No profile image found, using default image.');
                  this.userImage = '';
                }
            this.isLoading = false;
            this.$router.push('/'); 
        } catch (error) {
           // console.error('Error logging out:', error);
            this.showToast('Logout failed. Please try again.', 'error');
        }
    },
  },
};
</script>

<style scoped>
.carousel-image {
  transition: all 0.5s ease;
}
</style>
