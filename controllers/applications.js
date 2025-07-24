const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        res.render('applications/index.ejs', {
            applications: currentUser.applications,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// GET for /new
router.get('/new', async (req, res) => {
    res.render('applications/new.ejs');
});

// POST for /applications'
router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        currentUser.applications.push(req.body);

        await currentUser.save();

        res.redirect(`/users/${currentUser._id}/applications`)
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.get('/:applicationId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const application = currentUser.applications.id(req.params.applicationId);
        res.render('applications/show.ejs', {
            application: application,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// DELETE
router.delete('/:applicationId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        currentUser.applications.id(req.params.applicationId).deleteOne();

        await currentUser.save();
        
        res.redirect(`/users/${currentUser._id}/applications`);

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

// UPDATE
router.get('/:applicationId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render('applications/edit.ejs', {
      application: application,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;