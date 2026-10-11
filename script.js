// ⚠️ GANTI INI dengan URL Google Apps Script kamu (nanti setelah setup)
const SCRIPT_URL = 'https://script.google.com/macros/s/XXXXX/exec';

// Tampilkan tanggal hari ini
const tanggalEl = document.getElementById('tanggal');
const hariIni = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
tanggalEl.textContent = hariIni;

// Handle tombol status
let selectedStatus = '';
const statusBtns = document.querySelectorAll('.status-btn');
const statusInput = document.getElementById('status');

statusBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    statusBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedStatus = btn.dataset.status;
    statusInput.value = selectedStatus;
  });
});

// Handle submit form
const form = document.getElementById('formAbsen');
const submitBtn = document.getElementById('submitBtn');
const pesanEl = document.getElementById('pesan');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const kelas = document.getElementById('kelas').value;
  const keterangan = document.getElementById('keterangan').value.trim();

  if (!nama || !kelas || !selectedStatus) {
    tampilkanPesan('Isi semua kolom dulu ya!', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim...';

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: nama,
        kelas: kelas,
        status: selectedStatus,
        keterangan: keterangan || '-'
      })
    });

    tampilkanPesan(`✅ Absensi ${nama} (${kelas}) berhasil dikirim!`, 'success');
    form.reset();
    statusBtns.forEach(b => b.classList.remove('active'));
    selectedStatus = '';
  } catch (error) {
    tampilkanPesan('❌ Gagal mengirim. Coba lagi ya!', 'error');
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Kirim Absensi';
  }
});

function tampilkanPesan(teks, tipe) {
  pesanEl.textContent = teks;
  pesanEl.className = 'pesan ' + tipe;
  setTimeout(() => {
    pesanEl.className = 'pesan';
  }, 5000);
}
