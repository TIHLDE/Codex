---
title: Interactive Contact Form – Enhancing Your JavaScript Skills!
---

In this challenge, you’ll create an interactive contact form for a webpage that validates user input using JavaScript. You’ll add form validation rules for common fields and provide user feedback for successful submission. As a bonus, you can add localStorage to save the form’s data, allowing users to resume where they left off if they reload the page.

## Difficulty

&#9733;&#9733;&#9733;&#9734;&#9734;

## Useful prior knowledge

- Completion of _Personal Profile Page – Building Your First Interactive Webpage!_

## Pre-requisties

- Text editor (e.g., VS Code) or a basic coding environment
- Browser to preview your page (e.g., Chrome, Firefox)

## Purpose

This challenge helps you gain practical skills in building and handling interactive forms. You’ll implement real-time validation for a contact form, work with JavaScript events, and manage error messaging to enhance the user experience.

At the end of this challenge, you should:

- Understand the basics of form validation in JavaScript
- Be able to provide responsive feedback on form completion
- Gain a foundational understanding of using localStorage for form persistence (bonus challenge)

## Objective

Create a contact form with validation and interactive feedback using HTML, CSS, and JavaScript.

1. HTML Structure:
   - Design a contact form with the following fields:
     - Name (required, minimum 3 characters)
     - Email (required, valid email format)
     - Message (required, minimum 15 characters)
   - Include a submit button and a reset button to clear the form fields.
2. CSS Styling:
   - Style the form to have a clear layout, with error messages styled in red.
   - Highlight fields with errors (e.g., red border).
   - Ensure form styling is responsive and looks good on both desktop and mobile views.
3. JavaScript Validation:
   - Validate each field when the user tries to submit the form:
     - Name: Must be at least 3 characters.
     - Email: Must be in a valid email format (use a regex pattern).
     - Message: Must be at least 15 characters.
   - Display an error message under each field if validation fails.
   - Clear the error message once the field is corrected.
   - Display a confirmation message or redirect the user to a thank-you page when the form is successfully submitted.

## Bonus Challenge

- Use localStorage to save form data, so that if the user refreshes the page, their input is preserved.
- Implement a "Clear Form" button that also clears the data from localStorage.

## Useful Resources

- [Working with localstorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JavaScript form validation](https://www.w3schools.com/js/js_validation.asp)

### Author(s)

Mads Nylund
