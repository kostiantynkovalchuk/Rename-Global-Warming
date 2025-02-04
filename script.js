import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeRhuh32_tLeZWh06XPg2GR5fEPAVygW4",
  authDomain: "global-warming-c9548.firebaseapp.com",
  projectId: "global-warming-c9548",
  storageBucket: "global-warming-c9548.appspot.com",
  messagingSenderId: "1073613221901",
  appId: "1:1073613221901:web:341b6a202065fedd316544",
  measurementId: "G-HPZTTC2H5L",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("name-form");
  const inputField = document.getElementById("input-field");
  const nameDisplay = document.getElementById("name-of-the-day");

  // Scroll to Section 1 when "Ready to Rename?" button is clicked
  document
    .getElementById("return-to-section1")
    .addEventListener("click", () => {
      document.getElementById("section-1").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = inputField.value.trim();

    if (newName) {
      await addDoc(collection(db, "globalWarmingNames"), { name: newName });
      nameDisplay.textContent = newName;
      inputField.value = ""; // Clear input field

      // Scroll to Section 5 after submitting the name
      document.getElementById("section-5").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  // Load latest name on page load
  async function loadLatestName() {
    const querySnapshot = await getDocs(collection(db, "globalWarmingNames"));
    const names = querySnapshot.docs.map((doc) => doc.data().name);
    if (names.length > 0) {
      nameDisplay.textContent = names[names.length - 1]; // Show last submitted name
    }
  }

  loadLatestName();

  const carousel = document.getElementById("carousel-images");
  const images = document.querySelectorAll("#carousel-images img");
  let currentIndex = 0;

  document.getElementById("carousel-left").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  document.getElementById("carousel-right").addEventListener("click", () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  function updateCarousel() {
    const imageWidth = images[0].clientWidth; // Getting single image width
    carousel.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
  }
});
