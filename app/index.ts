import { Request, Response } from "express";

const tool = (req: Request, res: Response) => {
  return res.json({
    status: "ok",
    key: req.params.key,
    link: "",
  });
};

export default tool;
