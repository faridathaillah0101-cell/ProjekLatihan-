// Membaca parameter undangan dan menyesuaikan tampilan secara personal.
const params = new URLSearchParams(window.location.search);

const guestName = (params.get("to") || "Tamu Undangan").trim();
const categoryParam = (params.get("kategori") || "Undangan").trim();
const institution = (
  params.get("instansi") || "Panitia Edu Fair & Career Day 2026"
).trim();

const categoryMap = {
  universitas: "Universitas",
  kampus: "Universitas",
  perusahaan: "Perusahaan",
  alumni: "Alumni",
  lainnya: "Lainnya",
};

const normalizedCategory =
  categoryMap[categoryParam.toLowerCase()] ||
  categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);

const guestGreeting = document.getElementById("guestGreeting");
const guestInstitution = document.getElementById("guestInstitution");
const guestBadge = document.getElementById("guestBadge");
const registrationCode = document.getElementById("registrationCode");
const senderNameElement = document.getElementById("senderName");

const senderName = (
  params.get("from") || "Panitia Edu Fair & Career Day 2026"
).trim();

if (guestGreeting) {
  guestGreeting.textContent = `Kepada Yth. ${guestName}`;
}
if (guestInstitution) {
  guestInstitution.textContent = institution;
}
if (guestBadge) {
  guestBadge.textContent = `KATEGORI: ${normalizedCategory.toUpperCase()}`;
}
if (registrationCode) {
  const codeSource = guestName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const codePart = codeSource.slice(0, 6) || "GUEST";
  registrationCode.textContent = `EF26-${codePart}`;
}
if (senderNameElement) {
  senderNameElement.textContent = senderName;
}

// Otomatis mengisi form RSVP dari parameter tautan undangan.
const nameInput = document.getElementById("nama");
const institutionInput = document.getElementById("instansi");
const categoryInput = document.getElementById("kategori");

if (nameInput) nameInput.value = params.has("to") ? guestName : "";
if (institutionInput)
  institutionInput.value = params.has("instansi") ? institution : "";
if (categoryInput) {
  const validOptions = ["Universitas", "Perusahaan", "Alumni", "Lainnya"];
  if (validOptions.includes(normalizedCategory)) {
    categoryInput.value = normalizedCategory;
  }
}

// Menangani konfirmasi RSVP tanpa reload dan menyimpannya ke localStorage.
const rsvpForm = document.getElementById("rsvpForm");
const rsvpProof = document.getElementById("rsvpProof");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(rsvpForm);
    const data = {
      nama: formData.get("nama"),
      instansi: formData.get("instansi"),
      kategori: formData.get("kategori"),
      whatsapp: formData.get("whatsapp"),
      status: formData.get("status"),
      jumlah: formData.get("jumlah"),
      dikirimPada: new Date().toISOString(),
    };

    localStorage.setItem("rsvpEduFair2026", JSON.stringify(data));

    document.getElementById("proofName").textContent = data.nama;
    document.getElementById("proofInstitution").textContent = data.instansi;
    document.getElementById("proofCategory").textContent = data.kategori;
    document.getElementById("proofStatus").textContent = data.status;
    document.getElementById("proofAmount").textContent = `${data.jumlah} orang`;
    rsvpProof.hidden = false;
    rsvpProof.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// Memulihkan RSVP terakhir agar bukti tetap terlihat saat halaman dibuka kembali.
const savedRsvp = localStorage.getItem("rsvpEduFair2026");
if (savedRsvp && rsvpProof) {
  try {
    const data = JSON.parse(savedRsvp);
    document.getElementById("proofName").textContent = data.nama;
    document.getElementById("proofInstitution").textContent = data.instansi;
    document.getElementById("proofCategory").textContent = data.kategori;
    document.getElementById("proofStatus").textContent = data.status;
    document.getElementById("proofAmount").textContent = `${data.jumlah} orang`;
  } catch (error) {
    localStorage.removeItem("rsvpEduFair2026");
  }
}
