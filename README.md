# ⚙️ CPU Scheduling Visualizer

A **web-based CPU Scheduling Visualizer** built using **HTML, CSS, and JavaScript**.  
It simulates and visualizes the working of major **CPU scheduling algorithms** — **FCFS**, **SJF**, and **Round Robin**, providing a clear and animated representation of process execution through a **Gantt chart**.

---

## 🧠 Project Description

**CPU Scheduling Visualizer** is an interactive educational tool designed to help students and enthusiasts understand how different scheduling algorithms work in an operating system.  

Users can add processes (with arrival and burst times), select an algorithm, and visualize CPU allocation dynamically.  
The Gantt chart updates in real-time with detailed statistics such as:

- Average Waiting Time  
- Average Turnaround Time  
- CPU Utilization  
- Total Execution Time  

---

## 🎯 Features Overview

### 💻 Core Functionalities
- **Supports Major Scheduling Algorithms:**
  - FCFS (First Come First Serve)
  - SJF (Shortest Job First - Non-Preemptive)
  - RR (Round Robin - Preemptive)
- **Dynamic Input System** — Add or remove processes with custom arrival and burst times.
- **Animated Gantt Chart** — Visualizes CPU execution order interactively.
- **Detailed Statistics** — Displays average waiting time, turnaround time, CPU utilization, and total time.
- **Dark / Light Mode Toggle** — Switch between two clean themes.
- **Export Option** — Save the Gantt chart as a PNG image.
- **Pause & Step Simulation** — Control the execution step by step or in real-time animation.

---

## 🧩 Tech Stack

| Technology | Description |
|-------------|-------------|
| **HTML5** | Defines page structure and elements |
| **CSS3** | Implements layout, animations, and responsive design |
| **JavaScript (ES6)** | Handles scheduling logic, interactivity, and rendering |

---

## 🏗️ Project Structure

```
Project_OS/
│
├── index.html      # Main interface and structure
├── styles.css      # Styling and themes (dark/light)
└── script.js       # CPU scheduling logic and animations
```

---

## 📈 Algorithms Implemented

### 1️⃣ **FCFS (First Come First Serve)**
- Processes are scheduled in the order of their arrival time.

### 2️⃣ **SJF (Shortest Job First - Non-Preemptive)**
- The process with the shortest burst time is executed next.

### 3️⃣ **RR (Round Robin - Preemptive)**
- Each process is given a fixed **time quantum** in cyclic order.

---

## 📊 Statistics Displayed

| Metric | Description |
|---------|-------------|
| **Average Waiting Time** | Mean waiting time for all processes |
| **Average Turnaround Time** | Average time taken from arrival to completion |
| **CPU Utilization** | Percentage of CPU busy time |
| **Total Time** | Time span between the first arrival and last completion |

---

## 🛠️ Future Enhancements

- 🧩 Add **Preemptive SJF** and **Priority Scheduling**
- 🎨 Enhance **UI/UX** with animations and transitions
- 📦 Include **data export/import** for process sets
- 🔍 Display **per-process statistics**

---
