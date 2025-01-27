
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBR8nz544OF_Wb0CdCbn-MSXKLvq_1wt3E",
  authDomain: "edutech-b196d.firebaseapp.com",
  projectId: "edutech-b196d",
  storageBucket: "edutech-b196d.firebasestorage.app",
  messagingSenderId: "1017328857890",
  appId: "1:1017328857890:web:3f5bbcaf8cdfd715a4ab7b"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;