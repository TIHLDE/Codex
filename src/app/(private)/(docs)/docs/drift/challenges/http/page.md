---
title: Let's HTTP-arty (#1)
---

## Difficulty

&#9733;&#9733;&#9734;&#9734;&#9734;

## Useful prior knowledge

- Linux commands
- Understanding of HTTP

## Pre-requisties

- Access to Web Server (on VM as of 2024). Also possible to run web server locally.

## Purpose

The purpose of this task is to get a more personal understanding of HTTP and web servers. Particularly, the cURL (`curl`) command will be utilized.

At the end of this challenge, you should:

- Have a better understanding of the different HTTP requests and generally how the protocol works.
- Be able to perform simple `curl` executions.

## Objective

For this challenge, you need to query endpoints of a web server using HTTP and the `curl` command. The necessary information to complete the task is as follows:

- The web server is running on Colargol2.0 (VM on OpenStack)
- There are 3 subtasks, which need to be done sequentially. The endpoint corresponds to the task. In other words, the endpoint will be /1, /2, and /3. The endpoints need GET, GET, and POST requests, respectively.
- A simple web server without SSL/TLS (no HTTPS) was used.
  - Port: 5000
  - Host: LocalHost

Complete each subtask by using `curl` with the correct arguments.

## Bonus Challenge

- Retrieve vg.no and save it to a `.html` file.
- Find the version of python used for the web server.
- Find the network speed.
- Explore Postman and see how they use curl.
- Download Wireshark and compare packets received in Wireshark and when using `curl --trace - URL`
- Create a cron job that triggers a curl command to a web server every 10 minutes and checks its server's health.

## Useful Resources

- https://curl.se/docs/manpage.html
- https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server

### Author(s)

Trym Hamer Gudvangen
