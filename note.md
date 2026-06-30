Get Started


TASK
·
AUTHENTICATION
Implement Login Feature
Allow users to log in using email and password.

Method: POST
Endpoint: /api/auth/login
Request

{
	"emai": "test@test.com",
	"password": "password"
}
Response

Success
  {
    "status": 200,
    "message": "Login successfully",
    data: {
        "token" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        user: {
          email: "test@test.com"
          name: "Test Name"
          // ...custom user data
        }
    }
  }
Error
{
	"status": 400,
	"message": "Your error message",
}


TASK
·
AUTHENTICATION
Implement the Register feature
This endpoint will allow users to register on the app using email, password and other necessary information.

Method: POST
Endpoint: /api/auth/register
Request

{
	"emai": "test@test.com",
	"password": "password",
	"name": "Test Name",
	"accountType":"Freelancer", // Freelancer or Company
	"country": "Nigeria",
	"countryCode": "+123",
	"state":"Rivers",
	"address":"No. 6 Prince Okey",
	"phoneNumber":"8124566736",
	...etc
}
Response

Success
  {
    "status": 201,
    "message": "User registered successfully",
    data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        user: {
          email: "test@test.com",
          name: "Test Name",
          // ...custom user data
        }
    }
  }
Error
{
	"status": 400, // Any status goes here
	"message": "Your error message",
}


TASK
·
AUTHENTICATION
Implement Forgot Password
This endpoint will allow users to reset forgotten password on the app using their email. Note that you will only call this endpoint if the user successfully validate their email using either deep link method or OTP.

Method: POST
Endpoint: /api/auth/password/reset
Request

{
	"emai": "test@test.com",
	password:  "new password"
}
Response

Success
  {
    "status": 200,
    "message": "User password reset successfully",
    data: {
        // ...custom user data
    }
  }
Error
{
	"status": 400, // Any status goes here
	"message": "Your error message",
}

TASK
·
AUTHENTICATION
Implement the Logout feature
This endpoint will allow users to log out of the app and invalidate their JWT token or destroy their current session.

Method: POST
Endpoint: /api/auth/logout
Request
{
	
}

Response
Success
  {
    "status": 200,
    "message": "User logged out successfully",
    data: {
        // ...custom user data
    }
  }
Error
{
	"status": 400, // Any status goes here
	"message": "Your error message",
}


Mark task complete
Next task

TASK
·
USER MANAGEMENT
Get user Profile
No content yet.

USER MANAGEMENT

Get user Profile

Edit user profile

TASK
·
USER MANAGEMENT
Get user Profile
No content yet.


TASK
·
TASK MANAGEMENT
Creates a new task
This endpoint should allow users to create a new task with details such as title, desc, isCompleted, etc.

Method: POST
Endpoint: /api/tasks
Request
Body
{
	title: String,
	description: String,
	isCompleted: Boolean,
	...etc
}
Headers
{
  authorization: "user token"
}
Params
{

}

Response
Success
  {
    "status": 201,
    "message": "Task created successfully",
    data: {
	    title: "Test title",
			description: "This is your task's description",
			isCompleted:false
			createdAt: "2023-12-20",
			...etc
    }
  }
Error
{
	"status": 400,
	"message": "Your error message",
}


ASK
·
TASK MANAGEMENT
Retrieves a list of tasks by user
This endpoint should allow retrieval of all tasks added by a user

Method: GET
Endpoint: /api/tasks
Request
Body
{
	userId: String
}
Headers
{
  authorization: "user token"
}
Query Params
{
 page: 0,
 size: 10
}
Response
Success
  {
    "status": 200,
    "message": "Retrieved all tasks successfully",
    data: [
		    {
				title: "Task title",
				description: "This is your tasks description",
				isCompleted: true,
				...etc
	    }
	    {
		    ...etc
	    },
	    {
		    ...etc
	    }
    ]
  }
Error
{
	"status": 400,
	"message": "Your error message",
}

TASK
·
TASK MANAGEMENT
Retrieve a single task by ID
This endpoint should allow a user to retrieve a single task with details such as title, desc, isCompleted, etc.

Method: GET
Endpoint: /api/tasks/{id}
Request
Body
{
	
}

Headers
{
  authorization: "user token"
}
Params
{

}

Response
Success
  {
    "status": 200,
    "message": "Task retrieved successfully",
    data: {
	    title: "Test title",
			description: "This is your task's description",
			isCompleted:false
			createdAt: "2023-12-20",
			...etc
    }
  }
Error
{
	"status": 400,
	"message": "Your error message",
}

TASK
·
TASK MANAGEMENT
Update a task by ID
This endpoint should be used to update tasks’ information. Only authenticated users can edit their tasks.

Method: PUT
Endpoint: /api/tasks/:id
Request
Body
{
	title: String,
	description: String,
	isCompleted: Boolean,
	...etc
}
Headers
{
  authorization: "user token"
}
query
{

}

Response
Success
  {
    "status": 200,
    "message": "Task edited successfully",
		  data: {
			  title: "Task title",
				description: "This is your task's description",
				isCompleted: true
				...etc
	    }
  }
Error
{
	"status": 400,
	"message": "Your error message",
}


Mark task complete

TASK
·
TASK MANAGEMENT
Delete a task by ID
This endpoint will allow users to delete their tasks by passing the ID of the task as a parameter.

Method: DELETE
Endpoint: /api/tasks/{id}
Request
Body
{

}

Headers
{
  authorization: "user token"
}
Query Params
{

}

Response
Success
  {
    "status": 200,
    "message": "Task deleted successfully",
    data: {}
  }
Error
{
	"status": 400,
	"message": "Your error message",
}


TASK
·
TASK MANAGEMENT
Mark the task as complete
This endpoint should be used to mark a task as completed. Only authenticated users can mark their tasks.

Method: PUT
Endpoint: /api/tasks/:id/mark
Request
Body
{
	isCompleted: Boolean,
}
Headers
{
  authorization: "user token"
}
query
{

}

Response
Success
  {
    "status": 200,
    "message": "Task marked successfully",
		  data: {
			  title: "Task title",
				description: "This is your task's description",
				isCompleted: true
				...etc
	    }
  }
Error
{
	"status": 400,
	"message": "Your error message",
}


TASK
·
TASK MANAGEMENT
Retrieve a list of completed tasks
This endpoint should allow retrieval of all completed tasks added by a user

Method: GET
Endpoint: /api/tasks/completed
Request
Body
{

}

Headers
{
  authorization: "user token"
}
Query Params
{
 page: 0,
 size: 10
}
Response
Success
  {
    "status": 200,
    "message": "Retrieved all completed tasks successfully",
    data: [
		    {
				title: "Task title",
				description: "This is your tasks description",
				isCompleted: true,
				...etc
	    }
	    {
		    ...etc
	    },
	    {
		    ...etc
	    }
    ]
  }
Error
{
	"status": 400,
	"message": "Your error message",
}



TASK
·
NOTIFICATION
Retrieve notification
This endpoint is used to retrieve the details of a single notification using the ID.

Method: GET
Endpoint: /api/notifications/{id}
Request
Body
{

}

Headers
{
  authorization: "user token"
}
query
{

}

Response
Success
  {
    "status": 200,
    "message": "Retrieved notification successfully",
    data: {
			    id: String,
				  title: String
				  message: String
				  isRead: Boolean
				  ...etc
	    },
  }
Error
{
	"status": 400,
	"message": "Your error message",
}


Mark task complete

TASK
·
NOTIFICATION
Mark notification as Read/Unread
This endpoint is used to mark notifications as read or unread.

Method: PUT
Endpoint: /api/notifications/{id}
Request
Body
{
	  isRead: Boolean
	  ...etc
}
Headers
{
  authorization: "user token"
}
query
{

}

Response
Success
  {
    "status": 201,
    "message": "Notification successfully marked",
    data: {
			  title: String
			  message: String
			  isRead: Boolean
				...etc
	    },
  }
Error
{
	"status": 400,
	"message": "Your error message",
}

TASK
·
NOTIFICATION
Clear notifications
This endpoint will allow users to delete all their notifications.

Method: DELETE
Endpoint: /api/notifications
Request
Body
{

}

Headers
{
  authorization: "user token"
}
Query Params
{

}

Response
Success
  {
    "status": 200,
    "message": "Notifications deleted successfully",
    data: {}
  }
Error
{
	"status": 400,
	"message": "Your error message",
}

TASK
·
NOTIFICATION
Retrieve notification count
This endpoint is used to retrieve the total number of notifications.

Method: GET
Endpoint: /api/notifications/count
Request
Body
{

}


Headers
{
  authorization: "user token"
}

query
{

}


Response
Success
  {
    "status": 200,
    "message": "Retrieved notification successfully",
    data: {
			    total: Number,
				  ...etc
	    },
  }

Error
{
	"status": 400,
	"message": "Your error message",
}


Mastering Backend - Build Your Own Simple To-Do List API

Design preview for the Build Your Own Simple To-Do List API

Welcome! 👋

Thanks for checking out this backend project.

Mastering Backend projects help you improve your coding skills by building real-world projects.

To do this challenge, you need a good understanding of any backend programming languages such as PHP, Node.js, Python, Rust, C#, Java, etc.

The project

The project is to build Build Your Own Simple To-Do List API and get the front end working (the front end has already integrated the API).

Click here to view more details about this project.

You can use any tools you like to help you complete the project. So if you've got something you'd like to practice, feel free to give it a go.

Objectives

Allow users to sign up, log in, and manage their accounts.
Enable users to create, read, update, and delete tasks.
Provide features to mark tasks as complete and view completed tasks.
Ensure secure and efficient handling of user data and tasks.
Want some support on the project? Join our community and ask questions in the #project-builders channel.

Expected behavior

You should have a working API with the functionalities mentioned above. Also, the API should follow the instructions listed in each task.

Where to find everything

Your task is to Build Your Own Simple To-Do List API. You will find an SQLite database file called db.sqlite inside the root folder. You will find the front end of each project on the project description page.

You can click on the Preview Frontend to have a visual view of what the project is all about.

If you would like the Figma design file to gain experience using professional tools and build more accurate projects faster, you can subscribe as a PRO member.

All the required assets and files for this project are in the root folder. If any image is required, they are already exported for the correct screen size and optimized.

There is also a **prd.pdf file containing the project requirement information you'll need, such as features, API structure, use cases, objectives, etc. Click on the Download PRD on the project description page.

Building your project

Feel free to use any workflow that you feel comfortable with. Below is a suggested process, but do not feel like you need to follow these steps:

Initialize your project as a public repository on GitHub. Creating a repo will make it easier to share your code with the community if you need help. If you're not sure how to do this, have a read-through of this Try Git resource.
Configure your repository to publish your code to a web address. This will also be useful if you need some help during a challenge as you can share the URL for your project with your repo URL. There are several ways to do this, and we provide some recommendations below.
Look through the PRD document to understand the scope and objectives of the project, and preview Frontend for visual understanding, start planning out how you'll tackle the project task.
Before adding any files, structure your content with any backend language. Setting up your database with good schema design first can help focus your attention on creating a well-structured API.
Write out the different endpoints for your project, including all the authenticated and non-authenticated endpoints.
Start adding controllers, and models to your project. Only move on to the next task once you're happy you've completed each task and marked it as completed.
Deploying your project

As mentioned above, there are many ways to host your project for free. Our recommended hosts are:

Heroku
Fly
Render
You can host your site using one of these solutions or any of our other trusted providers.

Create a custom README.md

We strongly recommend deleting everything in this README.md and adding the instructions on how to run and test out your API.

Also, inside your own README, you should add all the things you learned while working on the backend project.

Submitting your solution

Submit your solution on the platform for the rest of the community to see. Follow our "Complete guide to submitting solutions" for tips on how to do this.

Remember, if you're looking for feedback on your solution, be sure to ask questions when submitting it. The more specific and detailed you are with your questions, the higher the chance you'll get valuable feedback from the community.

Sharing your solution

There are multiple places you can share your solution:

Share your solution page in the #finished-projects channel of our community.
Tweet @master_backend and mention @master_backend, including the repo and live URLs in the tweet. We'd love to take a look at what you've built and help share it around.
Share your solution on other social channels like LinkedIn.
Blog about your experience building your project. Writing about your workflow, and technical choices, and talking through your code is a brilliant way to reinforce what you've learned. Great platforms to write on are dev.to, Hashnode, and CodeNewbie.
We provide templates to help you share your solution once you've submitted it on the platform. Please edit them and include specific questions when you're looking for feedback.

The more specific you are with your questions the more likely it is that another member of the community will give you feedback.

Got feedback for us?

We love receiving feedback! We're always looking to improve our challenges and our platform. So if you have anything you'd like to mention, please email info[at]masteringbackend[dot]com.

Want more projects: Backend Projects Please share it with anyone who will find it useful for practice.

Have fun building! 🚀