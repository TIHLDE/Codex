---
title: System of a D(aemon) 🤟
---

## Difficulty
&#9733;&#9733;&#9733;&#9734;&#9734;

## Useful prior knowledge
- Linux commands
- Linux privileges

## Pre-requisties
- Unix-based OS

## Purpose
Starting all basic applications each time your computer or server is restarted/rebooted can be tedious. Even more so, it can be annoying to have a terminal window/tab open for each application to check the logs. A useful way of solving this problem is running the applications as a background process using systemd. The purpose of this challenge is therefore to learn about systemd services.

At the end of this challenge, you should:
- Be able to create a new systemd service
- Be familiar with `systemctl` commands
- Understand value of systemd

## Objective
For this challenge, you need to create a systemd service to run a specific application. The actual application is not important, however a suggestion will be given in the description below.

1. Create a python script that prints the current time every minute. 
2. Create a systemd service to run and administer the application.
3. Check the logs of the application.


## Bonus Challenge
- Run more a complex backend application as service.
- Create a systemd timer to perform a similar task as the cron challenge.

## Useful Resources
- https://en.wikipedia.org/wiki/Systemd
- https://linuxhandbook.com/create-systemd-services/


### Author(s)
Trym Hamer Gudvangen
