import mongoose from "mongoose";

// Branch Schema with Timestamps and Status
const BranchSchema = new mongoose.Schema(
  {
    userid:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    branchdetails: {
      branchcode: {
        type: String,
        required: true,
        unique: true,
      },
      branchname: {
        type: String,
        required: true,
      },
      branchshortname: {
        type: String,
        required: true,
      },
      doorflatno: {
        type: String,
      },
      street: {
        type: String,
      },
      pincode: {
        type: String,
        required: true,
        match: /^[1-9]{1}[0-9]{5}$/, // Match for a valid Indian pincode
      },
      locality: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      panNo: {
        type: String,
        match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN card format
      },
      gstin: {
        type: String,
      },
      branchType: {
        type: String,
        required: true,
      },
      vehicleType: {
        type: [String],
      },
    },
    branchcontactdetails: {
      contactno: {
        type: String,
      },
      alternatecontactno: {
        type: String,
      },
      whatsappno: {
        type: String,
      },
      emailid: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Valid email format
      },
    },

    branchinchargedetails: {
      branchinchargename: {
        type: String,
      },
      contactno: {
        type: String,
      },
      alternatecontactno: {
        type: String,
      },
      whatsappno: {
        type: String,
      },
      emailid: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Valid email format
      },
    },

    contactpersondetails: {
      contactpersonname: {
        type: String,
      },
      contactno: {
        type: String,
      },
      alternatecontactno: {
        type: String,
      },
      whatsappno: {
        type: String,
      },
      emailid: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Valid email format
      },
    },

    openingdetails: {
      openingbalance: {
        type: Number,
        default: 0,
      },
      openingdate: {
        type: Date,
      },
    },

    advancerequestdetails: {
      minimumamount: {
        type: Number,
        default: 0,
      },
      maximumamount: {
        type: Number,
        default: 0,
      },
      monthlymaximumamount: {
        type: Number,
        default: 0,
      },
      maximumunallocatedamount: {
        type: Number,
        default: 0,
      },
      effectivedate: {
        type: Date,
      },
    },

    bankdetails: [
      {
        accountnumber: {
          type: String,
          required: true,
        },
        accountholdername: {
          type: String,
          required: true,
        },
        ifsccode: {
          type: String,
          required: true,
        },
        bankname: {
          type: String,
          required: true,
        },
        branchname: {
          type: String,
          required: true,
        },
      },
    ],

    // New status field
    status: {
      type: Boolean,
      default:true
    },
  },
  { timestamps: true } // Enable timestamps
);

const BranchModel = mongoose.model('Branch', BranchSchema);

export default BranchModel;
