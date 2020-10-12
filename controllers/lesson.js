const Lesson = require("../models/lesson");

exports.getLessons = (req, res) => {
  Lesson.find()
    .sort("-createdAt")
    .then((dataLesson) => {
      return res.render("lesson/index", {
        title: "Lessons",
        data: dataLesson,
        user: req.user,
      });
    });
};

exports.getLessonsList = (req, res) => {
  Lesson.find()
    .sort("-createdAt")
    .then((dataLesson) => {
      return res.render("lesson/list", {
        title: "Training Center",
        data: dataLesson,
        user: req.user,
      });
    });
};

exports.getAddLesson = (req, res) => {
  return res.render("lesson/add", {
    title: "Add Lesson",
    user: req.user,
    customjs: true,
  });
};

exports.getEditLesson = (req, res) => {
  const lessonId = req.params.id;

  Lesson.findById({ _id: lessonId }).then((dataLesson) => {
    return res.render("lesson/add", {
      title: "Edit Lesson",
      data: dataLesson,
      user: req.user,
      customjs: true,
    });
  });
};

exports.getRincianLesson = (req, res) => {
  const lessonId = req.params.id;

  Lesson.findById({ _id: lessonId }).then((dataLesson) => {
    return res.render("lesson/rincian", {
      title: dataLesson.title,
      data: dataLesson,
      user: req.user,
    });
  });
};

/**
 * POST Method
 */

exports.postAddLesson = (req, res) => {
  const { title, content } = req.body;
  const thumbnail = req.file.path;

  const newLesson = new Lesson();

  newLesson.title = title;
  newLesson.content = content;
  newLesson.thumbnail = thumbnail;

  newLesson.save((err) => {
    if (err) console.log(err);
  });

  return res.redirect("/lesson");
};

exports.postEditLesson = (req, res) => {
  const lessonId = req.params.id;
  const deleteId = req.params.delete;

  const { title, content } = req.body;
  const thumbnail = req.file ? req.file.path : null;

  if (lessonId) {
    Lesson.findById({ _id: lessonId }).then((lessonData) => {
      lessonData.title = title;
      lessonData.content = content;
      if (req.file) {
        lessonData.thumbnail = thumbnail;
      }

      lessonData.save((err) => {
        if (err) console.log(err);
      });

      return res.redirect("/lesson");
    });
  }

  if (deleteId) {
    Lesson.findById({ _id: deleteId }).then((lessonData) => {
      lessonData.remove();
      return res.redirect("/lesson");
    });
  }
};
