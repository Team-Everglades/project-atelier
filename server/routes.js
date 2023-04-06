const controller = require('./Controllers/controllers.js');
const router = require('express').Router();
const client = require('./database.js')

// questions
// router.get('/questions', controller.questions.getQuestions);
// router.get('/questions/answers', controller.questions.getAnswers);
// router.put('/questions/answer/helpful', controller.questions.updateHelpfulnessAnswer);
// router.put('/questions/question/helpful',controller.questions.updateHelpfulnessQuestion)
// router.post('/questions/questionId/answer', controller.questions.submitAnswer)
// router.post('/questions/ask', controller.questions.submitQuestion)
// router.put('/answer/report', controller.questions.reportAnswer)

router.get('/questions', (req, res) => {
    console.log('this is questions from server side', req.query.productId)
})

//reviews
router.get('/reviews/:id/:sort', controller.reviews.get);
router.post('/review', controller.reviews.post);
router.get('/meta/:id', controller.reviews.getMeta);
router.put('/reviews/helpful', controller.reviews.markHelpful);
router.put('/reviews/report', controller.reviews.markReported);

//products
router.get('/products', controller.products.get);
router.get('/product/:id/styles', controller.products.getStyle);
router.get('/product/:id/related', controller.products.getRelated);
router.get('/product/:id', controller.products.getOne);
router.post('/cart', controller.products.addCart);
router.get('/cart', controller.products.getCart);

module.exports = router;