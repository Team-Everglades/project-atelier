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
    let productId = req.query.productId;
    // console.log('THIS IS PROD.ID', productId)
    client.query(`
        SELECT question_id, question_body, question_date, asker_name, question_helpfulness 
        FROM questions
        WHERE product_id = $1 
        ORDER BY question_date DESC 
        LIMIT 100;
    `, [productId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error executing query');
        } else {
            // console.log('Query:', result.rows);
            res.send(result.rows);
        }
    });
});

router.get('/questions/answers', (req, res) =>{
    // console.log('get answer req from server side', req.query.questionId)
    let questionId = req.query.questionId
    client.query(`
    SELECT id, answer_body, answer_date, answerer_name, answer_helpfulness
    FROM answers
    WHERE question_Id = $1 
    ORDER BY answer_date DESC 
    LIMIT 100;
    `,[questionId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error executing query');
        } else {
            // console.log('ANSWERS:', result.rows);
            res.send(result.rows);
        }
    })
})

router.put('/questions/answer/helpful', (req, res) => {
    // console.log('answer helpful req on serverside', req.body.params.answerId)
    let answerId = req.body.params.answerId
    client.query(`
        UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1
    `,[answerId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error executing query');
        } else {
            // console.log('ANSWER HELPFUL SERVER SIDE:', result)
            res.send(result);
        }
    })
})

router.put('/questions/question/helpful', (req, res) =>{
    // console.log('QUESTION HELPFUL SERVER SIDE: ', req.body.params.questionId)
    let questionId = req.body.params.questionId
    client.query(`
        UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_Id = $1
    `,[questionId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error executing query');
        } else {
            // console.log('ANSWER HELPFUL SERVER SIDE:', result)
            res.send(result);
        }
    })
})

router.post('/questions/questionId/answer', (req,res) => {
    console.log('POSTING ANSWER SERVER SIDE: ', req.body.params)
    let question_id = req.body.params.question_id
    let answer_body = req.body.params.body
    let answerer_name = req.body.params.name
    let answerer_email = req.body.params.email
    let photos = req.body.params.photos
    let answer_date = new Date().getTime()
    let reported = 0
    let answer_helpfulness = 0

    client.query(`
    INSERT INTO answers (question_id, answer_body, answerer_name, answerer_email, answer_date, reported, answer_helpfulness)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
`,[question_id, answer_body, answerer_name, answerer_email, answer_date, reported, answer_helpfulness], (err, result) => {
    if (err) {
        console.error('Error inserting answer:', err);
        res.sendStatus(500);
        return;
    }

    let answer_id = result.rows[0].id

    if (photos && photos.length > 0) {
        let values = photos.map((url) => `(${answer_id}, '${url}')`).join(',');
        client.query(`
        INSERT INTO answers_photos (answer_id, url)
        VALUES ${values};
        `, (err) => {
            if (err) {
                console.error('Error inserting answer photos:', err);
                res.sendStatus(500);
                return;
            }
            
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(200);
    }
});
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