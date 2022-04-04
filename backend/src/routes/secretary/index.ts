import { Router } from "express";

import approveRoute from "./approve";
import deleteAgencyRoute from "./deleteAgency";
import deleteJobOfferRoute from "./deleteJobOffer";
import listRoute from "./listAgencies";

const router = Router();

router.use("/agencies", listRoute);
router.use("/approve", approveRoute);
router.use("/deleteagency", deleteAgencyRoute);
router.use("/deletejoboffer", deleteJobOfferRoute);

export default router;
