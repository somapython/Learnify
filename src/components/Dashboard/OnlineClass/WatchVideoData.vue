<template>
  <div class="watch-video g-gradient-to-r from-purple-300 to-purple-400 min-h-screen py-2 px-4">
    <!-- Top Bar -->
    <div class="w-full bg-purple-100 py-1 px-2 fixed top-0 z-10 flex items-center justify-between overflow-x-auto">
      <button 
        @click="goBack" 
        class="flex items-center text-gray-700 font-bold text-lg text-purple-600 hover:text-purple-700 transition-all">
        <i class="fas fa-arrow-left mr-2"></i> 
      </button>
      <h3 class="text-sm md:text-lg font-medium text-blue-500 mr-10">Hello, {{ username }}!<span class="text-yellow-300 bounce ml-1">&#128075;</span></h3>
    </div>

    <!-- Video Player Section -->
    <div class="video-container w-full md:w-3/4 lg:w-2/3 bg-black rounded-lg shadow-md overflow-hidden mt-10 relative">
      <!-- Poster Section -->
      <div
        v-if="!isPlaying"
        class="poster-container w-full h-52 md:h-96 flex items-center justify-center relative"
      >
        <img
          :src="videoData.poster"
          alt="Course Poster"
          class="w-full h-full object-cover cursor-pointer rounded-lg"
          @click="startPlaying"
        />
        <button
          class="absolute inset-0 m-auto w-16 h-16 bg-purple-700 text-white rounded-full flex items-center justify-center text-3xl hover:bg-purple-800 transition-all"
          @click="startPlaying"
        >
          <i class="fas fa-play"></i>
        </button>
      </div>

      <!-- Video Player -->
      <video
        v-else
        controls
        autoplay
        class="w-full h-52 md:h-96 rounded-lg"
        ref="videoPlayer"
        :src="currentLesson.src"
        @loadeddata="isLoading = false"
      ></video>

      <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
    <!-- Top-right Logo -->
    <div class="absolute top-2 right-2 bg-opacity-20 pointer-events-auto">
      <img
        src="../../../assets/logo1.png"
        alt="Logo"
        class="w-8 h-8 object-contain"
      />
    </div>

    <!-- Bottom Advertisement Section -->
    <div class="absolute bottom-2 left-0 w-full bg-gray-800 bg-opacity-10 text-black font-semibold text-center py-2 px-4 text-sm md:text-base pointer-events-auto">
      <marquee behavior="scroll" direction="left">
        🌟 Learn English Grammar! Sign up or Enroll now for advanced lessons. 🌟
      </marquee>
    </div>
  </div>
    </div>

    <!-- Video Details Section -->
    <div class="details w-full md:w-3/4 lg:w-2/3 bg-gray-100 rounded-lg shadow-md px-4 py-2 mt-4">
      <h1 class="text-lg font-bold text-gray-800 mb-2">{{ videoData.title }}</h1>
      <div class="flex items-center">
        <div class="flex items-center text-gray-600 text-sm mb-1 mr-4">
          <i class="fas fa-star text-yellow-500 mr-1"></i> 4.2 Ratings
        </div>
        <p class="text-gray-600 text-sm mb-1">
          <i class="fas fa-user-circle text-purple-700 mr-1"></i> Created by {{ videoData.creator }}
        </p>
      </div>
      <div class="flex items-center">
        <p class="text-gray-600 text-sm mb-1 mr-4">
          <i class="fas fa-clock text-purple-700 mr-1"></i> {{ videoData.duration }}
        </p>
        <p class="text-gray-600 text-sm mb-1">
          <i class="fas fa-list text-purple-700 mr-1"></i> {{ videoData.lessons.length }} Lessons
        </p>
      </div>
      <p class="text-gray-700 text-sm mb-2">{{ videoData.description }}</p>

      <!-- Lessons Section -->
      <div class="lesson-list">
        <h2 class="text-lg font-bold text-gray-800 mb-1">Lessons</h2>
        <div
          v-for="(lesson, index) in displayedLessons"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-1 cursor-pointer hover:bg-gray-200"
          @click="playLesson(index)"
        >
          <div>
            <i
              :class="[ 
                'fas', 
                currentLessonIndex === index ? 'fa-pause-circle text-green-500' : 'fa-play-circle text-gray-500'
              ]"
              class="mr-2"
            ></i>
            {{ lesson.title }}
          </div>
          <span class="text-sm text-gray-500">{{ lesson.duration }}</span>
        </div>
        <button 
          v-if="!allLessonsLoaded" 
          class="bg-purple-700 text-white py-1 px-4 rounded-lg hover:bg-purple-800 focus:outline-none w-full mt-1"
          @click="loadMoreLessons"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// import sampleVideos1 from '../../../components/Dashboard/OnlineClass/sample1.mp4';
import sampleVideos1 from '../../../components/Dashboard/OnlineClass/Nouns_And_Pronoun.mp4';
import sampleVideos2 from '../../../components/Dashboard/OnlineClass/Articles.mp4';
import sampleVideos3 from '../../../components/Dashboard/OnlineClass/Adjectives.mp4';
import sampleVideos4 from '../../../components/Dashboard/OnlineClass/Adverbs.mp4';
import sampleVideos5 from '../../../components/Dashboard/OnlineClass/Connectors.mp4';
import samplePoster from '../../../assets/Dashboard/samplePoster.jpg';
export default {
  name: "WatchVideo",
  data() {
    return {
      videoData: {
        title: "English Course",
        description: "Learn English Grammers, vocabulary and all related things in this comprehensive course.",
        creator: "Parth P",
        duration: "1h 18min",
        lessons: [
          { title: "Lesson 1: Nouns & Pro", duration: "10 min", src: sampleVideos1 },
          { title: "Lesson 2: Articles", duration: "17 min", src: sampleVideos2 },
          { title: "Lesson 3: Adjectives", duration: "15 min", src: sampleVideos3 },
          { title: "Lesson 4: Adverbs", duration: "19 min", src: sampleVideos4 },
          { title: "Lesson 5: Connectors", duration: "18 min", src: sampleVideos5 },
        ],
        poster: samplePoster,
      },
      currentLessonIndex: 0,
      displayedLessonsCount: 2,
      isPlaying: false, // Tracks if the video player is active
      isLoading: false, // Tracks loading state
      username: "User",
      postData: [],
      localStorageData: [],
      isLoggedInToShowUserName: false,
    };
  },
  computed: {
    currentLesson() {
      return this.videoData.lessons[this.currentLessonIndex];
    },
    displayedLessons() {
      return this.videoData.lessons.slice(0, this.displayedLessonsCount);
    },
    allLessonsLoaded() {
      return this.displayedLessonsCount >= this.videoData.lessons.length;
    },
  },
  created() {
    this.loadVideoData();
    this.fetchUserData();
  },
  methods: {
    loadVideoData() {
      const category = this.$route.query.category;

      // Load data based on category
      switch (category) {
        case "samplevideos":
          this.videoData = {
            title: "English Course",
            description: "Learn English Grammers, vocabulary and all related things in this comprehensive course.",
            creator: "Parth P",
            duration: "1h 18min",
            poster: samplePoster,
            lessons: [
                { title: "Lesson 1: Nouns & Pro", duration: "10 min", src: sampleVideos1 },
                { title: "Lesson 2: Articles", duration: "17 min", src: sampleVideos2 },
                { title: "Lesson 3: Adjectives", duration: "15 min", src: sampleVideos3 },
                { title: "Lesson 4: Adverbs", duration: "19 min", src: sampleVideos4 },
                { title: "Lesson 5: Connectors", duration: "18 min", src: sampleVideos5 },
            ],
          };
          break;
        case "level1videos":
          this.videoData = {
            title: "Level 1 Videos",
            description: "It consists of class 1 to class 4 Videos.",
            creator: "Admin",
            duration: "5h 30min",
            poster: "samplePoster1",
            lessons: [
              { title: "Lesson 1: Topic A", duration: "30 min", src: "level1-1.mp4" },
              { title: "Lesson 2: Topic B", duration: "20 min", src: "level1-2.mp4" },
            ],
          };
          break;
        case "level2videos":
          this.videoData = {
            title: "Level 2 Videos",
            description: "It consists of class 5 to class 7 Videos.",
            creator: "Admin",
            duration: "6h 20min",
            poster: "samplePoster2",
            lessons: [
              { title: "Lesson 1: Advanced Topic A", duration: "40 min", src: "level2-1.mp4" },
              { title: "Lesson 2: Advanced Topic B", duration: "35 min", src: "level2-2.mp4" },
            ],
          };
          break;
        case "level3videos":
          this.videoData = {
            title: "Level 3 Videos",
            description: "It consists of class 8 to class 10 Videos.",
            creator: "Admin",
            duration: "7h 45min",
            poster: "samplePoster3",
            lessons: [
              { title: "Lesson 1: Expert Topic A", duration: "50 min", src: "level3-1.mp4" },
              { title: "Lesson 2: Expert Topic B", duration: "45 min", src: "level3-2.mp4" },
            ],
          };
          break;
        default:
          console.warn("Unknown category");
          this.$router.push("/dashboard");
      }
    },
    playLesson(index) {
        const videoPlayer = this.$refs.videoPlayer;

        // Pause the current video and reset the src
        if (videoPlayer) {
          videoPlayer.pause();
          videoPlayer.src = ""; // Clear the current src to avoid conflicts
        }

        // Update the current lesson index and assign the new src
        this.currentLessonIndex = index;
        this.isPlaying = true;

          // Wait for the new video to load before playing
          this.$nextTick(() => {
            if (videoPlayer) {
              videoPlayer.src = this.videoData.lessons[index].src;
              videoPlayer.load(); // Load the new video

              // Play the video once it's ready
              videoPlayer.addEventListener(
                "canplay",
                () => {
                  videoPlayer.play();
                },
                { once: true }
              );
            } else {
              console.error("Video player is not available.");
            }
          });

    },
    loadMoreLessons() {
      this.displayedLessonsCount += 2;
    },
    startPlaying() {
      this.isPlaying = true;
      this.$nextTick(() => {
      this.playLesson(0); // Ensure DOM updates before accessing refs
    });
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
                       this.username = this.postData[i].name ? this.capitalizeText(this.truncateText(this.postData[i].name, 12)) : 'User';
                        // console.log(this.username)
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
    goBack() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push("/dashboard");
      }, 500);
    },
  },
};
</script>

<style scoped>
.video-container {
  position: relative;
}
.video-container video,
.video-container .poster-container {
  width: 100%;
  /* height: 100%; */
}
.poster-container img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: 0.5rem;
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
