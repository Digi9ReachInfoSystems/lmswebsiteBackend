var express = require("express");
const zoomController = require("../controllers/zoomController");
const router = express.Router();

router.get("/healthCheck", zoomController.healthCheck);
router.post("/zoomuserinfo", zoomController.zoomuserinfo);
router.post("/createZoomMeeting", zoomController.createZoomMeeting);
router.get("/getMeetingParticipants", zoomController.getMeetingParticipants);
router.get("/getMeetingById/:id", zoomController.getMeetingById);
router.post("/generateSignature", zoomController.generateZoomSignature);

module.exports = router;
