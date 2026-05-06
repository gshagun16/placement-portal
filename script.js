function showMsg(text) {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  setTimeout(() => msg.innerText = "", 2000);
}

// Add Job
function addJob() {
  const title = document.getElementById("title").value.trim();
  const company = document.getElementById("company").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!title || !company || !location) {
    showMsg("All fields required!");
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

  showMsg("Job Added!");

  document.getElementById("title").value = "";
  document.getElementById("company").value = "";
  document.getElementById("location").value = "";
}

// Show Jobs + Search + Filter
function getJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const search = document.getElementById("search").value.toLowerCase();
  const locationFilter = document.getElementById("filterLocation").value.toLowerCase();

  const list = document.getElementById("jobsList");
  list.innerHTML = "";

  jobs
    .filter(job =>
      job.title.toLowerCase().includes(search) &&
      job.location.toLowerCase().includes(locationFilter)
    )
    .forEach(job => {
      const li = document.createElement("li");

      li.innerHTML = `
        <b>${job.title}</b> - ${job.company} (${job.location})
        <br>
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
    showMsg("Enter name and email!");
    return;
  }

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.map(job => {
    if (job.id == id) {

      const alreadyApplied = job.applicants.find(a => a.email === email);

      if (alreadyApplied) {
        showMsg("Already applied!");
        return job;
      }

      job.applicants.push({ name, email });
    }
    return job;
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  showMsg("Applied Successfully!");
}

// Delete Job
function deleteJob(id) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.filter(job => job.id != id);

  localStorage.setItem("jobs", JSON.stringify(jobs));

  showMsg("Job Deleted!");
  getJobs();
}

// Show Applied Jobs
function showApplied() {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    showMsg("Enter email first!");
    return;
  }

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
