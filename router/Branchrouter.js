// Import necessary modules
import express from "express";
import BranchModel from "../models/Branch.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import XLSX from "xlsx"
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../lib/multer.js"
const router = express.Router();



router.post('/upload', upload.single('file'), authMiddleware, async (req, res) => {
    try {
      const { file } = req;
  
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
  
      // Read the uploaded Excel file
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      // Iterate over the extracted data and save it to the database
      for (const data of jsonData) {
        const branch = new BranchModel({
          userid: req.user.id, // Assuming `req.user.id` is available from authMiddleware
          branchdetails: {
            branchcode: data.branchcode || "", 
            branchname: data.branchname || "",
            branchshortname: data.branchshortname || "",
            doorflatno: data.doorflatno || "",
            street: data.street || "",
            pincode: data.pincode || "",
            locality: data.locality || "",
            city: data.city || "",
            state: data.state || "",
            panNo: data.panNo || "",
            gstin: data.gstin || "",
            branchType: data.branchType || "Head Quarters", // Default value if not provided
            vehicleType: data.vehicleType || [], // Directly use the array from data
          },
          branchcontactdetails: {
            contactno: data.contactno || "",
            alternatecontactno: data.alternatecontactno || "",
            whatsappno: data.whatsappno || "",
            emailid: data.emailid || "",
          },
          branchinchargedetails: {
            branchinchargename: data.branchinchargename || "",
            contactno: data.branchinchargecontactno || "",
            alternatecontactno: data.branchinchargealternatecontactno || "",
            whatsappno: data.branchinchargewhatsappno || "",
            emailid: data.branchinchargeemailid || "",
          },
          contactpersondetails: {
            contactpersonname: data.contactpersonname || "",
            contactno: data.contactpersoncontactno || "",
            alternatecontactno: data.contactpersonalternatecontactno || "",
            whatsappno: data.contactpersonwhatsappno || "",
            emailid: data.contactpersonemailid || "",
          },
          openingdetails: {
            openingbalance: data.openingbalance || "",
            openingdate: data.openingdate || "",
          },
          advancerequestdetails: {
            minimumamount: data.minimumamount || "",
            maximumamount: data.maximumamount || "",
            monthlymaximumamount: data.monthlymaximumamount || "",
            maximumunallocatedamount: data.maximumunallocatedamount || "",
            effectivedate: data.effectivedate || "",
          },
          bankdetails: data.bankdetails || [], // Assuming bankdetails could be an array of objects
          status: true, // Default status
        });
  
        // Save the branch details to the database
        await branch.save();
        console.log(branch)
      }

      
  
      // Remove the file from the server after processing
      fs.unlinkSync(file.path);
  
      res.json({ message: 'File uploaded and data extracted successfully', data: jsonData });
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ message: 'Server error while processing file' });
    }
  });
// Endpoint: Download data as Excel using ExcelJS
router.get("/download-excel", authMiddleware, async (req, res) => {
  try {
    const branches = await BranchModel.find({userid:req.user.id});

    if (branches.length === 0) {
      return res.status(404).json({ message: "No branch data found to download." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BranchDetails");

    worksheet.addRow(Object.keys(branches[0].toObject()));
    branches.forEach((branch) => {
      worksheet.addRow(Object.values(branch.toObject()));
    });

    const filePath = path.join("./uploads", "BranchDetails.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, "BranchDetails.xlsx", (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      fs.unlinkSync(filePath); // Clean up file
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Failed to generate Excel file", error });
  }
});

// CRUD Endpoints for Branches
router.post("/branches", authMiddleware, async (req, res) => {
  try {
    const branch = new BranchModel({
      userid: req.user.id,
      ...req.body,
    });
    await branch.save();
    res.status(201).json(branch);
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(400).json({ message: "Error creating branch", error });
  }
});

router.get("/branches", authMiddleware, async (req, res) => {
  try {
    const branches = await BranchModel.find({userid:req.user.id});
    res.status(200).json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Error fetching branches", error });
  }
});

router.put("/branches/:id", async (req, res) => {
  try {
    const updatedBranch = await BranchModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(400).json({ message: "Error updating branch", error });
  }
});

router.delete("/branches/:id",  async (req, res) => {
  try {
    const branch = await BranchModel.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).json({ message: "Error deleting branch", error });
  }
});

export default router;
