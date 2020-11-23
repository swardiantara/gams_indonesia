const Tool = require("../models/tool");
require("dotenv").config();

exports.getTools = (req, res) => {
  Tool.find({
    category: {
      $in: ['photo', 'video', 'copywriting']
    }
  })
    .sort("-createdAt")
    .then((dataTool) => {
      return res.render("tool/index", {
        title: "Tools",
        data: dataTool,
        user: req.user,
      });
    });
};

exports.getNews = (req, res) => {
  Tool.find()
    .sort("-createdAt")
    .then((dataTool) => {
      return res.render("tool/index", {
        title: "Tools",
        data: dataTool,
        user: req.user,
      });
    });
};

// exports.getTools = (req, res) => {
//   Tool.find()
//     .sort("-createdAt")
//     .then((dataTool) => {
//       return res.render("tool/index", {
//         title: "Tools",
//         data: dataTool,
//         user: req.user,
//       });
//     });
// };

exports.getToolsByCategory = (req, res) => {
  const paramsId = req.params.id;
  if (paramsId == 'landing-page') {
    return res.render("tool/landingpage", {
      title: "Tools",
      user: req.user,
      data: {
        url: process.env.APP_URL
      }
    })
  } else if (paramsId == 'photo') {
    Tool.find({ category: paramsId })
      .sort("-createdAt")
      .then((dataTool) => {
        return res.render("tool/list", {
          title: "Tools",
          data: dataTool,
          photo: true,
          user: req.user,
        });
      });
  } else {
    Tool.find({ category: paramsId })
      .sort("-createdAt")
      .then((dataTool) => {
        return res.render("tool/list", {
          title: "Tools",
          data: dataTool,
          user: req.user,
        });
      });
  }
};

exports.getAddTool = (req, res) => {
  return res.render("tool/add", {
    title: "Add Tool",
    user: req.user,
    customjs: true,
    baseURL: process.env.APP_URL
  });
};

exports.getAddToolPhoto = (req, res) => {
  return res.render("tool/addphoto", {
    title: "Add Tool",
    user: req.user,
    customjs: true,
    baseURL: process.env.APP_URL
  });
};

exports.getEditTool = (req, res) => {
  const toolId = req.params.id;
  if (toolId == 'photo') {
    Tool.findById({ _id: toolId }).then((dataTool) => {
      return res.render("tool/add", {
        title: "Edit Tool",
        data: dataTool,
        user: req.user,
        photo: true,
        customjs: true,
      });
    });
  } else {
    Tool.findById({ _id: toolId }).then((dataTool) => {
      return res.render("tool/add", {
        title: "Edit Tool",
        data: dataTool,
        user: req.user,
        customjs: true,
      });
    });
  }
};

exports.getRincianTool = (req, res) => {
  const toolId = req.params.id;

  Tool.findById({ _id: toolId }).then((dataTool) => {
    return res.render("tool/rincian", {
      title: dataTool.title,
      data: dataTool,
      user: req.user,
    });
  });
};

/**
 * POST Method
 */

exports.postAddTool = (req, res, next) => {
  const { title, content, category } = req.body;
  let thumbnail;
  let gallery = [];
  if (category == 'photo') {
    if (req.files) {
      gallery = req.files.map((file) => file.path);
    }
  } else {
    thumbnail = req.file ? req.file.path : null;
  }

  const newTool = new Tool();
  newTool.title = title;
  newTool.content = content;
  newTool.category = category;
  newTool.thumbnail = thumbnail;
  if (req.files) {
    newTool.gallery = gallery;
    next();
  }

  newTool.save((err) => {
    if (err) console.log(err);
  });

  return res.redirect("/tool");
};

exports.postEditTool = (req, res) => {
  const toolId = req.params.id;
  const deleteId = req.params.delete;

  const { title, content, category } = req.body;
  const thumbnail = req.file ? req.file.path : null;

  if (toolId) {
    Tool.findById({ _id: toolId }).then((dataTool) => {
      dataTool.title = title;
      dataTool.content = content;
      dataTool.category = category;

      if (req.file) {
        dataTool.thumbnail = thumbnail;
      }

      dataTool.save((err) => {
        if (err) console.log(err);
      });

      return res.redirect("/tool");
    });
  }

  if (deleteId) {
    Tool.findById({ _id: deleteId }).then((dataTool) => {
      dataTool.remove();
      return res.redirect("/tool");
    });
  }
};
