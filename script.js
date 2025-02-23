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

  // ---- CASE CAROUSEL ---->

  const carouselCases = document.getElementById("carousel-cases");
  const cases = document.querySelectorAll("#carousel-cases figure");
  let currentCaseIndex = 0;

  document.getElementById("case-left").addEventListener("click", () => {
    if (currentCaseIndex > 0) {
      currentCaseIndex--;
      updateCaseCarousel();
    }
  });

  document.getElementById("case-right").addEventListener("click", () => {
    if (currentCaseIndex < cases.length - 1) {
      currentCaseIndex++;
      updateCaseCarousel();
    }
  });

  function updateCaseCarousel() {
    const caseWidth = cases[0].clientWidth; // Getting single case width
    carouselCases.style.transform = `translateX(-${
      currentCaseIndex * caseWidth
    }px)`;
  }

  // -- IMAGE CAROUSEL -->

  function updateImageCarousel(parent, elements, counter) {
    const elementWidth = parent.clientWidth;
    parent.style.transform = `translateX(-${counter * elementWidth}px)`;
  }

  // - Dana Imgs ->
  const carouselImgs1 = document.getElementById("carousel-images-1");
  const images1 = document.querySelectorAll("#carousel-images-1 img");
  let currentImgIndex1 = 0;

  document.getElementById("carousel-left-1").addEventListener("click", () => {
    if (currentImgIndex1 > 0) {
      currentImgIndex1--;
      updateImageCarousel(carouselImgs1, images1, currentImgIndex1);
    }
  });

  document.getElementById("carousel-right-1").addEventListener("click", () => {
    if (currentImgIndex1 < images1.length - 1) {
      currentImgIndex1++;
      updateImageCarousel(carouselImgs1, images1, currentImgIndex1);
    }
  });
  // <- Dana Imgs -

  // - Ice Imgs ->
  const carouselImgs2 = document.getElementById("carousel-images-2");
  const images2 = document.querySelectorAll("#carousel-images-2 img");
  let currentImgIndex2 = 0;

  document.getElementById("carousel-left-2").addEventListener("click", () => {
    if (currentImgIndex2 > 0) {
      currentImgIndex2--;
      updateImageCarousel(carouselImgs2, images2, currentImgIndex2);
    }
  });

  document.getElementById("carousel-right-2").addEventListener("click", () => {
    if (currentImgIndex2 < images2.length - 1) {
      currentImgIndex2++;
      updateImageCarousel(carouselImgs2, images2, currentImgIndex2);
    }
  });
  // <- Ice Imgs -

  // - Ethiopia Imgs ->
  const carouselImgs3 = document.getElementById("carousel-images-3");
  const images3 = document.querySelectorAll("#carousel-images-3 img");
  let currentImgIndex3 = 0;

  document.getElementById("carousel-left-3").addEventListener("click", () => {
    if (currentImgIndex3 > 0) {
      currentImgIndex3--;
      updateImageCarousel(carouselImgs3, images3, currentImgIndex3);
    }
  });

  document.getElementById("carousel-right-3").addEventListener("click", () => {
    if (currentImgIndex3 < images3.length - 1) {
      currentImgIndex3++;
      updateImageCarousel(carouselImgs3, images3, currentImgIndex3);
    }
  });
  // <- Ethiopia Imgs -

  async function updateCounter() {
    const querySnapshot = await getDocs(collection(db, "globalWarmingNames"));
    counterBox.textContent = querySnapshot.docs.length; // Update counter
  }

  // ---- STORY SHARING ---->

  // Toggle "Share My Story" section
  document.getElementById("add-story").addEventListener("click", () => {
    const shareStorySection = document.getElementById("share-story-section");

    // Toggle visibility
    if (
      shareStorySection.style.display === "none" ||
      !shareStorySection.style.display
    ) {
      shareStorySection.style.display = "block"; // Show the section
    } else {
      shareStorySection.style.display = "none"; // Hide the section
    }
  });

  // Handle Story Submission
  document
    .getElementById("story-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document
        .getElementById("story-description")
        .value.trim();
      const images = document.getElementById("story-images").files;

      if (!description || images.length === 0) {
        alert("Please write your story and upload at least one image.");
        return;
      }

      if (images.length > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
      }

      try {
        // Upload images to Cloudinary
        const imageUrls = await uploadImagesToCloudinary(images);

        // Save story to Firestore
        await addDoc(collection(db, "stories"), {
          description: description,
          images: imageUrls,
          timestamp: new Date(),
        });

        alert("Your story has been submitted successfully!");
        document.getElementById("share-story-section").style.display = "none"; // Hide the section
      } catch (error) {
        console.error("Error submitting story:", error);
        alert("An error occurred. Please try again.");
      }
    });

  // Function to Upload Images to Cloudinary
  async function uploadImagesToCloudinary(images) {
    const imageUrls = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "story_uploads");
      formData.append("folder", "RenameGlobalWarming"); // Save to the "RenameGlobalWarming" folder

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dbs5xendr/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        imageUrls.push(data.secure_url); // URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
      }
    }
    return imageUrls;
  }
});
