<template>
    <div class="book-library bg-gradient-to-tr from-yellow-100 via-yellow-200 to-orange-200 min-h-screen">
        <!-- Top Navigation Bar -->
        <div class="flex items-center justify-between bg-purple-500 text-white py-2 px-4 shadow-md sticky top-0 z-10">
            <button @click="goBack" class="flex items-center font-medium  hover:text-gray-600 transition-all">
                <i class="fas fa-arrow-left mr-2"></i> 
            </button>
            <h1 class="text-xl font-bold flex items-center">
                Book Library
            </h1>
            <i class="fas text-xl fa-book-open "></i>
        </div>

            <!-- Library Content -->
        <div class="px-6 py-2">
            <h2 class="text-xl font-semibold text-red-500 text-center mb-2">
                <i class="fas fa-book-reader mr-2 spin-icon"></i> Explore Our Books
            </h2>

                <!-- Free Books Section -->
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
                <i class="fas fa-book mr-2 text-green-500 spin-icon"></i> Free Books
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="book in visibleFreeBooks" :key="book.bookId" 
                class="book-card px-4 py-2 rounded-xl shadow-md bg-white hover:shadow-lg transition-all cursor-pointer" >
                    <div class="flex items-center justify-between ">
                        <h3 class="text-base font-bold text-gray-800">{{ book.bookName }}</h3>
                        <button @click="viewDetails(book.bookId)" class="text-yellow-700 hover:text-yellow-900 text-sm">
                            <i class="fas fa-eye mr-1 text-sm"></i> View
                        </button>
                    </div>
                    <p class="text-sm text-gray-600 ">{{ book.bookAuthor }}</p>
                    <div class="mt-1 flex justify-between items-center text-sm text-gray-500">
                        <span>Free</span>
                        <button @click="downloadBook(book, 'free')" class="text-purple-500 hover:text-purple-700">
                            <i class="fas fa-download mr-1"></i> Download
                        </button>
                    </div>
                </div>
            </div>
            <div class="text-center mt-4">
                <button v-if="freeBooks.length > visibleFreeBooks.length"  @click="loadMore('free')" 
                class="bg-purple-500 text-white py-1 px-2 rounded-full hover:bg-purple-600 transition-all flex items-center justify-center">
                    <i class="fas fa-spinner animate-spin mr-2" v-if="loading.free"></i>
                    Load More
                </button>
            </div>

                <!-- Premium Books Section -->
            <h3 class="text-lg font-semibold text-gray-700 mt-2 mb-2">
                <i class="fas fa-star text-cyan-500 mr-2 spin-icon"></i> Premium Books
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="book in visiblePremiumBooks"  :key="book.bookId" 
                     class="book-card px-4 py-2 rounded-xl shadow-md bg-white hover:shadow-lg transition-all cursor-pointer" >
                    <div class="flex items-center justify-between ">
                        <h3 class="text-base font-bold text-gray-800">{{ book.bookName }}</h3>
                        <button @click="viewDetails(book.bookId)" class="text-yellow-700 hover:text-yellow-900 text-sm">
                            <i class="fas fa-eye mr-1 text-sm"></i> View
                        </button>
                    </div>
                    <p class="text-sm text-gray-600 ">{{ book.bookAuthor }}</p>
                    <div class="mt-1 flex justify-between items-center text-sm text-gray-500">
                        <span>Premium</span>
                        <button @click="downloadBook(book, 'premium')" class="text-purple-500 hover:text-purple-700">
                            <i class="fas fa-download mr-1"></i> Download
                        </button>
                    </div>
                </div>
            </div>
            <div class="text-center mt-4">
                <button v-if="premiumBooks.length > visiblePremiumBooks.length" @click="loadMore('premium')" 
                class="bg-green-500 text-white py-1 px-2 rounded-full hover:bg-green-600 transition-all flex items-center justify-center">
                    <i class="fas fa-spinner animate-spin mr-2" v-if="loading.premium"></i>
                    Load More
                </button>
            </div>
        </div>

            <!-- Premium Features Section -->
        <div class="premium-section bg-gradient-to-r from-red-500 to-pink-500 py-2 px-2 mt-4 rounded-lg shadow-lg text-center">
            <h3 class="text-lg font-bold text-white mb-2">
                <i class="fas fa-crown mr-1 spin-icon-premium"></i>Unlock Premium Library Access<span class="spin-icon-premium">🎉</span>
            </h3>
            <p class="text-base text-white mb-2">Gain unlimited access to exclusive books and rare collections.</p>
            <button @click="upgradeToPremium"  class="bg-white text-pink-600 font-medium py-2 px-6 rounded-full hover:bg-pink-100 transition-all">
                <i class="fas fa-arrow-up mr-2"></i> Upgrade Now
            </button>
        </div>
    
            <!-- Modal for Book Details -->
        <div v-if="modalVisible" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50" >
            <div class="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl p-6 shadow-2xl max-w-md w-[90%] relative" >
                    <!-- Close Icon -->
                <button @click="closeModal" class="absolute top-3 right-3 text-white text-2xl hover:text-red-400 transition-all">
                    <i class="fas fa-times"></i>
                </button>
                    <!-- Modal Header -->
                <div class="flex items-center mb-4">
                    <i class="fas fa-book-open text-yellow-300 text-2xl mr-2"></i>
                    <h2 class="text-2xl font-bold">{{ selectedBook.bookName }}</h2>
                </div>
                    <!-- Book Cover -->
                <img :src="selectedBook.bookImage" alt="Book Cover" class="w-full h-48 object-contain rounded-lg shadow-lg mb-4"/>
                    <!-- Book Details -->
                <div class="space-y-2 text-base">
                    <p class="flex items-center">
                        <i class="fas fa-user text-green-300 mr-2"></i>
                        <span>Author: <span class="text-yellow-100">{{ selectedBook.bookAuthor }}</span></span>
                    </p>
                    <p class="flex items-center">
                        <i class="fas fa-tag text-blue-300 mr-2"></i>
                        <span>Type: 
                            <span :class="selectedBook.bookType === 'free' ? 'text-green-400' : 'text-red-400'" >
                                {{ selectedBook.bookType.charAt(0).toUpperCase() + selectedBook.bookType.slice(1) }}
                            </span>
                        </span>
                    </p>
                    <p class="flex items-center">
                        <i class="fas fa-info-circle text-pink-300 mr-2"></i>
                        <span>Description:</span>
                    </p>
                    <p class="text-yellow-100 pl-6">
                        {{ selectedBook.bookDesc || 'No description available.' }}
                    </p>
                </div>
                    <!-- Modal Footer -->
                <div class="text-center mt-6">
                    <button @click="closeModal" class="bg-yellow-400 text-purple-900 py-2 px-4 rounded-lg hover:bg-yellow-500 hover:text-purple-800 transition-all font-semibold flex items-center justify-center" >
                        <i class="fas fa-check-circle mr-2"></i> OK
                    </button>
                </div>
            </div>
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
  name: "BookLibraryData",
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
        books:[],
        visibleFreeBooks: [],
        visiblePremiumBooks: [],
        postData:[],
        freeBooksLimit: 1,
        premiumBooksLimit: 1,
        toastMessage: '',
        toastType: '',
        isLoading: false,
        isLoggedIn : true,
        modalVisible: false, 
        selectedBook: null, 
        loading: {
            free: false,
            premium: false
        }
    };
  },
  computed: {
    freeBooks() {
      return this.books.filter(book => book.bookType === "Free");
    },
    premiumBooks() {
      return this.books.filter(book => book.bookType === "Premium");
    }
  },
  mounted() {
    this.fetchBooksData();
    this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 10000); 
  },
  methods: {
    async fetchBooksData(){
      this.visibleFreeBooks = this.freeBooks.slice(0, this.freeBooksLimit);
      this.visiblePremiumBooks = this.premiumBooks.slice(0, this.premiumBooksLimit);
      try {
        const response = await axios.get('https://edutech-b196d-default-rtdb.firebaseio.com/bookData.json');
        this.formatPostData(response.data);
        this.books= this.postData;
        this.visibleFreeBooks = this.freeBooks.slice(0, this.freeBooksLimit);
        this.visiblePremiumBooks = this.premiumBooks.slice(0, this.premiumBooksLimit);
      } catch (error) {
        console.warn(error);
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
    viewDetails(id) {
      const book = this.books.find(book => book.bookId === id);
      if (book) {
        this.selectedBook = book;
        this.modalVisible = true;
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedBook = null;
    },
    upgradeToPremium() {
      this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push("/enrollNow");
        }, 500);
    },
    downloadBook(book, type) {
      if (type === "free") {
            this.triggerDownload(book.bookFile.content, book.bookFile.name);
      } else if (type === "premium") {
        if (this.isPremiumUser()) {
            this.triggerDownload(book.bookFile.content, book.bookFile.name);
        } else {
            this.showToast('Upgrade to premium to download this book.','warning');
        }
      }
    },
    triggerDownload(fileContent, fileName) {
        const link = document.createElement("a");
        link.href = fileContent; 
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast('Books pdf downloaded successfully.','success')
    },
    showToast(message, type) {
        this.toastMessage = message;
        this.toastType = type;
        setTimeout(() => {
          this.toastMessage = '';
        }, 3000);
    },
    isPremiumUser() {
        return this.user && this.user.isPremium;
      //return false; // Replace with actual check
    },
    loadMore(type) {
      this.loading[type] = true;
      setTimeout(() => {
        if (type === "free") {
          this.visibleFreeBooks = this.freeBooks.slice(0, this.visibleFreeBooks.length + this.freeBooksLimit);
        } else if (type === "premium") {
          this.visiblePremiumBooks = this.premiumBooks.slice(0, this.visiblePremiumBooks.length + this.premiumBooksLimit);
        }
        this.loading[type] = false;
      }, 1000);
    }
  }
};
</script>
<style scoped>
.book-card {
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.premium-section {
  background: linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(255,154,0,1) 100%);
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin-icon{
  animation: spin 2s ease-in-out infinite;
}

.spin-icon-premium {
  display: inline-block;
  animation: spin 2s ease-in-out infinite;
  color: #ffeb3b; 
}
</style>
