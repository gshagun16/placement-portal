// MESSAGE
function showMsg(text) {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  setTimeout(() => msg.innerText = "", 2000);
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
}

// LOAD THEME
(function () {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
})();

// AUTH
function register() {
  const name = authName.value;
  const email = authEmail.value;
  const password = authPassword.value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.email === email)) {
    alert("User exists");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  showMsg("Registered!");
}

function login() {
  const email = authEmail.value;
  const password = authPassword.value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid");
    return;
  }

  localStorage.setItem("loggedUser", JSON.stringify(user));
  checkLogin();
}

function logout() {
  localStorage.removeItem("loggedUser");
  location.reload();
}

function checkLogin() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  if (user) {
    authBox.style.display = "none";
    appBox.style.display = "block";
    getJobs();
    showApplied();
    loadCompanies();
  }
}
checkLogin();

// ADD JOB
function addJob() {
  const title = document.getElementById("title").value;
  const company = document.getElementById("company").value;
  const location = document.getElementById("location").value;

  if (!title || !company || !location) {
    alert("Fill all fields");
    return;
  }

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs.push({
    id: Date.now(),
    title,
    company,
    location,
    applicants: []
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  showMsg("Job added!");
  clearInputs();
  getJobs();
  loadCompanies();
}

function clearInputs() {
  title.value = "";
  company.value = "";
  location.value = "";
}

// GET JOBS
function getJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const search = document.getElementById("search").value.toLowerCase();
  const filterCompany = document.getElementById("filterCompany").value;

  const list = document.getElementById("jobsList");
  list.innerHTML = "";

  let filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search) ||
    j.company.toLowerCase().includes(search)
  );

  if (filterCompany !== "all") {
    filtered = filtered.filter(j => j.company === filterCompany);
  }

  if (filtered.length === 0) {
    list.innerHTML = "<p>No jobs found</p>";
    return;
  }

  filtered.forEach(job => {
    const applied = job.applicants.find(a => a.email === user.email);

    const div = document.createElement("div");

    div.innerHTML = `
      <div class="job-card">
        <h3>${job.title}</h3>
        <p><b>${job.company}</b></p>
        <p>${job.location}</p>

        <p>👥 Applicants: ${job.applicants.length}</p>

        ${
          applied
            ? `<button onclick="withdrawJob(${job.id})">Withdraw</button>`
            : `<button onclick="applyJob(${job.id})">Apply</button>`
        }

        <button onclick="editJob(${job.id})">Edit</button>
        <button onclick="deleteJob(${job.id})">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

// APPLY
function applyJob(id) {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.map(job => {
    if (job.id == id) {
      if (!job.applicants.find(a => a.email === user.email)) {
        job.applicants.push(user);
      }
    }
    return job;
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  showMsg("Applied!");
  getJobs();
  showApplied();
}

// WITHDRAW
function withdrawJob(id) {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.map(job => {
    if (job.id == id) {
      job.applicants = job.applicants.filter(a => a.email !== user.email);
    }
    return job;
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));

  showMsg("Withdrawn!");
  getJobs();
  showApplied();
}

// EDIT JOB
function editJob(id) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  const job = jobs.find(j => j.id == id);

  const newTitle = prompt("Edit Title", job.title);
  const newCompany = prompt("Edit Company", job.company);
  const newLocation = prompt("Edit Location", job.location);

  if (!newTitle || !newCompany || !newLocation) return;

  job.title = newTitle;
  job.company = newCompany;
  job.location = newLocation;

  localStorage.setItem("jobs", JSON.stringify(jobs));

  showMsg("Updated!");
  getJobs();
}

// DELETE JOB
function deleteJob(id) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs = jobs.filter(j => j.id != id);

  localStorage.setItem("jobs", JSON.stringify(jobs));

  showMsg("Deleted!");
  getJobs();
  showApplied();
}

// SHOW APPLIED
function showApplied() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  const list = document.getElementById("appliedList");
  list.innerHTML = "";

  jobs.forEach(job => {
    if (job.applicants.find(a => a.email === user.email)) {
      const li = document.createElement("li");
      li.innerText = job.title + " - " + job.company;
      list.appendChild(li);
    }
  });
}

// LOAD COMPANY FILTER
function loadCompanies() {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const select = document.getElementById("filterCompany");

  const companies = [...new Set(jobs.map(j => j.company))];

  select.innerHTML = `<option value="all">All Companies</option>`;

  companies.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.text = c;
    select.appendChild(opt);
  });
}
