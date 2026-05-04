const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ Temporary in-memory DB (resets on restart)
let jobs = [];

/* =======================
   ADD JOB
======================= */
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

  res.json({ message: "Job added successfully", job });
});

/* =======================
   GET ALL JOBS
======================= */
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

/* =======================
   APPLY JOB
======================= */
app.post("/api/jobs/apply", (req, res) => {
  const { jobId, name, email } = req.body;

  if (!jobId || !name || !email) {
    return res.status(400).json({ message: "All fields required" });
  }

  const job = jobs.find(j => j.id == jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // prevent duplicate application
  const alreadyApplied = job.applicants.find(a => a.email === email);

  if (alreadyApplied) {
    return res.status(400).json({ message: "Already applied" });
  }

  job.applicants.push({ name, email });

  res.json({ message: "Applied successfully" });
});

/* =======================
   DELETE JOB
======================= */
app.delete("/api/jobs/:id", (req, res) => {
  const id = req.params.id;

  jobs = jobs.filter(job => job.id != id);

  res.json({ message: "Job deleted successfully" });
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});