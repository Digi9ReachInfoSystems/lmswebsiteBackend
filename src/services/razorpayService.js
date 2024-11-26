const Razorpay = require('razorpay')
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_YW49ucyVtjePLT',
    key_secret: 'FFn6tCkoKKQxfdvPCFuiijRE',
    course_payment:'FPs-kRnkuFXq8tG-course-Payment'
})

module.exports = razorpayInstance;