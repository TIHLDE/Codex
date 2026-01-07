---
title: Docker, I hardly know her 🐳 (#6)
---

## Difficulty

&#9733;&#9733;&#9733;&#9734;&#9734;

## Useful prior knowledge

- VM
- Project Management

## Pre-requisties

- Docker

## Purpose

Picture this:

You have created the sickest website. More than that, you truly looked past your inner soy dev and utilized a new Go framework that is currently only supported on NixOS. Wow, impressive!

The only problem is that your friend Alex wants to try running your website locally. Now, Alex has never used Linux before (truly friends from opposing worlds) and he does not plan on changing anytime soon. At this point, Alex could decide to download the specific distribution and run it as a Virtual Machine (VM), but his Thinkpad only has 4 GB of RAM and 5 GB of memory free. This is where Docker comes in. Docker utilizes a concept known as containerization to run lightweight virtualization of applications without the necessity for a hypervisor.

The purpose of this challenge is therefore to explore the usefulness of containerization and how to Dockerize your own application. If you have already completed the web server challenge, then this challenge may be a logic next step.

Note! If you prefer non-proprietary software, then Podman is great alternative!

At the end of this challenge, you should:

- Understand the basic concepts surrounding containerization
- Be able to containerize (Dockerize) an application

## Objective

The objective for this challenge is to become fluent in Docker. To do so, you will need to do the following:

1. Make a simple Hello World script in a compiled language (e.g. Rust, C, BrainFuck), which you currently do not have a compiler for.
2. Create a DockerFile with the correct base image to load, compile, and print the results.

## Bonus Challenge

- Take a full web-development project and create Docker files for each part of the project. Then, create an overall Docker-compose.
- Make a DockerFile that spins up an NGINX base image. Serve a web-application through this docker container.

## Useful Resources

- https://docs.docker.com/build/concepts/dockerfile/
- https://youtu.be/GFgJkfScVNU?si=o-GaDxJ1gfwRQAeF

### Author(s)

Trym Hamer Gudvangen
