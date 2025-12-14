const presets = {
  telur: [
    { name: "Telur Rebus Lembut", time: 300, desc: "kuning telur setengah matang"},
    { name: "Telur Rebus Medium", time: 420, desc: "Kuning telur hampir matang" },
    { name: "Telur Rebus Keras", time: 600, desc: "Kuning telur matang sempurna" },
    { name: "Telur Ceplok", time: 10, desc: "Telur mata sapi" },
    { name: "Telur Dadar", time: 240, desc: "Telur dadar biasa" },
    { name: "Omelet", time: 300, desc: "Omelet dengan isian" }
  ],

  oven: [
    { name: "Cupcake", time: 1200, desc: "Kue kecil panggang" },
    { name: "Pizza", time: 900, desc: "Pizza ukuran sedang" },
    { name: "Roti Tawar", time: 1800, desc: "Roti panggang" },
    { name: "Cookies", time: 600, desc: "Kue kering" },
    { name: "Brownies", time: 1500, desc: "Brownies coklat" },
    { name: "Ayam Panggang", time: 2700, desc: "Ayam panggang" }
  ],

  rebus: [
    { name: "Mie Instan", time: 180, desc: "Mie rebus cepat" },
    { name: "Nasi", time: 900, desc: "Nasi putih" },
    { name: "Kentang Rebus", time: 900, desc: "Kentang utuh rebus" },
    { name: "Sayuran", time: 300, desc: "Brokoli/kembang kol" },
    { name: "Jagung Rebus", time: 600, desc: "Jagung manis rebus" },
    { name: "Roti Kukus", time: 900, desc: "Bakpao / roti kukus" }
  ],

  lainnya: [
    { name: "Teh / Kopi", time: 180, desc: "Seduh teh atau kopi" },
    { name: "Mendidihkan Air", time: 600, desc: "Air mendidih (1L)" },
    { name: "Mengukus", time: 900, desc: "Mengukus makanan" },
    { name: "Marinasi Cepat", time: 600, desc: "Marinasi daging" },
    { name: "Slow Cook", time: 7200, desc: "Masak perlahan" },
    { name: "Yogurt Ferment", time: 28800, desc: "Fermentasi yogurt" }
  ]
};

// ambil elemen html
const tabs = document.querySelectorAll("#tab-content .tab");
const dataCategory = document.getElementById("data-category");

// klik tab
tabs.forEach(tab => {
  tab.addEventListener("click", function () {

    tabs.forEach(t => t.classList.remove("tab-active"));
    this.classList.add("tab-active");

    const kategori = this.getAttribute("kategori");
    tampilkanPreset(kategori);
  });
});

// fungsi tampil data
function tampilkanPreset(kategori) {
  const items = presets[kategori];

  if (!items) {
    dataCategory.innerHTML = `<p class="info-kategori">Tidak ada data makanan yg tersedia.</p>`;
    return;
  }

  let tampilkan = "";

  items.forEach(item => {
    tampilkan += `
      <div class="item-preset">
        <div class="info">
          <h4>${item.name}</h4>
          <p>${item.desc}</p>
          <button class="set-timer-btn" data-time="${item.time}">
            Pilih ${Math.floor(item.time / 60)} mnt
          </button>
        </div>
      </div>
    `;
  });

  dataCategory.innerHTML = tampilkan;

  // pasang event listener click setiap preset tampil
  const buttons = document.querySelectorAll(".set-timer-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {

      if (isRunning || dijeda == true) {
        Swal.fire({
          title: 'Info',
          theme: 'dark',
          text: 'Hentikan atau reset timer terlebih dahulu untuk memilih preset lain.',
          icon: 'info',
          confirmButtonText: 'OK'
        })
        return;
      }

      const waktu = Number(this.getAttribute("data-time"));
      totalSeconds = waktu;
      updateTimerDisplay();
    });
  });
}

// tampilan awal pas buka web
dataCategory.innerHTML = `
  <p class="info-kategori">
    Silahkan pilih kategori preset makanan di atas.
  </p>
`;

// timer
// ambil elemen untuk timernya
const timerDisplay = document.getElementById("timer");
const timerStatus = document.getElementById("timer-status");
const startBtn = document.getElementById("start-button");
const stopBtn = document.getElementById("stop-button");
const resetBtn = document.getElementById("reset-button");
const alarmSound = document.getElementById("alarmSound");

// state
let timerInterval = null;
let totalSeconds = 0; // sisa waktu
let isRunning = false; // buat penanda timer lagi running
let hasStarted = false; // buat penanda timer pernah dimulai
let dijeda = false; // state untuk tanda dijeda

// update tampilan waktu
function updateTimerDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timerDisplay.innerHTML =
  `${String(hours).padStart(2, "0")}:` +
  `${String(minutes).padStart(2, "0")}:` +
  `${String(seconds).padStart(2, "0")}`;
}

// mulai hitung mundur
function startTimer() {
  if (totalSeconds === 0) {
    Swal.fire({
      title: 'Pilih preset makanan',
      theme: 'dark',
      text: 'Silahkan pilih preset makanan yang tersedia sebelum memulai timer.',
      icon: 'warning',
      confirmButtonText: 'OK'
    })
    return;
  }

  if (isRunning) return;

  hasStarted = true
  dijeda = false;
  isRunning = true;
  timerStatus.innerHTML = "sedang berjalan...";

  timerInterval = setInterval(() => {
    totalSeconds--;
    updateTimerDisplay();

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      timerStatus.textContent = "Selesai";
      alarmSound.play();
    }
  }, 1000);
}

// jeda timer
function jedaTimer() {
  if (!hasStarted) {
    Swal.fire({
      title: 'Start dulu dong',
      theme: 'dark',
      text: 'yang mau dijeda apa? timer aja blom di start.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return;
  }

  // stop alarm
  alarmSound.pause();
  alarmSound.currentTime = 0; 

  clearInterval(timerInterval);
  isRunning = false;
  dijeda = true;
  timerStatus.innerHTML = "Dijeda";
};

// reset timer
function resetTimer() {
  if (!hasStarted) {
    Swal.fire({
      title: 'Start dulu dong',
      theme: 'dark',
      text: 'yang mau direset apa? timer aja blom di start.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return;
  }

  clearInterval(timerInterval);
  isRunning = false;
  hasStarted = false;
  dijeda = false;
  totalSeconds = 0;

  updateTimerDisplay();
  timerStatus.innerHTML = "";

  alarmSound.pause();
  alarmSound.currentTime = 0; 
};

// add event listener untuk button start, jeda, and reset
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", jedaTimer);
resetBtn.addEventListener("click", resetTimer);