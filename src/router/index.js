import { createRouter, createWebHistory } from 'vue-router'
import HomeData from '../components/HomeData.vue';
import LoginForm from '../components/Auth/LoginForm.vue';
import SignupForm from '../components/Auth/SignupForm.vue';
import ForgotPinForm from '../components/Auth/ForgotPinData.vue';
import EnrollNowForm from '../components/Auth/EnrollNowFormData.vue';
import Dashboard from '../components/DashboardData.vue';
import AdminPanel from '../components/Admin/AdminPanelData.vue';
import onlineClassesDashboard from '../components/Dashboard/OnlineClassesData.vue';
import scholarshipCompetitionsData from '../components/Dashboard/ScholarshipCompetitionData.vue';
import bookLibraryData from '../components/Dashboard/BookLibraryData.vue';
import watchVideoData from '../components/Dashboard/OnlineClass/WatchVideoData.vue';
import sampleTestData from '../components/Dashboard/Test/SampleTestData.vue';
import startSampleTestData from '../components/Dashboard/Test/StartSampleTestData.vue';
import originalTestData from '../components/Dashboard/Test/OriginalTestData.vue';
import startOriginalTestData from '../components/Dashboard/Test/StartOriginalTestData.vue';

const routes = [
  { path: '/', component: HomeData },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignupForm },
  { path: '/dashboard', component: Dashboard },
  { path: '/enrollNow', component: EnrollNowForm },
  { path: '/admin', component: AdminPanel },
  { path: '/forgotPin/:mobile', name: 'ForgotPin', component: ForgotPinForm, props: true,},
  { path: '/onlineClasses', component: onlineClassesDashboard},
  { path: '/scholarshipCompetitions', component: scholarshipCompetitionsData},
  { path: '/bookLibrary', component: bookLibraryData},
  { path: '/watchVideo', component: watchVideoData},
  { path: '/sampleTest', component: sampleTestData},
  { path: '/sampleTest/start', component: startSampleTestData},
  { path: '/test', component: originalTestData},
  { path: '/test/start', component: startOriginalTestData},

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

