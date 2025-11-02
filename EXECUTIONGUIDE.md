# 🚀 Execution Guide — CPU Scheduling Visualizer

This document provides detailed instructions for setting up, using, and understanding the **CPU Scheduling Visualizer**.  
It covers installation, interface details, visualization explanations, and browser compatibility.

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
- No backend or installation is required — this project runs directly in the browser.  
- You only need a **modern web browser** (Chrome, Edge, or Firefox).

### 2️⃣ Steps to Run the Application Locally

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/PiyushRaj282/Project_OS.git
   ```

2. **Navigate to the Folder**
   ```bash
   cd Project_OS
   ```

3. **Run the Application**
   - Simply **double-click `index.html`**, or  
   - Right-click the file → **Open with** → your preferred browser.  
   - The web application will launch locally and display the CPU Scheduling Visualizer dashboard.

---

## 🧭 User Interface Guide

The interface is divided into **two primary sections** — the **Control Panel** and the **Visualization Area**.

### 🧩 1. Control Panel (Left Section)
Used for configuring and running simulations.

#### Input Parameters
| Field | Description | Example |
|--------|--------------|----------|
| **Process Name** | Unique identifier for each process (e.g., P1, P2) | P1 |
| **Arrival Time** | Time when the process enters the ready queue | 0 |
| **Burst Time** | Total CPU time required by the process | 4 |

#### Additional Controls
| Control | Function |
|----------|-----------|
| **Algorithm Selector** | Choose between FCFS, SJF, or Round Robin. |
| **Time Quantum** | Appears only for Round Robin — defines time slice for each process. |
| **+ Add Process** | Adds a new process to the list. |
| **Clear** | Removes all added processes. |
| **Run Simulation ▶** | Starts the CPU scheduling animation. |
| **Pause ⏸ / Step ⏭** | Pauses or advances the simulation step-by-step. |
| **Reset** | Clears all charts and statistics. |
| **Export PNG 📸** | Saves the Gantt chart as an image file. |

#### Output Statistics (Bottom of Left Panel)
Displays calculated results after running the simulation:
- **Average Waiting Time**
- **Average Turnaround Time**
- **CPU Utilization (%)**
- **Total Execution Time**

---

## 🎞️ Animation Features

The right section visualizes CPU scheduling dynamically through an **animated Gantt Chart**.  

### 🖼️ Visualization Elements

| Element | Description |
|----------|-------------|
| **Colored Bars** | Each process is represented by a unique color. The bar’s length corresponds to its burst duration. |
| **Timeline Labels** | Numbers below the Gantt chart show process start and end times. |
| **Process Names** | Displayed inside each colored segment for clarity. |
| **Statistics Section** | Automatically updates after the simulation, summarizing the results. |

### 🎨 Color Coding

Each process is assigned a **distinct color** for easy differentiation. Example:  
- P1 — Purple (`#7c5cff`)  
- P2 — Teal (`#00c2a8`)  
- P3 — Orange (`#ff7a59`)  

Colors remain consistent throughout the simulation for visual tracking.

### 🎬 Animation Controls
- The simulation **animates process execution sequentially** according to the selected algorithm.  
- You can **pause**, **resume**, or **step through** the execution manually.  
- **Round Robin** animations display multiple time slices per process for better understanding.

---

## 🌐 Browser Requirements

### ✅ Recommended Browsers
| Browser | Minimum Version | Status |
|----------|----------------|--------|
| **Google Chrome** | 90+ | ✔️ Fully Supported |
| **Microsoft Edge** | 90+ | ✔️ Fully Supported |
| **Mozilla Firefox** | 85+ | ✔️ Fully Supported |
| **Safari** | 14+ | ⚠️ Partial Support (minor visual differences) |

### ⚠️ Notes
- Best viewed on **desktop browsers** (laptops or PCs).  
- Ensure **JavaScript is enabled** for animations to function.  
- Works offline — no internet connection required once opened locally.  
- For optimal visuals, use a **minimum screen width of 1200px**.

---

## 🧠 Summary

The **CPU Scheduling Visualizer** provides a user-friendly, interactive platform to understand scheduling algorithms visually.  
It is ideal for students, educators, and developers learning about **operating system process scheduling**.

---

**Developed by:** [Piyush Raj](https://github.com/PiyushRaj282)  
📧 _Made with ❤️ using HTML, CSS, and JavaScript_
