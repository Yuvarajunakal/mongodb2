// Design database for Zen class programme
// users
// codekata
// attendance
// topics
// tasks
// company_drives
// mentors

use zenclassprogramme;

db.createCollection("users")


db.users.insertOne({
  user_id:"Y4305",
  user_name: "Yuvaraj unakal",
  user_email: "yuvarajunakal@gmail.com",
  user_password: "yuvi4305",
  user_mentor_id: "M433"
})

db.createCollection("codekata")

db.codekata.insertOne({
  user_id:"Y4305",
  user_coding_solutions:12
})

db.createCollection("attendance")

db.attendance.insertOne({
  user_Id: "Y4305",
  topic_id:"T433",
  user_appearance:true
})

db.createCollection("topics")

db.topics.insertOne({
    topic_id: "T433",
    topic_tile: "HTML",
    topic_description:"Markup language",
    topic_date: ISODate("2023-07-14"),
})

db.createCollection("tasks")

db.tasks.insertOne({
    task_id: "TA100",
    topic_id: "T433",
    user_id: "Y4305",
    task_title: "HTML task",
    task_due_date: ISODate("2023-07-14"),
    task_submitted: true,
})

db.createCollection("company_drives")

db.company_drives.insertOne({
     user_id: "Y4306",
    company_drive_date: ISODate("2023-07-14"),
    company_name: "Google"
})

db.createCollection("mentors")

db.mentors.insertOne({
  mentor_id: "M173",
    mentor_name: "Arun",
    mentor_email: "Arun@gmail.com",
  mentor_expertise: ["Web Development", "Database Management"]
})

// Find all the topics and tasks which are thought in the month of October

db.topics.aggregate(
    [
        {
            $match: {
                topic_date: {
                    $gte: ISODate("2023-10-01"),
                    $lt: ISODate("2023-10-31")
                }
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "topic_id",
                foreignField: "task_id",
                as: "tasks" 
            }
        }
    ]
    )

// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

    db.company_drives.find(
        {
            drive_date: {
                            $gte: ISODate("2020-10-15"),
                            $lte: ISODate("2020-10-31"),
                        }
        }
        );

// Find all the company drives and students who are appeared for the placement.

db.company_drives.aggregate(
    [
        {
            $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "users",
                    },
        }
    ]
    );

// Find the number of problems solved by the user in codekata

db.codekata.aggregate(
    [
        {
            $lookup: 
            {
                from: "users",
                localField: "user_id",
                foreignField: "user_id",
                as: "users",
            },
        },
        {
            $project: 
            {
                user_coding_solutions: 12,
                user_name: "Yuvaraj unakal",
                user_id: "Y4305",
            },
  },
]);

db.mentors.aggregate(
    [
        {
            $lookup: 
            {
                from: "mentors",
                localField: "mentor_id",
                foreignField: "mentor_id",
                as: "mentors"
            }
        }
        ,
        {
            $match: {
                $expr: {
                     $gt: [{ $size: "$mentors" }, 15] 
                    }
                }
        }
        ])



db.users.aggregate(
    [
            {
            $lookup: {
                        from: "attendance",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "attendance" 
                    }
             },
  {
    $lookup: 
    {
        from: "tasks",
        localField: "user_id",
        foreignField: "task_id",
        as: "tasks"}
  },
  {
    $match: {
      $and: [
        {task_due_date: {$gte: ISODate("2022-12-03"),$lte: ISODate("2022-12-31")}},{"attendance.present": false},{"tasks.submitted": false}]}},
  {
    $group: {_id: null,count: { $sum: 1 }}
}])
