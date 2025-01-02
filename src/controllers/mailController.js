const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Subject = require("../models/subjectModel");
const Batch = require("../models/batchModel");
const Quiz = require("../models/quizModel");
const Assignment = require("../models/assignmentModel");
const {
    teacherApplicationRecievedAdmin,
    teacherApplicationRecieved,
    studentSignUpAdmin,
    createUser,
    studentPaymentRecievedAdmin,
    studentPaymentRecievedStudent,
    customerQueryAdmin,
    customerQueryCustomer,
    newMeetingcreated,
    login,
    approveApplication,
    loginAdmin,
} = require("../mailTemplate/mailTemplates");
const { sendMailFunctionAdmin, sendMailFunctionTA } = require("../Mail/sendMail");
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const UserNotification = require('../models/userNotificationModel'); // Optional: For tracking read status


exports.applicationRecievedAdmin = async (req, res) => {
    try {
        const { name, email } = req.body;
        const html = teacherApplicationRecievedAdmin(name, email);

        const users = await User.find({ role: "admin" });
        users.map(async (user) => {
            const notification = new Notification({
                user_id: user._id,
                message: 'Application Recieved',
                title: "Teacher Application Recieved",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: user._id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
            await sendMailFunctionAdmin(user.email, 'Teacher Application Recieved', html);

        })


        res.status(200).json({ message: 'Application Recieved Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.applicationRecievedTeacher = async (req, res) => {
    try {
        const { name, email } = req.body;
        const html = teacherApplicationRecieved(name);
        await sendMailFunctionTA(email, 'Application Recieved', html);
        res.status(200).json({ message: 'Application Recieved Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.studentSignedUpAdmin = async (req, res) => {
    try {
        const { name, email } = req.body;
        const html = studentSignUpAdmin(name, email);
        const users = await User.find({ role: "admin" });
        users.map(async (user) => {

            const notification = new Notification({
                user_id: user._id,
                message: 'New Student SignUp',
                title: "New Student User Created",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: user._id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
            await sendMailFunctionAdmin(user.email, 'Student Signed UP', html);

        })
        res.status(200).json({ message: 'Student Signed UP Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.studentAccountCreated = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const html = createUser(name, email, password);
        await sendMailFunctionTA(email, 'User Account Created', html);
        res.status(200).json({ message: 'Student  Account Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.teacherApplicationApproved = async (req, res) => {
    try {
        const { name, email, microsoft_email, password } = req.body;
        const html = approveApplication(name, microsoft_email, password);
        await sendMailFunctionTA(email, 'Teacher Application Approved', html);
        res.status(200).json({ message: 'Teacher Application Approved Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.subscriptionDoneAdmin = async (req, res) => {
    try {
        const { name, email, Amount, payment_id } = req.body;
        const users = await User.find({ role: "admin" });
        users.map(async (user) => {
        
            const notification = new Notification({
                user_id:user._id,
                message: 'Student Payment Recieved',
                title: "Amount Recieved",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: user._id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
            const html = studentPaymentRecievedAdmin(name, email, Amount, payment_id);
            await sendMailFunctionAdmin(user.email, 'Subscription Done', html);
        })
        
        res.status(200).json({ message: 'Subscription Done Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.subscriptionDoneStudent = async (req, res) => {
    try {
        const { name, email, Amount, payment_id } = req.body;
        const html = studentPaymentRecievedStudent(name, email, Amount, payment_id);
        await sendMailFunctionTA(email, 'Subscription Done', html);
        res.status(200).json({ message: 'Subscription Done Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.customerQueryAdmin = async (req, res) => {
    try {
        const { name, email } = req.body;
        const users = await User.find({ role: "admin" });
        users.map(async (user) => {
            const notification = new Notification({
                user_id: user._id,
                message: 'Customer Query Recieved',
                title: "Customer Query Recieved",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id:user._id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
            const html = customerQueryAdmin(name, email);
            await sendMailFunctionAdmin(user.email, 'Customer Query', html);

        })
        
        res.status(200).json({ message: 'Customer Query Sent Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.customerQuery = async (req, res) => {
    try {
        const { name, email } = req.body;
        const html = customerQueryCustomer(name, email);
        await sendMailFunctionTA(email, 'Customer Query', html);
        res.status(200).json({ message: 'Customer Query Sent Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.circularCreatedAdmin = async (req, res) => {
    try {
        const { role } = req.body;
        if (role === 'student') {
            const students = await Student.find();
            students.map(async (student) => {
                const notification = new Notification({
                    user_id: student.user_id,
                    message: 'circular created',
                    title: "New circular",
                    is_all: false,
                });
                const savedNotification = await notification.save();
                const userNotifications = new UserNotification({
                    user_id: student.user_id,
                    notification_id: savedNotification._id
                })
                userNotifications.save();

            })

        } else if (role === 'teacher') {
            const teachers = await Teacher.find();
            teachers.map(async (teacher) => {
                const notification = new Notification({
                    user_id: teacher.user_id,
                    message: 'circular created',
                    title: "New circular",
                    is_all: false,
                });
                const savedNotification = await notification.save();
                const userNotifications = new UserNotification({
                    user_id: teacher.user_id,
                    notification_id: savedNotification._id
                })
                userNotifications.save();

            })

        } else if (role === 'all') {
            const students = await Student.find();
            students.map(async (student) => {
                const notification = new Notification({
                    user_id: student.user_id,
                    message: 'circular created',
                    title: "New circular",
                    is_all: false,
                });
                const savedNotification = await notification.save();
                const userNotifications = new UserNotification({
                    user_id: student.user_id,
                    notification_id: savedNotification._id
                })
                userNotifications.save();

            })
            const teachers = await Teacher.find();
            teachers.map(async (teacher) => {
                const notification = new Notification({
                    user_id: teacher.user_id,
                    message: 'circular created',
                    title: "New circular",
                    is_all: false,
                });
                const savedNotification = await notification.save();
                const userNotifications = new UserNotification({
                    user_id: teacher.user_id,
                    notification_id: savedNotification._id
                })
                userNotifications.save();

            })
        }

        res.status(200).json({ message: 'Circular Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.BatchCreatedAdmin = async (req, res) => {
    try {
        const { teacher_ids, student_ids, subject_id, batch_name } = req.body;
        console.log(req.body);

        let students = [];
        let teachers = [];

        const subject = await Subject.findById(subject_id);
        // Use Promise.all to wait for all asynchronous operations to complete
        const teacherPromises = teacher_ids.map(async (teacher_id) => {
            const teacher = await Teacher.findById(teacher_id);
            console.log(teacher);
            teachers.push(teacher);
        });

        // Wait for all teacher promises to resolve
        await Promise.all(teacherPromises);

        teachers.map(async (teacher) => {
            const notification = new Notification({
                user_id: teacher.user_id,
                message: `Batch created for subject ${subject.subject_name} and batch name ${batch_name}`,
                title: "New Batch",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: teacher.user_id,
                notification_id: savedNotification._id
            });
            userNotifications.save();
        });


        const studentPromises = student_ids.map(async (student_id) => {
            const student = await Student.findById(student_id);
            students.push(student);
        });

        // Wait for all student promises to resolve
        await Promise.all(studentPromises);


        students.map(async (student) => {
            const notification = new Notification({
                user_id: student.user_id,
                message: `Batch created for subject ${subject.subject_name} and batch name ${batch_name}`,
                title: "New Batch",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: student.user_id,
                notification_id: savedNotification._id
            });
            userNotifications.save();
        });

        res.status(200).json({ message: 'Batch Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.newQuizCreated = async (req, res) => {
    try {
        const { batch_id, subject_id } = req.body;
        const subject = await Subject.findById(subject_id);
        const batch = await Batch.findById(batch_id)
            .populate("subject_id")
            .populate("students");
        batch.students.map(async (student) => {
            const notification = new Notification({
                user_id: student.user_id,
                message: `New Quiz created for subject ${subject?.subject_name} and batch name ${batch.batch_name}`,
                title: "New Quiz",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: student.user_id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
        })
        res.status(200).json({ message: 'New Quiz Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.newAssignmentCreated = async (req, res) => {
    try {
        const { batch_id } = req.body;
        const batch = await Batch.findById(batch_id)
            .populate("subject_id")
            .populate("students");
        const subject = await Subject.findById(batch.subject_id);

        batch.students.map(async (student) => {
            const notification = new Notification({
                user_id: student.user_id,
                message: `New Assignment created for subject ${subject?.subject_name} and batch name ${batch.batch_name}`,
                title: "New Assignment",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: student.user_id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
        })
        res.status(200).json({ message: 'New Assignment Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.newMaterialCreated = async (req, res) => {
    try {
        const { batch_id } = req.body;
        const batch = await Batch.findById(batch_id)
            .populate("subject_id")
            .populate("students");
        const subject = await Subject.findById(batch.subject_id);

        batch.students.map(async (student) => {
            const notification = new Notification({
                user_id: student.user_id,
                message: `New Material created for subject ${subject?.subject_name} and batch name ${batch.batch_name}`,
                title: "New Material",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: student.user_id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
        })
        res.status(200).json({ message: 'New Material Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.quizResponseSubmited = async (req, res) => {
    try {
        const { quiz_id, student_id } = req.body;
        const student = await Student.findById(student_id).populate("user_id");
        const quiz = await Quiz.findById(quiz_id);
        const teacher = await Teacher.findById(quiz.teacher_id);
        const notification = new Notification({
            user_id: student.user_id,
            message: `Quiz response submitted for quiz ${quiz.quiz_title}`,
            title: "Quiz Response Submitted",
            is_all: false,
        });
        const savedNotification = await notification.save();
        const userNotifications = new UserNotification({
            user_id: student.user_id,
            notification_id: savedNotification._id
        })
        userNotifications.save();

        const teacherNotification = new Notification({
            user_id: teacher.user_id,
            message: `Quiz response submitted for quiz ${quiz.quiz_title} by ${student.user_id.name}`,
            title: "Quiz Response Submitted",
            is_all: false,
        });
        const savedTeacherNotification = await teacherNotification.save();
        const teacherUserNotifications = new UserNotification({
            user_id: teacher.user_id,
            notification_id: savedTeacherNotification._id
        })
        teacherUserNotifications.save();

        res.status(200).json({ message: 'Quiz Response Submitted Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });

    }

}

exports.assignmentSubmited = async (req, res) => {
    try {
        console.log(req.body);
        const { assignment_id, student_id } = req.body;
        const student = await Student.findById(student_id).populate("user_id");
        const assignment = await Assignment.findById(assignment_id);
        const teacher = await Teacher.findById(assignment.teacher_id);
        const notification = new Notification({
            user_id: student.user_id,
            message: `Assignment submitted for assignment ${assignment.title}`,
            title: "Assignment Submitted",
            is_all: false,
        });
        const savedNotification = await notification.save();
        const userNotifications = new UserNotification({
            user_id: student.user_id,
            notification_id: savedNotification._id
        })
        userNotifications.save();
        const teacherNotification = new Notification({
            user_id: teacher.user_id,
            message: `Assignment submitted for assignment ${assignment.title} by ${student.user_id.name}`,
            title: "Assignment Submitted",
            is_all: false,
        });
        const savedTeacherNotification = await teacherNotification.save();
        const teacherUserNotifications = new UserNotification({
            user_id: teacher.user_id,
            notification_id: savedTeacherNotification._id
        })
        teacherUserNotifications.save();
        res.status(200).json({ message: 'Assignment Submitted Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

exports.newMeetingCreated = async (req, res) => {
    try {
        const { batch_id, subject_id } = req.body;
        const subject = await Subject.findById(subject_id);
        const batch = await Batch.findById(batch_id)
            .populate("subject_id")
            .populate("students");
        batch.students.map(async (student) => {
            const html = newMeetingcreated(batch.batch_name);
            await sendMailFunctionTA(student.user_id.email, 'New Meeting', html);
            const notification = new Notification({
                user_id: student.user_id,
                message: `New Meeting created for subject ${subject.subject_name} and batch name ${batch.batch_name}`,
                title: "New Meeting",
                is_all: false,
            });
            const savedNotification = await notification.save();
            const userNotifications = new UserNotification({
                user_id: student.user_id,
                notification_id: savedNotification._id
            })
            userNotifications.save();
        })
        res.status(200).json({ message: 'New Meeting Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.newlogin = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (user.role == 'admin') {
            const html = loginAdmin(user.name);
            await sendMailFunctionAdmin('New Login', html);
        } else {
            const html = login(user.name);
            await sendMailFunctionTA(user.email, 'New Login', html);
        }
        res.status(200).json({ message: 'Login Created Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}