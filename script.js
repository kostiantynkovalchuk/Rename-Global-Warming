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
  const counterBox = document.getElementById("counter-box");

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

      // Update the counter
      updateCounter();
    }
  });

  // Load latest name and counter on page load
  async function loadLatestNameAndCounter() {
    const querySnapshot = await getDocs(collection(db, "globalWarmingNames"));
    const names = querySnapshot.docs.map((doc) => doc.data().name);
    if (names.length > 0) {
      nameDisplay.textContent = names[names.length - 1]; // Show last submitted name
    }
    counterBox.textContent = names.length; // Update counter
  }

  loadLatestNameAndCounter();

  // ---- IMAGE CAROUSEL (beginning) ---->

  const carousel = document.getElementById("carousel-images");
  const images = document.querySelectorAll("#carousel-images img");
  let currentImgIndex = 0;

  document.getElementById("carousel-left").addEventListener("click", () => {
    if (currentImgIndex > 0) {
      currentImgIndex--;
      updateCarousel(carousel, images, currentImgIndex);
    }
  });

  document.getElementById("carousel-right").addEventListener("click", () => {
    if (currentImgIndex < images.length - 1) {
      currentImgIndex++;
      updateCarousel(carousel, images, currentImgIndex);
    }
  });

  function updateCarousel(parent, element, counter) {
    const elementWidth = element[0].clientWidth;
    parent.style.transform = `translateX(-${counter * elementWidth}px)`;
  }

  // <---- IMAGE CAROUSEL (ending) ----

  async function updateCounter() {
    const querySnapshot = await getDocs(collection(db, "globalWarmingNames"));
    counterBox.textContent = querySnapshot.docs.length; // Update counter
  }
});
