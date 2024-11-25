const axios = require("axios");
const Meeting = require("../models/meetingModel");
const jwt = require("jsonwebtoken");
const KJUR = require("jsrsasign"); // Import the Meeting model

function healthCheck() {
  try {
    axios.get("https://zoom.us/");
    return true;
  } catch (error) {
    console.log(error);
  }
}

// server.js or your controller file
async function generateZoomSignature(req, res, next) {
  try {
    const { meetingNumber, role } = req.body;

    // Validate input
    if (!meetingNumber || role === undefined) {
      return res
        .status(400)
        .json({ error: "Missing meetingNumber or role in request body." });
    }

    // Load SDK Key and Secret from environment variables
    const sdkKey = "luHcCVYlQ1Cjq1NwoAFuYg";
    const sdkSecret = "3te57W3k3uBd4CHydxU5LsOR9rvtYtQn";

    if (!sdkKey || !sdkSecret) {
      return res
        .status(500)
        .json({ error: "Zoom SDK Key and Secret are not configured." });
    }

    // Define the payload for the JWT
    const iat = Math.floor(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // Signature valid for 2 hours

    const oHeader = { alg: "HS256", typ: "JWT" };

    const oPayload = {
      sdkKey: "luHcCVYlQ1Cjq1NwoAFuYg",
      mn: "75756124211",
      role: 0, // 0 for attendee, 1 for host
      iat: iat,
      exp: exp,
      tokenExp: exp,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);

    // Generate the JWT signature
    const signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);

    // Return the signature to the client
    res.json({ signature: signature });
  } catch (error) {
    console.error("Error generating Zoom signature:", error);
    res.status(500).json({ error: "Failed to generate Zoom signature." });
    next(error);
  }
}

async function zoomuserinfo(req, res, next) {
  try {
    const token = req.body.token;
    const email = "rsmx141@gmail.com";
    const result = await axios.get(`https://api.zoom.us/v2/users/${email}`, {
      headers: {
        Authorization: "Bearer" + token,
        "User-Agent": "Zoom-api-Jwt-Request",
        "Content-Type": "application/json",
      },
    });
    res.json(result.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
    next();
  }
}

const Student = require("../models/studentModel"); // Adjust the path as necessary

async function createZoomMeeting(req, res, next) {
  try {
    const token = req.body.token;

    // Extract user inputs from the request body
    const {
      topic,
      startTime,
      duration,
      selectedDays,
      repeatTimes,
      password,
      agenda,
      studentIds, // Array of student IDs
      teacherId, // Teacher ID (must be provided)
      batchId, // Batch ID (must be provided)
      subjectId, // Subject ID (must be provided)
    } = req.body;

    // Map days of the week to Zoom API format
    const dayMapping = {
      Sunday: 1,
      Monday: 2,
      Tuesday: 3,
      Wednesday: 4,
      Thursday: 5,
      Friday: 6,
      Saturday: 7,
    };

    // Convert selected days to Zoom API format
    const weeklyDays = selectedDays.map((day) => dayMapping[day]).join(",");

    // Create the meeting with registration required
    const result = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: topic || "Discussion about today's Demo",
        type: 8, // Recurring meeting with fixed time
        start_time: startTime, // e.g., "2023-10-13T16:00:00"
        duration: duration || 20,
        timezone: "Asia/Kolkata",
        password: password || "1234567",
        agenda: agenda || "We will discuss about Today's Demo process",
        recurrence: {
          type: 2, // Weekly recurrence
          repeat_interval: 1,
          weekly_days: weeklyDays,
          end_times: repeatTimes || 10,
        },
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: true,
          use_pmi: false,
          approval_type: 0,
          registration_type: 2,
          audio: "both",
          auto_recording: "cloud",
          enforce_login: false,
          registrants_email_notification: false, // You will send join links manually
          waiting_room: true,
          allow_multiple_devices: false,
          email_notification: true,
          meeting_authentication: true, // Enforce authentication
        },
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "User-Agent": "Zoom-api-Jwt-Request",
          "Content-Type": "application/json",
        },
      }
    );

    const meetingId = result.data.id;

    // Fetch student documents and populate user information
    const students = await Student.find({ student_id: { $in: studentIds } })
      .populate("user_id") // Assuming 'user_id' references the User model
      .exec();

    // Function to add registrants
    async function addRegistrants(meetingId, students) {
      const registrantJoinUrls = [];

      for (const student of students) {
        try {
          const user = student.user_id;
          if (!user) {
            console.error(
              `User not found for student ID ${student.student_id}`
            );
            continue;
          }

          const registrantResponse = await axios.post(
            `https://api.zoom.us/v2/meetings/${meetingId}/registrants`,
            {
              email: user.email,
              first_name: user.firstName || "FirstName",
              last_name: user.lastName || "",
            },
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );

          const joinUrl = registrantResponse.data.join_url;

          // Add to the array
          registrantJoinUrls.push({
            email: user.email,
            joinUrl,
          });
        } catch (error) {
          console.error(
            `Error adding registrant ${student.student_id}:`,
            error.response ? error.response.data : error.message
          );
        }
      }

      return registrantJoinUrls;
    }

    const registrantJoinUrls = await addRegistrants(meetingId, students);

    // Save the meeting to the database
    const newMeeting = new Meeting({
      teacher_id: teacherId,
      batch: batchId,
      subject: subjectId,
      meeting_link: result.data.join_url, // Or use result.data.start_url for host link
      created_at: new Date(),
      is_active: true,
      students: students.map((student) => student._id), // Array of Student ObjectIds
    });

    await newMeeting.save();

    res.json({
      meeting: result.data,
      registrants: registrantJoinUrls,
      message: "Meeting created, registrants added, and saved to database.",
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res
      .status(500)
      .send(error.response ? error.response.data : "An error occurred");
  }
}

async function getMeetingById(req, res, next) {
  try {
    const meetingId = req.params.id;
    const meeting = await Meeting.findById(meetingId).populate(
      "teacher_id batch subject students"
    );
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
}

async function getMeetingParticipants(req, res, next) {
  try {
    const token = req.body.token;
    const meetingId = req.params.meetingId; // Get the meeting ID from the request

    // Step 1: Get meeting participants (those who have joined)
    const liveParticipantsResponse = await axios.get(
      `https://api.zoom.us/v2/meetings/${meetingId}/participants`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "User-Agent": "Zoom-api-Jwt-Request",
          "Content-Type": "application/json",
        },
      }
    );

    const participantsJoined = liveParticipantsResponse.data.participants;

    // Step 2: Get registrants (those who haven't joined)
    const registrantsResponse = await axios.get(
      `https://api.zoom.us/v2/meetings/${meetingId}/registrants`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "User-Agent": "Zoom-api-Jwt-Request",
          "Content-Type": "application/json",
        },
      }
    );

    const registrants = registrantsResponse.data.registrants;

    const registrantsNotJoined = registrants.filter((registrant) => {
      return !participantsJoined.some(
        (participant) => participant.email === registrant.email
      );
    });

    res.json({
      meetingId: meetingId,
      participantsJoined: participantsJoined,
      registrantsNotJoined: registrantsNotJoined,
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res
      .status(500)
      .send(error.response ? error.response.data : "An error occurred");
  }
}

module.exports = {
  zoomuserinfo,
  createZoomMeeting,
  healthCheck,
  getMeetingParticipants,
  getMeetingById,
  generateZoomSignature,
};
