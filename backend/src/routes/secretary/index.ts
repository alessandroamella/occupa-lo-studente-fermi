import { Router } from "express";

import approveRoute from "./approve";
import checkCredentialsRoute from "./checkCredentials";
import deleteAgencyRoute from "./deleteAgency";
import deleteJobOfferRoute from "./deleteJobOffer";
import editStudentsRoute from "./editStudent";
import listRoute from "./listAgencies";
import studentsRoute from "./students";

const router = Router();

router.use("/check-credentials", checkCredentialsRoute);
router.use("/agencies", listRoute);
router.use("/students", studentsRoute);
router.use("/student", editStudentsRoute);
router.use("/approve", approveRoute);
router.use("/agency", deleteAgencyRoute);
router.use("/joboffer", deleteJobOfferRoute);

export default router;
