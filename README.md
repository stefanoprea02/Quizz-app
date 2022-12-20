# Quizzical

Quizz app created using HTML, CSS, JavaScript, React, NodeJS.

<h2>How it works</h2>

&nbsp;&nbsp;When starting the application every user needs to register. When creating an account it checks to see if the user already exists or if there are empty fields. If the data is correct it is sent to the server where the password gets encrypted and the new user is stored on a SQLite database.

&nbsp;&nbsp;After starting the quizz, the application gets a set of questions from an online database that are then rendered using react components.

&nbsp;&nbsp;When you press Check Answers the application checks too see how many answers are correct and it send a request to update user stats.

&nbsp;&nbsp;When logging in, a new session is created to keep track of the user. The session is terminated when logging out or deleting the account.

<details>
  <summary><h2>Screenshots from the app</h2></summary>
  <details>
    <summary>First page</summary>
    <img src="/readme-images/Sign-in-page.png" name="First-page">
  </details>
  <details>
    <summary>Log in page</summary>
    <img src="/readme-images/Log-in-page.png" name="Log-in-page">
  </details>
  <details>
    <summary>Sign up page</summary>
    <img src="/readme-images/Sign-up-page.png" name="Sign-up-page">
  </details>
  <details>
    <summary>Main page</summary>
    <img src="/readme-images/Main-page.png" name="Main-page">
  </details>
  <details>
    <summary>Questions page</summary>
    <img src="/readme-images/Questions-page.png" name="Questions-page">
  </details>
  <details>
    <summary>Questions after checking answers</summary>
    <img src="/readme-images/Questions-checked-page.png" name="Questions-checked-page">
  </details>
  <details>
    <summary>User page</summary>
    <img src="/readme-images/User-page.png" name="User-page">
  </details>
</details>
