const express = require("express");
const router = express.Router();
const customerQueryController = require("../controllers/customerQueryController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.post(
  "/createQuery",

  customerQueryController.sendCustomerQuery
);

router.get(
  "/",
  authMiddleware,

  authorizeRole("admin"),
  customerQueryController.getAllQueries
);

router.put(
  "/:queryId",
  authMiddleware,
  authorizeRole("admin"),
  customerQueryController.updateQueryStatus
);
// Route to get a single query by ID
router.get("/query/:id", customerQueryController.getQueryById);

module.exports = router;
