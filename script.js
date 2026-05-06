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
    alert("User already exists");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  showMsg("Registered successfully!");
}

function login() {
  const email = authEmail.value;
  const password = authPassword.value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid credentials");
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
  }
}
checkLogin();

// ADD JOB
function addJob() {
  const titleInput = document.getElementById("title");
  const companyInput = document.getElementById("company");
  const locationInput = document.getElementById("location");

  const title = titleInput.value;
  const company = companyInput.value;
  const location = locationInput.value;

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

  // CLEAR INPUTS
  titleInput.value = "";
  companyInput.value = "";
  locationInput.value = "";

  getJobs();
}

// SHOW JOBS
function getJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const search = document.getElementById("search").value.toLowerCase();

  const list = document.getElementById("jobsList");
  list.innerHTML = "";

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search) ||
    j.company.toLowerCase().includes(search)
  );

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

        ${
          applied
            ? `<button onclick="withdrawJob(${job.id})">Withdraw</button>`
            : `<button onclick="applyJob(${job.id})">Apply</button>`
        }
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

  showMsg("Applied successfully!");
  getJobs();
  showApplied();
}

// WITHDRAW (DELETE APPLICATION)
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

  showMsg("Application withdrawn!");
  getJobs();
  showApplied();
}

// SHOW APPLIED JOBS
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
