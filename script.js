let words = [];
let currentWordIndex = -1;
let dailyWords = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let stats = JSON.parse(localStorage.getItem("stats")) || {
  totalWords: 0,
  correctWords: 0,
};

// İstatistikleri güncelle
function updateStats() {
  document.getElementById("totalWords").textContent = stats.totalWords;
  document.getElementById("correctWords").textContent = stats.correctWords;
  localStorage.setItem("stats", JSON.stringify(stats));
}

// İstatistikleri sıfırla
function resetStats() {
  stats = {
    totalWords: 0,
    correctWords: 0,
  };
  favorites = [];
  updateStats();
  updateFavorites();
  localStorage.setItem("stats", JSON.stringify(stats));
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Kelimeleri yükle
async function loadWords() {
  try {
    const response = await fetch("words.json");
    words = await response.json();
    generateDailyWords();
    showNextWord();
  } catch (error) {
    console.error("Kelimeler yüklenirken hata oluştu:", error);
  }
}

// Günlük kelimeleri oluştur
function generateDailyWords() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("lastGeneratedDate");

  if (today !== savedDate) {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    dailyWords = shuffled.slice(0, 15); // 15 kelime seç
    localStorage.setItem("dailyWords", JSON.stringify(dailyWords));
    localStorage.setItem("lastGeneratedDate", today);
  } else {
    dailyWords = JSON.parse(localStorage.getItem("dailyWords")) || [];
  }
}

// Sonraki kelimeyi göster
function showNextWord() {
  currentWordIndex = (currentWordIndex + 1) % dailyWords.length;
  const word = dailyWords[currentWordIndex];

  document.getElementById("englishWord").textContent = word.english;
  document.getElementById("turkishWord").textContent = word.turkish;

  // Kartı ön yüzüne çevir
  document.querySelector(".card").classList.remove("flipped");

  // Kelime sayısını artır
  stats.totalWords++;
  updateStats();
}

// Favorileri güncelle
function updateFavorites() {
  const favoritesList = document.getElementById("favorites");
  favoritesList.innerHTML = "";

  favorites.forEach((word, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${word.english} - ${word.turkish}</span>
            <button class="remove-btn" onclick="removeFavorite(${index})">
              <i class="fas fa-heart-broken"></i>
            </button>
        `;
    favoritesList.appendChild(li);
  });

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Favorilerden kaldır
function removeFavorite(index) {
  favorites.splice(index, 1);
  updateFavorites();
}

// Olay dinleyicileri
document.addEventListener("DOMContentLoaded", () => {
  loadWords();
  updateStats();
  updateFavorites();

  // Kart çevirme
  document.querySelector(".card").addEventListener("click", () => {
    document.querySelector(".card").classList.toggle("flipped");
  });

  // Sonraki kelime
  document.getElementById("nextWord").addEventListener("click", showNextWord);

  // Favorilere ekle
  document.getElementById("addFavorite").addEventListener("click", () => {
    const currentWord = dailyWords[currentWordIndex];
    if (!favorites.some((word) => word.english === currentWord.english)) {
      favorites.push(currentWord);
      updateFavorites();
      stats.correctWords++;
      updateStats();
    }
  });

  // Favorileri göster/gizle
  document.getElementById("showFavorites").addEventListener("click", () => {
    const favoritesList = document.getElementById("favoritesList");
    favoritesList.classList.toggle("hidden");
  });

  // İstatistikleri sıfırla
  document.getElementById("resetStats").addEventListener("click", resetStats);
});
