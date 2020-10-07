const User = require("../../models/user");

const multer = require("multer");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, 'images');
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });

exports.updateImage = (req, res, next) => {

    const url = req.protocol + "://" + req.get("host");

    let imagePath = req.body.imagePath;

    if (req.file) {
        imagePath = "/images/" + req.file.filename
    }

    const user = new User({
        _id: req.body.id,
        imagePath: imagePath,
        active: true
    });

    imagePath = url+imagePath;
    User.update({ _id: req.body.id }, user).then((result)=>{
        res.status(201).json({
            message: "Image Updated Sucessfully!!",
            result: result,
            imagePath: imagePath
        });
    }).catch(err => {
        res.status(400).json({
            message: err
        });
    });
    
}

exports.storage = storage;