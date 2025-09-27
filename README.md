# 🗣️ DebateIL - פלטפורמת דיבייטים אינטראקטיבית

> **מערכת דיבייטים מתקדמת** - פלטפורמה מלאה לניהול דיבייטים בזמן אמת עם React + Node.js

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37.7-52B0E7.svg)](https://sequelize.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 סקירה כללית

**DebateIL** היא פלטפורמה מתקדמת לניהול דיבייטים אינטראקטיביים המאפשרת למשתמשים ליצור, להשתתף ולצפות בדיבייטים בזמן אמת. המערכת כוללת מערכת הצבעה מתקדמת, ניהול טיעונים, ופאנל ניהול מקיף.

### 🌟 תכונות עיקריות

- **🎪 דיבייטים בזמן אמת** - השתתפות בדיבייטים חיים עם WebSocket
- **🗳️ מערכת הצבעה מתקדמת** - הצבעה על טיעונים ומשתתפים
- **👤 ניהול משתמשים** - מערכת אימות מתקדמת עם JWT
- **🛡️ פאנל ניהול** - כלי admin מקיפים לניהול הפלטפורמה
- **📱 עיצוב רספונסיבי** - מותאם לכל המכשירים
- **🔒 אבטחה מתקדמת** - הגנה מפני CSRF, XSS ו-SQL Injection

## 🏗️ ארכיטקטורה

```
DebateIL/
├── 🖥️ Client/                    # React Frontend
│   └── debateILClient/           # אפליקציית React
├── 🖥️ Server/                    # Node.js Backend
│   └── debateILServer/           # שרת Express + Sequelize
├── 📄 DEPLOYMENT_INSTRUCTIONS.md # הוראות deployment
├── 🐳 docker-compose.yml         # הגדרת Docker
└── 📦 package.json               # ניהול תלויות
```

## 🚀 התקנה מהירה

### דרישות מערכת

- **Node.js** 18+
- **npm** 9+
- **Git** 2.30+
- **Database** (MySQL/PostgreSQL/SQLite)

### התקנה מלאה

```bash
# שכפול הפרויקט
git clone https://github.com/EladLaster/Final-Project-debateIL.git
cd Final-Project-debateIL

# התקנת תלויות לכל הפרויקט
npm install

# התקנת תלויות Client
cd Client/debateILClient
npm install

# התקנת תלויות Server
cd ../../Server/debateILServer
npm install

# הגדרת משתני סביבה
cp .env.example .env

# הרצת מיגרציות מסד נתונים
npm run db:migrate

# חזרה לתיקיית השורש
cd ../..
```

### הרצה מקומית

```bash
# הרצת השרת (טרמינל 1)
cd Server/debateILServer
npm run dev

# הרצת Client (טרמינל 2)
cd Client/debateILClient
npm run dev
```

## 🛠️ טכנולוגיות

### **Frontend (Client)**

- **React 19.1.1** - ספריית UI מודרנית
- **Vite 7.1.6** - כלי build מהיר
- **MobX 6.13.7** - ניהול state תגובתי
- **TailwindCSS 4.1.13** - עיצוב utility-first
- **React Router 7.9.1** - ניהול נתיבים
- **Axios 1.12.2** - HTTP client
- **Socket.IO Client** - תקשורת real-time

### **Backend (Server)**

- **Node.js 18+** - Runtime JavaScript
- **Express 5.1.0** - Web framework
- **Sequelize 6.37.7** - ORM מתקדם
- **JWT 9.0.2** - אימות מבוסס טוקנים
- **bcrypt 6.0.0** - הצפנת סיסמאות
- **MySQL2/PostgreSQL/SQLite3** - תמיכה במסדי נתונים מרובים

### **DevOps & Tools**

- **Docker** - קונטיינריזציה
- **ESLint** - בדיקת איכות קוד
- **Morgan** - HTTP request logging
- **CORS** - Cross-Origin Resource Sharing

## 📊 מבנה מסד הנתונים

### **טבלאות עיקריות**

- **Users** - משתמשים (UUID, username, email, profile)
- **Debates** - דיבייטים (topic, status, participants, scores)
- **Arguments** - טיעונים (content, author, debate association)
- **Votes** - הצבעות (user, debate, participant)

### **יחסים**

- User → Debates (One-to-Many)
- Debate → Arguments (One-to-Many)
- User → Arguments (One-to-Many)
- Debate → Votes (One-to-Many)

## 🔌 API Endpoints

### **אימות משתמשים**

```http
POST   /auth/register              # הרשמה
POST   /auth/login                 # התחברות
GET    /api/users/profile          # פרופיל נוכחי
PUT    /api/users/profile          # עדכון פרופיל
```

### **ניהול דיבייטים**

```http
GET    /api/debates                # רשימת דיבייטים
GET    /api/debates/:id            # דיבייט ספציפי
POST   /api/debates                # יצירת דיבייט
PUT    /api/debates/:id            # עדכון דיבייט
DELETE /api/debates/:id            # מחיקת דיבייט
POST   /api/debates/:id/register   # הרשמה לדיבייט
POST   /api/debates/:id/finish     # סיום דיבייט
```

### **מערכת טיעונים**

```http
GET    /api/debates/:id/arguments           # טיעונים לדיבייט
POST   /api/debates/:id/arguments           # יצירת טיעון
PUT    /api/debates/:id/arguments/:argId   # עדכון טיעון
DELETE /api/debates/:id/arguments/:argId   # מחיקת טיעון
```

### **מערכת הצבעה**

```http
PATCH  /api/debates/:id/vote/user1          # הצבעה למשתתף 1
PATCH  /api/debates/:id/vote/user2          # הצבעה למשתתף 2
GET    /api/debates/:id/votes               # תוצאות הצבעה
```

## 🎨 תכונות עיצוב

### **עיצוב רספונסיבי**

- **Mobile First** - מותאם למובייל
- **Breakpoints** - 4 נקודות שבירה
- **Flexible Grid** - רשת גמישה

### **נגישות (A11y)**

- **WCAG 2.1 AA** - תקני נגישות
- **Keyboard Navigation** - ניווט במקלדת
- **Screen Reader** - תמיכה בקוראי מסך
- **Color Contrast** - ניגודיות צבעים

## 🔒 אבטחה

### **Authentication & Authorization**

- **JWT Tokens** - אימות מבוסס טוקנים
- **Password Hashing** - הצפנת סיסמאות עם bcrypt
- **Role-based Access** - בקרת גישה מבוססת תפקידים
- **Session Security** - אבטחת סשנים

### **Input Validation & Protection**

- **Schema Validation** - אימות עם AJV
- **SQL Injection Protection** - הגנה מפני SQL injection
- **XSS Protection** - הגנה מפני Cross-site scripting
- **CSRF Protection** - הגנה מפני CSRF attacks

## 📈 ביצועים

### **Core Web Vitals**

- **LCP** < 2.5s - Largest Contentful Paint
- **FID** < 100ms - First Input Delay
- **CLS** < 0.1 - Cumulative Layout Shift

### **API Performance**

- **Response Time** < 200ms
- **Throughput** > 1000 req/sec
- **Error Rate** < 0.1%
- **Uptime** > 99.9%

## 🚀 Deployment

### **Docker Deployment**

```bash
# הרצה עם Docker Compose
docker-compose up -d

# בניית images
docker-compose build

# עצירת שירותים
docker-compose down
```

### **Manual Deployment**

```bash
# Client Build
cd Client/debateILClient
npm run build

# Server Start
cd Server/debateILServer
npm start
```

### **Environment Variables**

```env
# Server
PORT=3030
NODE_ENV=production
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-key

# Client
VITE_API_BASE_URL=https://your-server.com
```

## 🧪 בדיקות

### **Client Testing**

```bash
cd Client/debateILClient
npm run test              # Unit tests
npm run test:e2e         # End-to-end tests
npm run test:coverage     # Coverage report
```

### **Server Testing**

```bash
cd Server/debateILServer
npm test                  # Unit tests
npm run test:integration # Integration tests
npm run test:coverage     # Coverage report
```

## 📊 Monitoring & Analytics

### **Health Checks**

- **Client Health** - `/health` endpoint
- **Server Health** - `/api/health` endpoint
- **Database Health** - Connection monitoring

### **Metrics**

- **Request Count** - מספר בקשות
- **Response Time** - זמן תגובה
- **Error Rate** - אחוז שגיאות
- **Active Users** - משתמשים פעילים

## 🤝 תרומה לפרויקט

### **הנחיות תרומה**

1. **Fork** הפרויקט
2. **צור feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** השינויים (`git commit -m 'Add amazing feature'`)
4. **Push** ל-branch (`git push origin feature/amazing-feature`)
5. **פתח Pull Request**

### **Code Standards**

- **ESLint** - כללי קוד מחמירים
- **Prettier** - עיצוב קוד עקבי
- **JSDoc** - תיעוד פונקציות
- **Error Handling** - טיפול בשגיאות

## 📚 תיעוד נוסף

- **[Client README](Client/debateILClient/README.md)** - תיעוד מפורט של Client
- **[Server README](Server/debateILServer/README.md)** - תיעוד מפורט של Server
- **[Deployment Guide](DEPLOYMENT_INSTRUCTIONS.md)** - הוראות deployment

## 📄 רישיון

פרויקט זה מוגן תחת רישיון MIT. ראה קובץ [LICENSE](LICENSE) לפרטים.

## 👥 צוות הפיתוח

- **Elad Laster** - Full Stack Developer & Project Lead
- **Lior Kirshner** - Frontend Specialist & UI/UX Designer

## 📞 יצירת קשר

- **GitHub Issues** - דיווח על באגים ושאלות
- **Discussions** - דיונים ושאלות כלליות
- **Email** - contact@debateil.com
- **LinkedIn** - [Elad Laster](https://linkedin.com/in/eladlaster)

## 🙏 תודות

תודה מיוחדת לכל התורמים והמשתמשים שתרמו לפיתוח הפרויקט!

---

<div align="center">

**🌟 אם הפרויקט עזר לך, תן לו ⭐**

[![GitHub stars](https://img.shields.io/github/stars/EladLaster/Final-Project-debateIL?style=social)](https://github.com/EladLaster/Final-Project-debateIL)

**🚀 מוכן להתחיל? [התקן עכשיו](#-התקנה-מהירה)**

</div>
