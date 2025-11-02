# 🚀 Execution Guide — CPU Scheduling Visualizer

This guide will help you understand how to **set up**, **run**, and **use** the CPU Scheduling Visualizer.

---

## 🧩 1. Prerequisites

- A modern web browser (e.g., Chrome, Edge, or Firefox)
- No installation or backend setup required — it's a **pure front-end project**

---

## 🗂️ 2. Folder Contents

| File | Description |
|------|-------------|
| **index.html** | Main structure and layout of the visualizer |
| **styles.css** | Contains design, responsive layout, and theme colors |
| **script.js** | Implements CPU scheduling logic and dynamic animations |

---

## ⚙️ 3. Steps to Run

1. **Clone or Download the Repository**

   ```bash
   git clone https://github.com/PiyushRaj282/Project_OS.git
   ```

2. **Open the Folder**
   ```bash
   cd Project_OS
   ```

3. **Run the Application**
   - Simply **double-click `index.html`**
   - or open it manually in any web browser.

---

## 🎮 4. How to Use the Visualizer

### 🧱 Step 1: Add Processes
- Enter **Process Name**, **Arrival Time**, and **Burst Time**.
- Click **+ Add Process** to add it to the list.
- You can add multiple processes one by one.

### ⚙️ Step 2: Select Scheduling Algorithm
- Choose between **FCFS**, **SJF**, or **Round Robin**.
- If you select **Round Robin**, specify the **Time Quantum** value.

### ▶️ Step 3: Run the Simulation
- Click **Run Simulation** to start the visual animation.
- The **Gantt Chart** will visualize the CPU allocation.

### ⏸️ Step 4: Control the Simulation
- **Pause** the simulation anytime.  
- Use **Step** to move through each process execution manually.
- **Reset** clears all states for a fresh start.

### 📈 Step 5: View Statistics
- The stats panel below the chart shows:
  - **Average Waiting Time**
  - **Average Turnaround Time**
  - **CPU Utilization**
  - **Total Time**

### 📸 Step 6: Export Chart
- Click **Export PNG** to save your current Gantt Chart as an image.

---

## 🌗 5. Theme Switching

Use the 🌙 / ☀️ toggle at the top-right corner to switch between:
- **Dark Mode** – default look  
- **Light Mode** – bright and clean interface

---

## 🧠 6. Example Test Case

| Process | Arrival Time | Burst Time |
|----------|---------------|-------------|
| P1 | 0 | 4 |
| P2 | 1 | 6 |
| P3 | 2 | 4 |

Algorithm: **Round Robin (Quantum = 3)**

You’ll see a dynamic Gantt Chart visualizing CPU execution order.

---

## 💬 7. Troubleshooting

- ❌ **No processes added?** → Add at least one before running.  
- ⚙️ **Canvas not visible?** → Resize your browser or refresh.  
- 📉 **Performance lag?** → Reduce the number of processes.

---

## 🏁 8. Conclusion

This visualizer is an excellent educational tool to **learn**, **teach**, and **demonstrate** CPU scheduling algorithms with clarity and interactivity.

Explore, analyze, and visualize how scheduling affects CPU performance!

---

**Developed by:** [Piyush Raj](https://github.com/PiyushRaj282)  
📧 _Made with ❤️ using HTML, CSS, and JavaScript_
