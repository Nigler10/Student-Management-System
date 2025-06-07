> ⚠️ **Note:** The live website link for this project is intentionally **not included** here to prevent unwanted or inappropriate submissions from random viewers. The deployed link will be shared **privately** through Google Classroom.

---

# 🧑‍🎓 Student Management System

This is a full-stack web application to manage student records, subject enrollments, and their corresponding grades (Activities, Quizzes, Exams). Built with Django and Django REST Framework for the backend, and plain HTML/CSS/JavaScript for the frontend.

---

## 🚨 IMPORTANT: Python Version Notice

This project was developed using **Python 3.8.6**.

> **⚠️ If you're using a **newer Python version** (like 3.12 or any above 3.8), you may run into errors during `migrate` or `pip install` due to certain dependencies not being compatible out of the box.**

### 🔧 Your options:
- ✅ **Recommended:** Install Python **3.8.x** to match the project.
- ⚠️ Or: If you keep your newer Python version, you'll need to manually install any missing dependencies when errors appear in the terminal (usually during `migrate`).

---

## 📦 How to Run the Project (Windows, VSCode-friendly)

These are beginner-friendly instructions assuming you're using File Explorer, CMD, and VSCode.

### 📋 Step-by-step Instructions

1. **Open File Explorer** where you want to save the project.

2. **Open CMD inside that folder**:  
   Click the address bar → type `cmd` → press `Enter`

3. **Clone the repo**:  
   git clone https://github.com/Nigler10/Student-Management-System.git

4. **Close CMD, then open VSCode.**

5. **Open the cloned folder:**  
   In VSCode: File > Open Folder → select `Student-Management-System`

6. **Open a Terminal inside VSCode:**  
   Use `Ctrl + Shift + ~` or go to Terminal > New Terminal  
   (Make sure it's using CMD and you're inside the `Student-Management-System` folder)

7. **Create and activate virtual environment:**  
   python -m venv .venv  
   .venv\Scripts\activate.bat

8. **Navigate to the Project folder:**  
   cd Project

9. **Install all required dependencies:**  
   pip install -r requirements.txt

10. **Run migrations:**  
   python manage.py migrate

11. **Create a superuser (for admin login):**  
   python manage.py createsuperuser

12. **Run the development server:**  
   python manage.py runserver

Then go to http://127.0.0.1:8000/ in your browser.

---
> ⚠️ **NOTE:** Before running `python manage.py runserver`, make sure you're in **local dev mode** — the committed code is set for deployment.

### 🔧 Quick Local Setup Fix (Do This Before Step 12!)

1. **In** `Project/Project/settings.py`:
   ```python
   # Change this:
   DEBUG = os.getenv("DEBUG", "False") == "True"

   # To this:
   # DEBUG = os.getenv("DEBUG", "False") == "True"
   DEBUG = True

2. **In** `Project/app/static/js/config.js`:
   ```js
   // Change this:
   // const API_BASE_URL = "http://127.0.0.1:8000/";
   const API_BASE_URL = "https://student-management-system-zhy2.onrender.com/";

   // To this:
   const API_BASE_URL = "http://127.0.0.1:8000/";
   // const API_BASE_URL = "https://student-management-system-zhy2.onrender.com/";
   
