const Razorpay = require('razorpay')
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_YW49ucyVtjePLT',
    key_secret: 'FFn6tCkoKKQxfdvPCFuiijRE',
    course_payment:'FPs-kRnkuFXq8tG-course-Payment',
    custom_packages:'bq3es79LTfQn.SH-custom-package',
})

module.exports = razorpayInstance;