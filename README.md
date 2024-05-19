# Django Comments Project

This project is a comment system built with Django, utilizing Django Channels for WebSocket support. The project allows users to add comments with HTML tags support, load txt files and images. Users can also reply to comments and filter them.

## Installation and Setup

**Ensure you have the following tools installed:**

    Docker
    Docker Compose

**Clone the Repository:**

```
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

**Set Up Environment Variables:**

Run

`cp .env.sample .env`

and fill the variables in .env file



**Start the Project with Docker Compose:**

`docker-compose up --build`


**Apply Database Migrations:**

After the containers are up and running, apply the database migrations:

`docker-compose exec web python manage.py migrate`

#### Once the project is running, you can access the application at http://0.0.0.0:8000/


