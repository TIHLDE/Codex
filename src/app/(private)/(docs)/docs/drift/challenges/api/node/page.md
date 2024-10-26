---
title: Introduction to Node.js – Building Your First API Request!
---

In this challenge, you’ll get hands-on experience with Node.js by setting up a simple script that fetches data from a public API. This task will help you understand how Node.js handles requests and responses, which are foundational skills for working with back-end APIs.


## Difficulty
&#9733;&#9733;&#9734;&#9734;&#9734;

## Useful prior knowledge
- Basic JavaScript syntax (e.g., variables, functions, and async/await)
- Familiarity with command line/terminal usage

## Pre-requisties
- Install Node.js on your machine (Download from [Node.js](https://nodejs.org/en/download/package-manager))
- Basic text editor (e.g., VS Code)

## Purpose
This challenge introduces you to Node.js and working with API requests. You’ll learn how to set up a simple project, make a request to an external API, and display the result in the console. This is a key skill in backend development and using APIs for data retrieval.

At the end of this challenge, you should:

- Set up a basic Node.js project
- Use Node.js to make a GET request to an external API
- Handle and display API responses in the console

## Objective
Create a basic Node.js script that retrieves and displays data from a public API.

Project Setup:

1. Initialize a new Node.js project by creating a project folder and running npm init -y in the terminal. This will create a package.json file.
2. API Request Script:
    - Create an index.js file as your main script.
    - Write a function to make a GET request to a public API, such as the "JSONPlaceholder" API:
        - Example endpoint: https://jsonplaceholder.typicode.com/posts/1
    - Use async and await syntax to handle the response and print the data to the console.
3. Running the Script:
    - Run your script in the terminal with node index.js.
    - Confirm that it logs the data from the API, such as a sample post's title and content.


## Bonus Challenge
- Modify the script to take an input (e.g., post ID) from the command line and display data for that specific post.
- Add error handling to display a custom message if the API request fails.

## Useful Resources
- Search for Node.js or JavaScript fetch for info
- [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

### Author(s)
Mads Nylund