import { Client } from "../models/client.models.js";
import { User } from "../models/user.models.js";

const saveClients = async (req, res) => {
  try {
    const { fullName, age, targetingPrice, isActive } = req.body;

    if (!fullName || !age || !targetingPrice) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const totalPayByClient = targetingPrice * 0.6;
    const totalPayByCompany = targetingPrice - totalPayByClient;

    let payingYearByClient = 0;
    let payingYearByCompany = 0;

    if (targetingPrice < 500000) {
      payingYearByClient = 6;
      payingYearByCompany = 2;
    } else if (targetingPrice >= 500000 && targetingPrice < 1000000) {
      payingYearByClient = 8;
      payingYearByCompany = 6;
    } else if (targetingPrice >= 1000000 && targetingPrice < 2000000) {
      payingYearByClient = 12;
      payingYearByCompany = 8;
    } else if (targetingPrice >= 2000000) {
      payingYearByClient = 20;
      payingYearByCompany = 5;
    }

    const clientPayPerYear = Math.floor(
      (totalPayByClient / payingYearByClient).toFixed(2)
    );
    const companyPayPerYear = Math.floor(
      (totalPayByCompany / payingYearByCompany).toFixed(2)
    );
    const remainingAmount =
      targetingPrice -
      (clientPayPerYear * payingYearByClient +
        companyPayPerYear * payingYearByCompany);

    const client = new Client({
      fullName,
      age,
      targetingPrice,
      isActive,
      totalPayByClient,
      totalPayByCompany,
      payingYearByClient,
      payingYearByCompany,
      clientPayPerYear,
      companyPayPerYear,
      remainingAmount,
      owner: req.user._id,
    });
    const savedClient = await client.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { clients: savedClient._id },
    });
    res.status(201).json({ message: "Client saved successfully", savedClient });
  } catch (error) {
    res.status(500).json({ message: "can't save your client" });
  }
};

const fetchClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const clientDetails = {
      fullName: client.fullName,
      age: client.age,
      targetingPrice: client.targetingPrice,
      isActive: client.isActive,
      totalPayByClient: client.totalPayByClient,
      totalPayByCompany: client.totalPayByCompany,
      payingYearByClient: client.payingYearByClient,
      payingYearByCompany: client.payingYearByCompany,
      clientPayPerYear: client.clientPayPerYear,
      companyPayPerYear: client.companyPayPerYear,
      remainingAmount: client.remainingAmount,
    };

    res
      .status(200)
      .json({ message: "client fetched Successfully", clientDetails });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error });
  }
};



const getClients = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    const clients = await Client.find({ owner: req.user._id });
    res
      .status(200)
      .json({ message: "Clients retrieved successfully", clients });
  } catch (error) {
    res.status(500).json({ message: "can't retrieved clients" });
  }
};

const deleteClient = async (req, res) => {
  try {
    const userId = req.user._id;
    const clientId = req.params.id;
    const deletedClient = await Client.findOneAndDelete({
      _id: clientId,
      owner: userId,
    });

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { clients: clientId },
    });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Client not found", error: error.message });
  }
};

export { saveClients, getClients, deleteClient, fetchClient };
