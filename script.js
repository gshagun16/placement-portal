// 🔴 CHANGE THIS after deployment
const API = "https://your-backend-url.onrender.com";

let allJobs = [];

/* =======================
   ADD JOB
======================= */
async function addJob() {
  const title = document.getElementById("title").value.trim();
  const company = document.getElementById("company").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!title || !company || !location) {
    alert("All fields required!");
    return;
  }

  await fetch(API + "/api/jobs/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, company, location })
  });

  alert("Job Added!");

  document.getElementById("title").value = "";
  document.getElementById("company").value = "";
  document.getElementById("location").value = "";

  getJobs(); // refresh UI
}

/* =======================
   GET JOBS
======================= */
async function getJobs() {
  const res = await fetch(API + "/api/jobs");
  const data = await res.json();

  allJobs = data;

  const list = document.getElementById("jobsList");
  list.innerHTML = "";

  data.forEach(job => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${job.title}</b> - ${job.company} (${job.location})
      <button onclick="applyJob(${job.id})">Apply</button>
      <button onclick="deleteJob(${job.id})">Delete</button>
    `;

    list.appendChild(li);
  });
}

/* =======================
   APPLY JOB
======================= */
async function applyJob(jobId) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Enter name and email!");
    return;
  }

  await fetch(API + "/api/jobs/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, name, email })
  });

  alert("Applied Successfully!");

  getJobs(); // refresh UI
}

/* =======================
   DELETE JOB
======================= */
async function deleteJob(id) {
  await fetch(API + "/api/jobs/" + id, {
    method: "DELETE"
  });

  alert("Job Deleted!");

  getJobs();
}

/* =======================
   SHOW APPLIED JOBS
======================= */
async function showApplied() {
  await getJobs(); // ensure latest data

  const email = document.getElementById("email").value.trim();

  const list = document.getElementById("appliedList");
  list.innerHTML = "";

  allJobs.forEach(job => {
    if (!job.applicants) return;

    const found = job.applicants.find(a => a.email === email);

    if (found) {
      const li = document.createElement("li");
      li.innerText = `${job.title} - ${job.company}`;
      list.appendChild(li);
    }
  });
}