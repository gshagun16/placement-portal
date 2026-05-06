// Add Job
function addJob() {
  const title = document.getElementById("title").value.trim();
  const company = document.getElementById("company").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!title || !company || !location) {
    alert("All fields required!");
    return;
  }

  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs.push({
    id: Date.now(),
    title,
    company,
    location,
    applicants: []
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  alert("Job Added!");
}

// Show Jobs
function getJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  const list = document.getElementById("jobsList");
  list.innerHTML = "";

  jobs.forEach(job => {
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
function applyJob(id) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Enter name and email!");
    return;
  }

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.map(job => {
    if (job.id == id) {
      job.applicants.push({ name, email });
    }
    return job;
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  alert("Applied!");
}

// Delete Job
function deleteJob(id) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.filter(job => job.id != id);

  localStorage.setItem("jobs", JSON.stringify(jobs));

  getJobs();
}

// Show Applied
function showApplied() {
  const email = document.getElementById("email").value.trim();

  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  const list = document.getElementById("appliedList");
  list.innerHTML = "";

  jobs.forEach(job => {
    const found = job.applicants.find(a => a.email === email);

    if (found) {
      const li = document.createElement("li");
      li.innerText = job.title + " - " + job.company;
      list.appendChild(li);
    }
  });
}
