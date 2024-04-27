// Create web server
// Create comments
// Read comments
// Update comments
// Delete comments

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Comment = require('../models/Comment');

// @route   POST api/comments
// @desc    Create a comment
// @access  Public
router.post(
  '/',
  [
    check('text', 'Text is required').not().isEmpty(),
    check('article', 'Article is required').not().isEmpty(),
    check('user', 'User is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const newComment = new Comment({
        text: req.body.text,
        article: req.body.article,
        user: req.body.user,
      });

      const comment = await newComment.save();
      res.json(comment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/comments
// @desc    Read all comments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/comments/:id
// @desc    Update a comment
// @access  Public
router.put('/:id', async (req, res) => {
  const { text, article, user } = req.body;

  const commentFields = {};
  if (text) commentFields.text = text;
  if (article) commentFields.article = article;
  if (user) commentFields.user = user;

  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: commentFields },
      { new: true }
    );

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status