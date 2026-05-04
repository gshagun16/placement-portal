const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let jobs = [];

// Add Job
app.post("/api/jobs/add", (req, res) => {
  const { title, company, location } = req.body;

  if (!title || !company || !location) {
    return res.status(400).json({ message: "All fields required" });
  }

  const job = {
    id: Date.now(),
    title,
    company,
    location,
    applicants: []
  };

  jobs.push(job);
  res.json({ message: "Job added", job });
});

// Get Jobs
app.get("/api/jobs/", (req, res) => {
  res.json(jobs);
});

// Apply Job
app.post("/api/jobs/apply", (req, res) => {
  const { jobId, name, email } = req.body;

  const job = jobs.find(j => j.id == jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  job.applicants.push({ name, email });

  res.json({ message: "Applied successfully" });
});

// Delete Job
app.delete("/api/jobs/:id", (req, res) => {
  const id = req.params.id;

  jobs = jobs.filter(job => job.id != id);

  res.json({ message: "Job deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});