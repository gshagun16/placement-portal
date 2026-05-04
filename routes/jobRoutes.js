const express = require("express");
const router = express.Router();

const jobController = require("../controllers/jobController");

router.post("/add", jobController.addJob);
router.get("/", jobController.getJobs);
router.post("/apply", jobController.applyJob);
router.get("/applications", jobController.getApplications);

module.exports = router;