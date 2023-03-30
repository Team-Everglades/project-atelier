const axios = require('axios');
const config = require('../../config.js');
const path = require('path');

let reviewsModel = {
  url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews',
  headers: { 'Authorization' : config.TOKEN},
  getReviews: ( params ) => {
    const options = {
      url: reviewsModel.url,
      headers: reviewsModel.headers,
      params: {count: 1000, ...params},
      //an object with at least a product_id key but can include sort options
    }
    return axios(options)
  },
  postReview: ( data ) => {
    const options = {
      method: 'post',
      url: reviewsModel.url,
      headers: reviewsModel.headers,
      data: data
      //object should include: product_id, rating (1-5), summary, body, recommend(bool), name, email, photos(array), characteristics(obj)
    }
    return axios(options)
  },
  getMeta: ( params ) => {
    const options = {
      url: path.join(reviewsModel.url, '/meta'),
      headers: reviewsModel.headers,
      params: params
      //should be an object with a product_id key
    }
    return axios(options)
  },
  markHelpful: ( data ) => {
    const options = {
      method: 'put',
      url: path.join(reviewsModel.url, data.review_id.toString(), '/helpful'),
      headers: reviewsModel.headers,
      data: data
      //should be an object with a product_id key
    }
    return axios(options)
  },
  markReported: ( data ) => {
    const options = {
      method: 'put',
      url: path.join(reviewsModel.url, data.review_id.toString(), '/report'),
      headers: reviewsModel.headers,
      data: data
     //should be an object with a product_id key
    }
    return axios(options)
  },
  addNewPhoto: ( formData ) => {
    return;
  }
}

module.exports = reviewsModel;