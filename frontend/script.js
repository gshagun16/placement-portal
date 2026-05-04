const API = "http://localhost:5000";
let allJobs = [];

// Add Job
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
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title, company, location })
  });

  alert("Job Added!");

  title.value = "";
  company.value = "";
  location.value = "";
}

// Get Jobs
async function getJobs() {
  const res = await fetch(API + "/api/jobs/");
  const data = await res.json();

  allJobs = data;

  const list = document.getElementById("jobsList");
  list.innerHTML = "";

  data.forEach(job => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${job.title} - ${job.company}
      <button onclick="applyJob(${job.id})">Apply</button>
      <button onclick="deleteJob(${job.id})">Delete</button>
    `;

    list.appendChild(li);
  });
}

// Apply Job
async function applyJob(jobId) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Enter name and email!");
    return;
  }

  await fetch(API + "/api/jobs/apply", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ jobId, name, email })
  });

  alert("Applied Successfully!");
}

// Delete Job
async function deleteJob(id) {
  await fetch(API + "/api/jobs/" + id, {
    method: "DELETE"
  });

  alert("Job Deleted!");
  getJobs();
}

// Show Applied Jobs
function showApplied() {
  const email = document.getElementById("email").value;

  const list = document.getElementById("appliedList");
  list.innerHTML = "";

  allJobs.forEach(job => {
    if (!job.applicants) return;

    const found = job.applicants.find(a => a.email === email);

    if (found) {
      const li = document.createElement("li");
      li.innerText = job.title + " - " + job.company;
      list.appendChild(li);
    }
  });
}