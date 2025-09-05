# README – Client Report Front-End Project
https://www.notion.so/Front-End-Assignment-224fac5c3c53804f8992c95a2d793238
## 📌 Project Overview
This project is a **front-end assignment** built with **HTML, SCSS, and JavaScript**, designed to simulate a client-report dashboard.  
It demonstrates **responsive layouts**, a **filter bar with dynamic tags**, and a **live search system** powered by mock JSON data.

**Key Features:**
- **Responsive Design**  
  - Desktop view (≥431px): fixed-width centered layout with grid-based rows.  
  - Phone view (≤430px): vertical stacking, horizontal scrolling for stats, collapsible filter bar.  

- **Filter Bar**  
  - Desktop: left-side drawer that overlays the screen.  
  - Phone: collapsible panel below the filter button.  
  - Supports **dynamic tags** that can be added/removed.  

- **Search Functionality**  
  - Searches live through client names.  
  - Dynamically replaces static rows with data from `clients.json`.  
   

---

## 📂 Project Structure
```
lee/
│── dist/                  # SCSS compiled CSS (desktop.css, media-query.css)
│── icons/                 # Icons used in UI (search, filter, check, cross, etc.)
│── data/                  # Mock JSON data for testing
│   └── clients.json       # Client records: name, last class, next class, subscription
│── filter.js              # Filter bar open/close logic + tag rendering
│── search.js              # Search system: live filtering, row rendering
│── query.html             # Main app layout
```

---

## ⚙️ Installation & Running Instructions
1. **Clone the project**  
   ```bash
   git clone <repo-url>
   cd lee
   ```

2. **Run locally** (needed for JSON fetch):  
   - **Option A – VSCode Live Server**  
     - Install the Live Server extension.  
     - Right-click `index.html` → *Open with Live Server*.  
     - Visit: `http://localhost:5500/lee/index.html`.  

   - **Option B – Node.js HTTP server**  
     ```bash
     npm install -g serve
     serve .
     ```
     - Visit the link printed in terminal (usually `http://localhost:3000`).  

3. **Test views by resizing:**  
   - Desktop: ≥431px  
   - Phone: ≤430px  

---

## 📊 Mock Data Explanation
The `/data/clients.json` file simulates backend data.

### Example:
```json
[
  {
    "id": 1,
    "name": "דנה כהן",
    "lastClass": {
      "name": "שם השיעור האחרון",
      "startDate": "23/06",
      "startHour": "12:30"
    },
    "nextClassDate": "23/10",
    "subscription": "מנוי פעיל"
  }
]
```

**Fields:**
- `id` – unique identifier  
- `name` – client’s full name (searchable)  
- `lastClass` – object with last class details (`name`, `startDate`, `startHour`)  
- `nextClassDate` – upcoming class (nullable if none)  
- `subscription` – status (`מנוי פעיל`, `ללא מנוי`)    

---

## 🚀 Features Recap
- Responsive SCSS-based design  
- Filter bar with interactive tags  
- Search input with live results  
- Consistent UI in both desktop and mobile  
- Mock JSON simulating backend  
