const Razorpay = require('razorpay')
const razorpayInstance = new Razorpay({
    // key_id: 'rzp_test_YW49ucyVtjePLT',//developmet
    key_id:'rzp_live_nmEtTvImeXIvf7',//production
    // key_secret: 'FFn6tCkoKKQxfdvPCFuiijRE', //developmet
    key_secret:'u4QbAJziwXhGYmdFWamz2KkZ',//production
    course_payment:'FPs-kRnkuFXq8tG-course-Payment',
    custom_packages:'bq3es79LTfQn.SH-custom-package',
})

module.exports = razorpayInstance;