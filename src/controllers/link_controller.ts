import { Request, Response } from "express";
import { Link } from "../models/matches_links_model";

export const getAllLinks = async (req: Request, res: Response) => {
  try {
    const data = await Link.find({}).populate("fixture");
    return res.status(200).json({ message: "Successful", data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const getFixturesFromLinks = async (req: Request, res: Response) => {
  const { link } = req.body;
  try {
    const data = await Link.find({ link }).populate("fixture");
    if(!data) {
        return res.status(404).json({message: "No data was found with this link"})
    }
    return res.status(200).json({ message: "Successful", data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};
