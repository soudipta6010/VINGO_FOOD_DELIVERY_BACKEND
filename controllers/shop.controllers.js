import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";

//Create and edit Shop controller
export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      if (!image) {
        return res.status(400).json({ message: "Shop image is required" });
      }

      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      const updateData = {
        name,
        city,
        state,
        address,
        owner: req.userId,
      };

      if (image) {
        updateData.image = image;
      }

      shop = await Shop.findByIdAndUpdate(
        shop._id,
        updateData,
        { new: true }
      );
    }

    await shop.populate("owner items");
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Create shop error ${error}` });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({owner:req.userId}).populate("owner items");
    if(!shop){
      return null;
    }
    return res.status(200).json(shop)
  } catch (error) {
    return res.status(500).json({message: `Get my shop error ${error}`})
  }
};
