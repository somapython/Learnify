<template>
  <div class="min-h-screen bg-gradient-to-r from-purple-300 to-purple-400 px-6 py-2">
    <!-- Top Navigation Bar -->
    <div class="flex items-center justify-between bg-purple-100 shadow-lg py-1 px-4 sticky top-0 ">
      <button
        @click="goHome"
        class="flex items-center font-bold text-lg text-purple-600 hover:text-purple-700 transition-all">
        <i class="fas fa-arrow-left mr-2"></i>
      </button>
      <h1 class="text-lg font-bold text-purple-700">Admin Panel</h1>
    </div>

    <!-- Tabs Navigation -->
    <div class="mb-2 mt-2">
      <button v-for="tab in tabs" :key="tab"  @click="handleTabClick(tab)"
              :class="['px-2 py-2 rounded-lg mr-2 mt-2', activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-300']">
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'Advertisements'" class="mt-0">
      <h3 class="text-2xl text-red-600 font-semibold mb-0"><i class="fas fa-ad fa-spin text-rose-900 mr-2"></i>Add Advertisement</h3>
      <form @submit.prevent="addAdvertisement" class="flex flex-col gap-2 mt-0">
        <select v-model="newAd.offer" class="w-full bg-gray-100 outline-none p-2 rounded-md mt-0" required>
          <option value="" disabled selected>Select your Offer</option>
          <option v-for="option in offer" :key="option.value">{{ option.text }}</option>
        </select>
        <input ref="datePicker" class="border px-2 py-1 rounded-md" placeholder="Pick a date and time" readonly required/>
        <select v-model="newAd.prize" class="w-full bg-gray-100 outline-none p-2 rounded-md" required>
          <option value="" disabled selected>Select your prize</option>
          <option v-for="option in offer" :key="option.value">{{ option.prize }}</option>
        </select>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Advertisement
        </button>
      </form>

      <!-- Advertisement Display -->
      <div v-if="currentMessage != ''" class="mt-4" >
        <div class="bg-white px-2 py-1 rounded-md">
          <!-- <p class="text-lg font-semibold text-purple-700">{{ ad.offer }}</p>
          <p class="text-gray-600">{{ ad.date }}</p>
          <p class="text-gray-800">{{ ad.prize }}</p> -->
          <p class="text-gray-600">{{ currentMessage }}</p>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Quizzes'" >
        <div class="flex flex-row items-center justify-between mb-1">
            <!-- <h2 class="text-lg font-semibold">Exam Details</h2> -->
            <h2 class="text-lg font-semibold flex items-center">
                <i class="fas fa-file-alt text-purple-700 mr-4 fa-ad"></i> Exam Details
          </h2>
            <button @click="createExam" class="bg-purple-700 text-white px-2 py-1 rounded text-base flex items-center" >
                <i class="fas fa-plus mr-1 "></i> Create Exam
            </button>
        </div>
        <table class="table-auto w-full border-collapse border border-2 border-gray-300 rounded-lg mt-2">
            <thead>
                <tr class="bg-gray-100">
                <th class="border border-gray-300 px-2 py-1">No.</th>
                <th class="border border-gray-300 px-2 py-1">Exam Title</th>
                <th class="border border-gray-300 px-2 py-1">Actions</th>
                </tr>
            </thead>
            <tbody>
              <!-- border border-gray-300 -->
                <tr v-for="(exam, index) in paginatedExamData" :key="exam.id">
                    <td class="px-4 py-2">{{ index + 1 }}</td>
                    <td class="px-4 py-2">{{ exam.examName }}</td>
                    <td class="px-4 py-2 flex flex-row items-center">
                        <button @click="viewExam(exam)" class="bg-blue-600 text-white px-2 py-1 rounded-full text-sm mr-1">
                            <i class="fas fa-eye text-white"></i>
                        </button>
                        <button @click="editExam(exam)" class="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm mr-1">
                            <i class="fas fa-edit text-white"></i>
                        </button>
                        <button @click="deleteExam(exam.id)" class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                            <i class="fas fa-trash text-white "></i>
                        </button>
                    </td>
                </tr>
                <tr v-if="paginatedExamData.length === 0">
                    <td colspan="3" class="text-center py-32 text-gray-500"><i class="fas fa-info-circle text-white-500 mr-2"></i>No Exams found.</td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="flex justify-between mt-2" v-if="paginatedExamData.length != 0">
            <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-300 px-2 py-1 rounded disabled:opacity-50" >
                Previous
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-300 px-2 py-1 rounded disabled:opacity-50" >
                Next
            </button>
        </div>

            <!-- Create/Edit Modal -->
        <div v-if="showCreateEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-[90%]">
                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-1 mb-2">
                    <div class="flex items-center">
                        <span v-if="isEditing" class="text-blue-500 text-xl">
                            <i class="fas fa-edit fa-ad mr-1"></i> Edit Exam
                        </span>
                        <span v-else class="text-green-500 text-xl">
                            <i class="fas fa-plus-circle fa-ad mr-1"></i> Create Exam
                        </span>
                    </div>
                    <button @click="closeCreateEditModal" class="text-gray-600 hover:text-gray-800">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form @submit.prevent="saveExam">
                    <div class="mb-3">
                        <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <i class="fa fa-book text-purple-600 mr-2"></i>
                            <input type="text" v-model="form.examName" placeholder="Exam Name"
                            class="w-full bg-transparent outline-none" required />
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <i class="fa fa-layer-group text-purple-600 mr-2"></i>
                            <select v-model="form.level" class="w-full bg-gray-100 outline-none px-3 py-2 rounded-lg " required>
                                <option value="" disabled selected>Select level</option>
                                <option v-for="option in levels" :key="option.value">Level {{ option.levelNo }}</option>
                            </select>
                        </div> 
                    </div>
                    <div class="mb-3">
                        <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <i class="fa fa-calendar-alt text-purple-600 mr-2"></i>
                            <input type="text" ref="startTimePicker" placeholder="Pick a Start date and time"
                            class="w-full bg-transparent outline-none" readonly required />
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <i class="fa fa-clock text-purple-600 mr-2"></i>
                            <input type="number" v-model="form.timeLimit" placeholder="Time Limit (in minutes)" 
                            class="w-full bg-transparent outline-none" required />
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <i class="fa fa-hashtag text-purple-600 mr-2"></i>
                            <input type="number" v-model="form.totalMarks" placeholder="Total Marks" 
                            class="w-full bg-transparent outline-none" required />
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <i class="fa fa-calendar-alt text-purple-600 mr-2"></i>
                            <input type="text" ref="endTimePicker" placeholder="Pick a End date and time"
                            class="w-full bg-transparent outline-none" readonly required />
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <i class="fa fa-align-left text-purple-600 mr-2 mb-6"></i>
                            <textarea type="text" v-model="form.description" placeholder="Description"
                            class="w-full bg-transparent outline-none" rows="2" required ></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button @click="closeCreateEditModal" class="bg-gray-300 px-4 py-2 rounded-lg" >
                            Cancel
                        </button>
                        <button class="bg-purple-700 text-white px-4 py-2 rounded-lg" >
                            {{ isEditing ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
            <!--View Modal-->
        <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg shadow-lg p-6 w-[90%] md:w-[50%] relative">
                <!-- Close Button -->
                <button @click="closeViewModal" class="absolute top-4 right-4 text-gray-700 hover:text-gray-900">
                    <i class="fas fa-times text-xl"></i>
                </button>
                <!-- Exam Details -->
                <h3 class="text-3xl font-semibold text-blue-800 mb-6 flex items-center fa-ad">
                    <i class="fas fa-book-open mr-3 text-blue-700"></i>
                        {{ selectedExam.examName }}
                </h3>
                <div class="space-y-4">
                    <p class="flex items-center text-lg text-gray-700">
                        <i class="fas fa-align-left text-blue-600 mr-3"></i>
                        <strong class="mr-2">Description:</strong> {{ selectedExam.description }}
                    </p>
                    <p class="flex items-center text-lg text-gray-700">
                        <i class="fas fa-layer-group text-blue-600 mr-3"></i>
                        <strong class="mr-2">Level:</strong> {{ selectedExam.level }}
                    </p>
                    <p class="flex items-center text-lg text-gray-700">
                        <i class="fas fa-calendar-alt text-blue-600 mr-3"></i>
                        <strong class="mr-2">Start Time:</strong> {{ selectedExam.startTime }}
                    </p>
                    <p class="flex items-center text-lg text-gray-700">
                        <i class="fas fa-calendar-check text-blue-600 mr-3"></i>
                        <strong class="mr-2">End Time:</strong> {{ selectedExam.endTime }}
                    </p>
                    <p class="flex items-center text-lg text-gray-700">
                        <i class="fas fa-clock text-blue-600 mr-3"></i>
                        <strong class="mr-2">Time Limit:</strong> {{ selectedExam.timeLimit }} mins
                    </p>
                    <p class="flex items-center text-lg text-gray-700">
                        <i class="fas fa-hashtag text-blue-600 mr-3"></i>
                        <strong class="mr-2">Total Marks:</strong> {{ selectedExam.totalMarks }}
                    </p>
                </div>
                <!-- Footer -->
                <div class="mt-8 text-right">
                    <button @click="closeViewModal" class="bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-blue-800">
                        Close
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-[90%]">
                <h3 class="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p class="mb-4">Are you sure you want to delete this exam?</p>
                <div class="flex justify-end space-x-2">
                    <button @click="closeDeleteModal" class="bg-gray-300 px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded-lg" >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="activeTab === 'Online Classes'">
        <div class="flex flex-row items-center "><i class="fas fa-play-circle mr-2 text-xl text-purple-700 fa-ad "></i> <h2 class="text-xl font-semibold mb-0 text-yellow-700">Upload Saved Videos</h2></div>
        <input type="file" @change="handleFileUpload" class="block w-full p-2 border border-gray-300 rounded mb-2 mt-2" accept="video/*" >
        <button @click="uploadVideo" class="bg-blue-500 text-white px-4 py-2 rounded">Upload Video</button>
        <p class="mt-1 text-sm text-black">
           <span class="text-base text-red-600 font-semibold">* Note </span> : 1. Only <span class="text-base text-rose-600 ">.mp4</span> files are allowed. File size must not exceed <span class="text-base text-rose-600 ">10MB</span>.
        </p>
        <p class="mt-1 text-sm text-gray-600">
            2. Please ensure your video file name follows this format: <strong>Title-Author-Duration.mp4</strong>.
            Example: <strong>Lesson 1 Introduction-Vedant Patil-120.mp4</strong> (Duration is in seconds).
        </p>
        <div v-if="videos.length > 0" class="mt-2">
            <h3 class="text-base font-semibold text-green-600">Uploaded Videos</h3>
            <ul>
                <li v-for="(video, index) in videos" :key="index" class="mt-1">
                    <div class="text-sm text-gray-500 video-title">Title: {{ video.name }}</div>
                    <p class="text-sm text-gray-500">Author: {{ video.author }}</p>
                    <p class="text-sm text-gray-500">Size: {{ video.size }} MB</p>
                    <p class="text-sm text-gray-500">Duration: {{ video.duration }} Minutes</p>
                    <!-- <p class="text-sm text-gray-500">Uploaded: {{ video.uploadedAt }}</p> -->
                </li>
            </ul>
        </div>
    </div>

    <div v-if="activeTab === 'Books'">
        <h2 class="text-lg font-semibold mb-1 flex items-center space-x-1">
            <i class="fas fa-book-reader text-blue-600 mr-2 fa-ad"></i>
            <span>Manage Books</span>
        </h2>
        <form @submit.prevent="saveBookDetails">
            <div class="mb-2">
                <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                    <i class="fa fa-book-open text-purple-600 mr-2"></i>
                    <input type="text" v-model="bookName" placeholder="Book Name"
                     class="w-full bg-transparent outline-none" required />
                </div>
            </div>
            <div class="mb-1">
                <div class="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                    <i class="fa fa-user-edit text-purple-600 mr-2"></i>
                    <input type="text" v-model="bookAuthor" placeholder="Author"
                    class="w-full bg-transparent outline-none" required />
                </div>
            </div>
            <div class="mb-2">
                <label class="text-sm text-red-500 ">* Upload Book Cover Page Image(.jpg,.png)</label>
                <div class="flex items-center border rounded-lg px-2 py-1 bg-gray-50">    
                    <i class="fa fa-upload text-purple-600 mr-2"></i>
                    <input type="file" @change="handleImageUpload" accept="image/*"
                    class="w-full bg-transparent outline-none" required />
                </div>
            </div>
            <div class="mb-1">
                <div class="flex items-center border rounded-lg px-3 py-3 bg-gray-50">
                    <i class="fa fa-tags text-purple-600 mr-2"></i>
                    <select v-model="bookType" class="w-full bg-gray-100 outline-none" required>
                        <option value="" disabled selected>Select your Type</option>
                        <option v-for="option in bookTypes" :key="option.value">{{ option.type }}</option>
                    </select>
                </div>
            </div>
            <div class="mb-2">
                <label class="text-sm text-red-500 ">* Upload Book (.pdf or .txt only)</label>
                <div class="flex items-center border rounded-lg px-2 py-1 bg-gray-50">              
                    <i class="fa fa-upload text-purple-600 mr-2"></i>
                    <input type="file" @change="handlePdfUpload" accept=".pdf,.txt/*"
                    class="w-full bg-transparent outline-none" required />
                </div>
            </div>
            <div class="mb-2">
                <div class="flex items-start border rounded-lg px-3 py-2 bg-gray-50">
                    <i class="fa fa-align-left text-purple-600 mr-2 mt-1"></i>
                    <textarea v-model="bookDesc" placeholder="Description" class="w-full bg-transparent outline-none" rows="2"
                    required ></textarea>
                </div>
            </div>
            <div class="mb-1">
                <button type="submit" class="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-bold flex items-center justify-center space-x-1" >
                    <i class="fa fa-save"></i>
                    <span>Save Book Details</span>
                </button>
            </div>
        </form>
    </div>

    <div v-if="activeTab === 'Reports'">
        <h2 class="text-xl font-semibold mb-4">Download Reports</h2>
        <button class="bg-green-500 text-white px-4 py-2 rounded" @click="downloadSignupData">Download Signup Data</button>
    </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
import axios from "axios";
import flatpickr from "flatpickr";
import LoaderData from "../../components/LoaderData.vue";
import ToasterData from "../../components/ToasterData.vue";
import "flatpickr/dist/themes/material_blue.css";
import "flatpickr/dist/flatpickr.min.css";
export default {
  components: {
    LoaderData,
    ToasterData,
  },
  data() {
    return {
      tabs: ["Advertisements", "Quizzes", "Online Classes", "Books", "Reports"],
      activeTab: "Advertisements",
      toastMessage: "",
      toastType: "",
      isLoading: false,
      postData: [],
      postDataNew: [],
      oldResponseData: [],
      currentMessage:'',
      newAd: {
        offer: "",
        date: "",
        prize: "",
      },
      advertisements: [
        // { "message": "Sign Up and Get 50% Off!" },
        //     { "message": "Learn Anywhere, Anytime!" },
        //     { "message": "Achieve Your Goals Today!" },
          ],
      advertisementNew: [],
      offer: [
        { text: "Upcoming Test: ", prize: "Worth Prizes,Join Today!", value: "A" },
        { text: "Win Big:Test on ", prize: "Win Prizes!Enroll Now!", value: "B" },
        { text: "Test Alert!: ", prize: "Exciting Prize!,Join Now!", value: "C" },
        { text: 'Test Your Skills: ',  prize: ' Worth Prizes,Enroll Now!', value: 'D' },
        { text: 'Participate in Test: ',  prize: 'Bumper Gifts!,Register Now!', value: 'E' },
        { text: 'Don’t Miss Out!: ',  prize: 'Win,Hurry,Limited Slots!', value: 'F' },
        { text: 'Gear for Game Changer! Test on ',  prize: 'Hurry to Join!', value: 'G' },
        { text: 'The Countdown Begins! Test on: ',  prize: 'Join Now', value: 'H' },
      ],
      videos: [], // This will hold the uploaded video data
       videoFile: null,// This will hold the selected file before upload
       bookName:'',
       bookAuthor:'',
       bookType:'',
       bookDesc: '',
       bookTypes:[ { type: "Free",  value: "free" },
                   { type: "Premium",  value: "premium" },
                  ],
      bookImage: null,
      uploadedPdfFile: null,
      bookId:'',
       examList: [
        // Example data
           // { description: "ddd", endDate : "20250126:13:25", examName : "dd", id : "1",level: "Level 0",startDate : "20250126:13:25",timeLimit: "20",totalMarks: "30"},
      ],
      currentPage: 1,
      itemsPerPage: 5,
      showCreateEditModal: false,
      showDeleteModal: false,
      isEditing: false,
      showViewModal: false,
      selectedExam: {}, // Holds the exam to view
      form: {
        // id: null,
        examName: '',
        description: '',
        timeLimit: '',
        totalMarks:'',
        level:'',
        startTime: "",
        endTime: "",
      },
      examToDelete: null,
      levels:[ { levelNo: "0",  value: "0" },
               { levelNo: "1",  value: "1" },
               { levelNo: "2",  value: "2" },
               { levelNo: "3",  value: "3" },
            ],
    };
  },
  mounted() {
    this.enableAdvertisementFlatpicker();
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
    this.fetchUserData();
    this.fetchAdvertisements();
    this.autoRemoveExpiredAds();
  },
  computed: {
        totalPages() {
            return Math.ceil(this.examList.length / this.itemsPerPage);
        },
        paginatedExamData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.examList.slice(start, end);
        },
   },
  methods: {
    handleTabClick(tab) {
      this.activeTab = tab; // Update the active tab
      console.log(`Tab clicked: ${tab}`); // Log or handle the clicked tab
      // Additional logic based on the tab can be added here
      if(this.activeTab === "Quizzes"){
        this.fetchExamDetailsData();
      } else if(this.activeTab === "Advertisements"){
        this.$nextTick(() => {
            this.enableAdvertisementFlatpicker();
        });
        
      }
    },
    enableAdvertisementFlatpicker(){
        const dateInputAd = this.$refs.datePicker;
            if (!dateInputAd) {
                console.error("Date input reference is undefined or not found.");
                return;
            }

            try {
                flatpickr(dateInputAd, {
                    enableTime: true,
                    // defaultDate: new Date(),
                    dateFormat: "d/m/Y, h:i K",
                    time_24hr: false,
                    minDate: "today",
                    position: "below",
                    onChange: (selectedDates) => {
                        this.newAd.date = selectedDates[0]
                        ? selectedDates[0].toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            })
                        : "";
                    },
                });
            }catch (error) {
                console.error("Error initializing flatpickr:", error);
            }
    },
    async fetchAdvertisements() {
      try {
        const response = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/advertisementData.json');
        this.advertisements = Object.entries(response.data || {}).map(([id, ad]) => ({ id, ...ad }));
        // console.log("1111",this.advertisements)
      } catch (error) {
        console.warn(error);
      }
    },
    async fetchUserData(){
      try {
            const responseNew = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/studentData.json');
            this.formatPostData(responseNew.data);
            // console.log("2222",this.postData)  
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
    downloadSignupData() {
      if (this.postData.length === 0) {
        this.showToast('No data to download!', 'danger');
        return;
      }
       // Define keys to exclude
        const excludeKeys = ["profileImage", "id"];

     // Convert postData to CSV
        const csvHeaders = Object.keys(this.postData[0]).filter(key => !excludeKeys.includes(key)).join(",") + "\n";
        const csvRows = this.postData.map(row =>Object.entries(row).filter(([key]) => !excludeKeys.includes(key)).map(([, value]) => value).join(",")).join("\n");
        const csvContent = csvHeaders + csvRows;

      // Create a blob and a download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "signup_data.csv";
      link.click();
      this.showToast('SignUp data downloaded successfully!', 'success');

      // Clean up the URL object
      URL.revokeObjectURL(url);
    },
    async addAdvertisement() {
      if (!this.newAd.offer || !this.newAd.date || !this.newAd.prize) {
        this.showToast("All fields are required!", "danger");
        return;
      }

      this.currentMessage = `${this.newAd.offer} ${this.newAd.date}, ${this.newAd.prize}`;
      const newAdObject = { message: this.currentMessage, date: this.newAd.date };
      try {
        const response = await axios.post('https://edutech-b196d-default-rtdb.firebaseio.com/advertisementData.json', newAdObject);
        this.advertisements.push({ id: response.data.name, ...newAdObject });
        console.log("2222",this.advertisements)
        this.newAd = { offer: "", date: "", prize: "" };
        this.showToast("Advertisement added successfully!", "success");
        this.autoRemoveExpiredAds();
      } catch (error) {
        console.warn(error);
        this.showToast("Failed to add advertisement!", "danger");
      }
      // const responseNew = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/advertisementData.json');
      // this.formatPostDataNew(responseNew.data);
      // this.oldResponseData = this.postDataNew;
      // console.log("postDataNew",this.postDataNew)
      // this.advertisements = this.oldResponseData ;
      // if (this.advertisements.some(ad => ad.message === this.currentMessage)) {
      //   this.showToast("Duplicate advertisement message!", "danger");
      //   return;
      // }
      // this.advertisements.push({ message: this.currentMessage});
      // this.advertisementNew.push(this.newAd)
      // this.advertisements = JSON.parse(JSON.stringify(this.advertisements));
      // this.filterAdvertisementsAfterIndex(3);
      // this.advertisements = JSON.parse(JSON.stringify(this.advertisements));
      // this.newAd = { offer: "", date: "", prize: "" };
      
      // console.log("advertisementData",this.advertisements)
      // // await axios.post('https://edutech-b196d-default-rtdb.firebaseio.com/advertisementData.json', this.advertisements);
     
      // this.showToast("Advertisement added successfully!", "success");
    },
    async autoRemoveExpiredAds() {
      const currentDate = new Date();
      const validAds = this.advertisements.filter(ad => new Date(ad.date) >= currentDate);
      const expiredAds = this.advertisements.filter(ad => new Date(ad.date) < currentDate);
      for (const expiredAd of expiredAds) {
        try {
          await axios.delete(`https://edutech-b196d-default-rtdb.firebaseio.com/advertisementData/${expiredAd.id}.json`);
        } catch (error) {
          console.warn(`Failed to delete expired ad: ${expiredAd.message}`);
        }
      }
      this.advertisements = validAds;
    },

    // filterAdvertisementsAfterIndex(startIndex) {
    //   const currentDate = new Date().toLocaleDateString("en-GB");

    //   // Keep the first 3 items and filter only the rest
    //   const fixedAds = this.advertisements.slice(0, startIndex);
    //   const restAds = [];
    //   for (let i = startIndex; i < this.advertisements.length; i++) {
    //     const ad = this.advertisements[i];
    //       if (ad.message) {
    //         const newDateAdd = ad.message.split(",")[0].match(/\d{2}\/\d{2}\/\d{4}/)?.[0];
    //         const parsedDate1 = new Date(newDateAdd.split("/").reverse().join("-"));
    //         const parsedDate2 = new Date(currentDate.split("/").reverse().join("-"));
    //         if (parsedDate1 >= parsedDate2) {
    //           restAds.push(ad);
    //         }
    //     }
    //   }
    //   this.advertisements = [...fixedAds, ...restAds];
    //   this.advertisements = JSON.parse(JSON.stringify(this.advertisements));
    //   return this.advertisements
      
    // },
    // autoRemoveExpiredAds() {
    //   setInterval(() => {
    //     const currentDate = new Date().toLocaleDateString("en-GB");
    //     this.advertisements = this.advertisements.filter(
    //       (ad) => !ad.date.startsWith(currentDate)
    //     );
    //   }, 60000); // Check every minute
    // },
    formatPostDataNew(data){
          this.postDataNew = [];
          Object.keys(data).forEach((id) => {
              const messageObj = data[id][0]; 
              this.postDataNew.push({ message: messageObj.message}); 
        });

      return this.postDataNew;
    },
    showToast(message, type) {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
            this.toastMessage = '';
        }, 3000);
    },
    goHome() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push("/");
      }, 500);
    },
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/') && file.type === 'video/mp4') {
        if (file.size > 10 * 1024 * 1024) { // 10MB
          this.showToast('File size must not exceed 10MB.', 'danger');
          event.target.value = ''; // Reset the input
          return;
        }
        this.videoFile = file;
        } else {
        this.showToast('Please select a valid MP4 video file!', 'danger');
        event.target.value = '';
        }
    },
    async uploadVideo() {
        if (!this.videoFile) {
        this.showToast('No video file selected!', 'warning');
        return;
        }

        const fileName = this.videoFile.name.replace('.mp4', ''); // Removing file extension
        const nameParts = fileName.split('-'); // Assuming name is in "Title-Author-Duration" format
        const title = nameParts[0];
        const author = nameParts[1] ? nameParts[1] : "Learnify Video";
        const duration = nameParts[2] ? nameParts[2] : "600";

        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Format uploadedAt to dd/mm/yyyy hh:mm:ss
        const now = new Date();
        const uploadedAt = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB');
    
        const videoData = {
        name: title,
        author: author,
        duration: formattedDuration,
        size: (this.videoFile.size / (1024 * 1024)).toFixed(2), // Convert size to MB
        uploadedAt: uploadedAt,
        };
        console.log("videoData",videoData)
        // You can store this in a backend or local state as required.
        this.videos.push(videoData);

        this.videoFile = null;
        event.target.value = '';
      
        // Show success message
        this.showToast('Video uploaded successfully!', 'success');
    },
    handleImageUpload(event) {
        this.bookImage = event.target.files[0];
    },
    handlePdfUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "text/plain"];
      if (!allowedTypes.includes(file.type)) {
            this.showToast('Please upload a PDF or TXT file.', 'danger');
            return;
        }

      // Store file in the component state (or upload to the server)
      const reader = new FileReader();
      reader.onload = () => {
        // Save the file's base64 data or blob URL
        this.uploadedPdfFile = {
          name: file.name,
          type: file.type,
          content: reader.result,
        };
      };
      reader.readAsDataURL(file); // For base64 encoding
    }
  },
    async saveBookDetails() {
        if (!this.bookName || !this.bookAuthor || !this.bookType || !this.bookDesc || !this.bookImage || !this.uploadedPdfFile) {
            this.showToast('Please fill out the form', 'danger');
            return;
        }

      this.isLoading = true;
      try{
            const bookId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            this.bookId =  bookId;
            const base64Image = await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = () => reject(new Error('Error reading profile picture'));
                fileReader.readAsDataURL(this.bookImage);
            });
            const bookData = {
              bookName: this.bookName,
              bookAuthor: this.bookAuthor,
              bookType: this.bookType,
              bookDesc: this.bookDesc,
              bookImage: base64Image,
              bookId:  this.bookId,
              bookFile: this.uploadedPdfFile,
            }
            //const response = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/bookData.json');
            // const existingUsers = response.data ? this.formatPostData(response.data) : [];

            // const userExists = existingUsers.some(user => user.mobile === userData.mobile);
            // if (userExists) {
            //     this.showToast('User Already Exists', 'danger');
            //     this.isLoading = false;
            // return;
            // }
            await axios.post('https://edutech-b196d-default-rtdb.firebaseio.com/bookData.json', bookData);
            this.showToast('Book Saved successfully!', 'success');
            let booksData = JSON.parse(localStorage.getItem('bookData')) || [];
            booksData.push(bookData);
            localStorage.setItem('bookData', JSON.stringify(booksData));
            this.isLoading = false;
            this.resetForm();
            // this.$router.push('/login');
        } catch(error){
          this.isLoading = false;
          this.resetForm();
          console.warn(error);
        }
    },
    resetForm() {
      this.bookName = '';
      this.bookAuthor = '';
      this.bookType = '',
      this.bookDesc = '';
      this.bookImage = null;
      this.uploadedPdfFile = null;
    },
    async fetchExamDetailsData(){
        this.isLoading = true;
        setTimeout(() => {
        this.isLoading = false;
        }, 500);
        try{
            const responseNew = await axios.get('https://oslp-app.onrender.com/api/v1/exam/get/mocktests');
            console.log("5555",responseNew)
        } catch(err){
            console.log("6666",err)
        }
        
    },
    initialDatePickerForExamDetails(){
        const dateInput = this.$refs.startTimePicker;
        const dateInput1 = this.$refs.endTimePicker;
            if (!dateInput || !dateInput1) {
                console.error("Date input reference is undefined or not found.");
                return;
            }

            try {
                flatpickr(dateInput, {
                    enableTime: true,
                    defaultDate: new Date(),
                    dateFormat: "d/m/Y, h:i K",
                    time_24hr: false,
                    minDate: "today",
                    position: "below",
                    onChange: (selectedDates) => {
                        this.form.startTime = selectedDates[0]
                        ? selectedDates[0].toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            })
                        : "";
                    },
                });

                flatpickr(dateInput1, {
                    enableTime: true,
                    defaultDate: new Date(),
                    dateFormat: "d/m/Y, h:i K",
                    time_24hr: false,
                    minDate: "today",
                    position: "above",
                    onChange: (selectedDates) => {
                        this.form.endTime = selectedDates[0]
                        ? selectedDates[0].toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            })
                        : "";
                    },
                });
            } catch (error) {
                console.error("Error initializing flatpickr:", error);
            }
    },
    createExam() {
      this.isEditing = false;
      this.showCreateEditModal = true;
      this.$nextTick(() => {
        this.initialDatePickerForExamDetails();
        });
        this.resetExamForm();
    },
    editExam(exam) {
      this.isEditing = true;
      this.form = { ...exam };
      this.showCreateEditModal = true;
      this.$nextTick(() => {
        this.initialDatePickerForExamDetails();
        });
    },
    resetExamForm(){
        this.form = { id: null, examName: '', description: '', timeLimit: '', totalMarks:'', level:'',startTime: '',
        endTime: '', };
    },
    closeCreateEditModal() {
      this.showCreateEditModal = false;
    },
   async saveExam() {
        const startDate = new Date();
        // Format start time to yyyyMMdd:HH:mm
        const formattedStartTime = this.formatDate(startDate);
        this.form.startTime = formattedStartTime;

        // Set end time to 45 minutes later
        // const endDate = new Date(startDate.getTime() + 45 * 60000); // Adding 45 minutes in milliseconds
        const endDate = new Date();
        this.form.endTime = this.formatDate(endDate);

        // Store original values for editing
        // let originalStartTime = this.form.startTime.getTime();
        // let originalEndTime = this.form.endTime.getTime();
        const originalStartTime = new Date(this.form.startTime);
        const originalEndTime = new Date(this.form.endTime);

        if (originalEndTime <= originalStartTime) {
            this.showToast('End time must be after start time.', 'danger');
            // alert("End time must be after start time.");
            return;
        }

        if (!this.form.examName || !this.form.timeLimit || !this.form.description || !this.form.totalMarks || !this.form.level || !this.form.startTime || !this.form.endTime) {
            this.showToast('Please fill out the form', 'danger');
            return;
        }

        // if (originalEndTime >= originalStartTime) {
        //     this.showToast("Start time can't less than or same of end time",'danger');
        //     return;
        // }
       
      if (this.isEditing) {
        // Update edit logic here
        // this.examList.push(this.form);
        const index = this.examList.findIndex((exam) => exam.id === this.form.id);
      if (index !== -1) {
        this.examList[index] = { ...this.form };
      }
        console.log("2222",this.examList)
        console.log("1111",this.form)

      } else {
        // Create add logic here
        // console.log("Form Submitted: ", this.form);
        const newExam = {...this.form, id: Date.now().toString(),};
        this.examList.push(newExam);
        this.showToast(this.isEditing ? "Exam updated successfully." : "Exam created successfully.", "success");
        console.log("2222",this.examList)
      }
      this.closeCreateEditModal();
    },
    formatDate(date) {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Month starts from 0
        const day = ("0" + date.getDate()).slice(-2);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        return `${year}${month}${day}:${hours}:${minutes}`;
    },
    viewExam(exam) {
      this.selectedExam = exam;
      this.showViewModal = true;
    },
    // Close View Modal
    closeViewModal() {
      this.showViewModal = false;
    },
    deleteExam(id) {
      this.examToDelete = id;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.examToDelete = null;
    },
    confirmDelete() {
        this.examList = this.examList.filter((exam) => exam.id !== this.examToDelete);
        this.closeDeleteModal();
        this.showToast("Exam deleted successfully.", "success");
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.video-title {
  width: 300px;           
  white-space: nowrap;    
  overflow: hidden;       
  text-overflow: ellipsis; 
}

form input,
form button {
  width: 100%;
  max-width: 400px;
}
.grid {
  gap: 1rem;
}
.grid > div {
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
}

.fa-ad {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* .flatpickr-calendar {
  font-size: 0.85rem; 
}

.flatpickr-month {
  height: 30px; 
  line-height: 30px;
}

.flatpickr-months .flatpickr-prev-month,
.flatpickr-months .flatpickr-next-month {
  line-height: 30px; 
}

.flatpickr-days {
  padding: 2px; 
}

.flatpickr-day {
  height: 25px; 
  max-width: 25px;
  line-height: 25px;
}

.flatpickr-time {
  height: auto; 
  padding: 5px;
}

.flatpickr-calendar .flatpickr-monthDropdown-months {
  font-size: 0.8rem; 
  height: 28px; 
} */
</style>
