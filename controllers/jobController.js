let jobs = [];

// Add Job
exports.addJob = (req, res) => {
  const { title, company, location } = req.body;

  const job = {
    id: Date.now(),
    title,
    company,
    location,
    applicants: []
  };

  jobs.push(job);
  res.json({ message: "Job added successfully", job });
};

// Get Jobs
exports.getJobs = (req, res) => {
  res.json(jobs);
};

// Apply Job
exports.applyJob = (req, res) => {
  const { jobId, name, email } = req.body;

  const job = jobs.find(j => j.id == jobId);

  if (!job) {
    return res.json({ message: "Job not found" });
  }

  job.applicants.push({ name, email });

  res.json({ message: "Applied successfully", job });
};

// Get Applications
exports.getApplications = (req, res) => {
  const email = req.query.email;

  let appliedJobs = [];

  jobs.forEach(job => {
    job.applicants.forEach(app => {
      if (app.email === email) {
        appliedJobs.push({
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location
        });
      }
    });
  });

  res.json(appliedJobs);
};