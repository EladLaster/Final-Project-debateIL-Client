# 🗣️ DebateIL - Client&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Go to Server](https://img.shields.io/badge/Go_to_Server-BackEnd-brightgreen?style=for-the-badge)](https://github.com/EladLaster/Final-Project-debateIL-Server)

> **פלטפורמת דיבייטים אינטראקטיבית** - אפליקציית React מודרנית לניהול דיבייטים בזמן אמת

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.6-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC.svg)](https://tailwindcss.com/)
[![MobX](https://img.shields.io/badge/MobX-6.13.7-FF9955.svg)](https://mobx.js.org/)

## 🎯 תכונות עיקריות

### 🎪 **דיבייטים בזמן אמת**

- **דיבייטים חיים** - השתתפות בדיבייטים בזמן אמת
- **מערכת הצבעה** - הצבעה על טיעונים ומשתתפים
- **תקשורת מיידית** - WebSocket לתקשורת real-time
- **ניהול זמן** - טיימר דיבייט עם התראות

### 👤 **ניהול משתמשים**

- **הרשמה והתחברות** - מערכת אימות מתקדמת עם JWT
- **פרופיל משתמש** - עריכת פרטים אישיים וצפייה בסטטיסטיקות
- **היסטוריית דיבייטים** - מעקב אחר דיבייטים קודמים
- **אבטחה מתקדמת** - הגנה מפני CSRF ואימות חזק

### 🛡️ **פאנל ניהול**

- **ניהול משתמשים** - צפייה וניהול משתמשי הפלטפורמה
- **ניהול דיבייטים** - יצירה, עריכה ומחיקה של דיבייטים
- **אנליטיקס** - סטטיסטיקות פלטפורמה ומעקב ביצועים
- **הרשאות מתקדמות** - בקרת גישה ברמת admin

### 📱 **ממשק משתמש מתקדם**

- **עיצוב רספונסיבי** - מותאם לכל המכשירים
- **נגישות** - תמיכה מלאה ב-WCAG
- **ביצועים מהירים** - אופטימיזציה מתקדמת
- **חוויית משתמש חלקה** - אנימציות וטרנזישנים

## 🏗️ מבנה הפרויקט

```
src/
├── 📁 components/                    # רכיבי React
│   ├── 🎨 ui/                       # רכיבי UI בסיסיים
│   │   ├── ContentCard.jsx         # קונטיינר תוכן
│   │   ├── PrimaryButton.jsx       # כפתורים עם וריאנטים
│   │   ├── StatusBadge.jsx        # אינדיקטורי סטטוס
│   │   └── UserAvatar.jsx         # תצוגת אווטר משתמש
│   ├── 🏗️ layout/                  # רכיבי פריסה
│   │   ├── Footer.jsx              # כותרת תחתונה
│   │   └── Navbar.jsx              # סרגל ניווט
│   └── ⚡ features/                # רכיבי תכונות
│       ├── 🛡️ admin/              # פונקציונליות admin
│       │   └── AdminRoute.jsx     # הגנת נתיבי admin
│       ├── 🗣️ debate/             # תכונות דיבייט
│       │   └── CreateDebateModal.jsx # יצירת דיבייט
│       ├── 🏠 homepage/           # רכיבי דף בית
│       │   ├── DebateCard.jsx     # כרטיס דיבייט
│       │   ├── DebateGrid.jsx     # פריסת רשת דיבייטים
│       │   ├── DebateSection.jsx  # קטעי דיבייטים
│       │   └── DebateStats.jsx    # סטטיסטיקות פלטפורמה
│       ├── 👤 profile/            # תכונות פרופיל
│       │   ├── EditProfile.jsx    # עריכת פרופיל
│       │   ├── ProfileCard.jsx    # תצוגת פרופיל
│       │   ├── UserDebateHistory.jsx # היסטוריית דיבייטים
│       │   └── UserStats.jsx      # סטטיסטיקות משתמש
│       └── 🗳️ voting/             # מערכת הצבעה
│           ├── AudienceDisplay.jsx # תצוגת קהל
│           ├── VoteBar.jsx        # סרגל הצבעה
│           └── VoteButtons.jsx    # כפתורי הצבעה
├── 📄 pages/                       # דפי נתיבים
│   ├── AdminPanelPage.jsx         # דשבורד admin
│   ├── DebatePage.jsx             # תצוגת דיבייט
│   ├── HomePage.jsx               # דף בית
│   ├── LoginPage.jsx              # התחברות
│   ├── ProfilePage.jsx            # פרופיל משתמש
│   ├── RegisterPage.jsx           # הרשמה
│   └── ReplayPage.jsx             # צפייה חוזרת
├── 🔧 services/                   # שירותי API
│   ├── argumentsApi.js            # API טיעונים
│   ├── serverApi.js               # שירות API ראשי
│   ├── socket.js                  # WebSocket connection
│   └── votingApi.js               # API הצבעה
├── 📦 stores/                     # חנויות MobX
│   ├── authManager.js             # ניהול אימות
│   ├── usersStore.js              # ניהול נתוני משתמשים
│   └── votingStore.js             # ניהול הצבעות
├── 🎣 hooks/                      # React Hooks מותאמים
│   ├── useDebateEnding.js         # ניהול סיום דיבייט
│   ├── useOptimizedRefresh.js     # רענון מותאם
│   └── useVoting.js               # ניהול הצבעות
└── 🛠️ utils/                      # כלי עזר
    ├── adminAuth.js               # אימות admin
    ├── brandColors.js             # צבעי מותג
    ├── constants.js               # קבועי אפליקציה
    ├── cookieManager.js           # ניהול cookies
    ├── errorHandler.js            # טיפול בשגיאות
    ├── formatters.js              # מעצבי נתונים
    ├── statistics.js              # עזרי סטטיסטיקה
    └── validators.js              # אימות קלט
```

## 🚀 התקנה והרצה

### דרישות מערכת

- **Node.js** 18+
- **npm** 9+
- **Git** 2.30+

### התקנה מהירה

```bash
# שכפול הפרויקט
git clone https://github.com/EladLaster/Final-Project-debateIL-Client.git
cd Final-Project-debateIL-Client

# התקנת תלויות
npm install

# הרצה במצב פיתוח
npm run dev

# בניית גרסת ייצור
npm run build

# תצוגה מקדימה של build
npm run preview
```

### משתני סביבה

צור קובץ `.env` בתיקיית השורש:

```env
VITE_API_BASE_URL=http://localhost:3030
VITE_APP_NAME=DebateIL
VITE_APP_VERSION=1.0.0
```

## 🛠️ טכנולוגיות

### **Frontend Core**

- **React 19.1.1** - ספריית UI מודרנית
- **Vite 7.1.6** - כלי build מהיר ומודרני
- **React Router 7.9.1** - ניהול נתיבים מתקדם

### **State Management**

- **MobX 6.13.7** - ניהול state תגובתי
- **MobX React 9.2.0** - אינטגרציה עם React

### **Styling & UI**

- **TailwindCSS 4.1.13** - עיצוב utility-first
- **FlyonUI 2.4.0** - רכיבי UI מוכנים

### **HTTP & Communication**

- **Axios 1.12.2** - HTTP client מתקדם
- **Socket.IO Client** - תקשורת real-time

### **Development Tools**

- **ESLint 9.36.0** - בדיקת איכות קוד
- **TypeScript Support** - תמיכה ב-TypeScript
- **Hot Module Replacement** - עדכון חם

## 📊 API Endpoints

### 🔐 **אימות משתמשים**

```http
POST   /auth/register          # הרשמה
POST   /auth/login             # התחברות
GET    /api/users/profile      # פרופיל נוכחי
PUT    /api/users/profile      # עדכון פרופיל
```

### 🗣️ **ניהול דיבייטים**

```http
GET    /api/debates            # רשימת דיבייטים
GET    /api/debates/:id        # דיבייט ספציפי
POST   /api/debates            # יצירת דיבייט
PUT    /api/debates/:id        # עדכון דיבייט
DELETE /api/debates/:id        # מחיקת דיבייט
POST   /api/debates/:id/register # הרשמה לדיבייט
POST   /api/debates/:id/finish  # סיום דיבייט
```

### 💬 **מערכת טיעונים**

```http
GET    /api/debates/:id/arguments     # טיעונים לדיבייט
POST   /api/debates/:id/arguments     # יצירת טיעון
PUT    /api/debates/:id/arguments/:argId # עדכון טיעון
DELETE /api/debates/:id/arguments/:argId # מחיקת טיעון
```

### 🗳️ **מערכת הצבעה**

```http
PATCH  /api/debates/:id/vote/user1    # הצבעה למשתתף 1
PATCH  /api/debates/:id/vote/user2    # הצבעה למשתתף 2
GET    /api/debates/:id/votes         # תוצאות הצבעה
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

### **ביצועים**

- **Code Splitting** - חלוקת קוד
- **Lazy Loading** - טעינה עצלה
- **Image Optimization** - אופטימיזציית תמונות
- **Bundle Analysis** - ניתוח bundle

## 🔧 פיתוח

### **Scripts זמינים**

```bash
npm run dev          # הרצה במצב פיתוח
npm run build        # בניית ייצור
npm run preview      # תצוגה מקדימה
npm run lint         # בדיקת ESLint
npm run lint:fix     # תיקון אוטומטי
```

### **מבנה Git**

```bash
main                 # ענף ייצור
develop             # ענף פיתוח
feature/*           # תכונות חדשות
hotfix/*            # תיקונים דחופים
```

### **Standards & Best Practices**

- **ESLint Configuration** - כללי קוד מחמירים
- **Component Structure** - מבנה רכיבים עקבי
- **Naming Conventions** - מוסכמות שמות
- **Error Boundaries** - טיפול בשגיאות
- **Performance Monitoring** - מעקב ביצועים

## 📈 ביצועים

### **Core Web Vitals**

- **LCP** < 2.5s - Largest Contentful Paint
- **FID** < 100ms - First Input Delay
- **CLS** < 0.1 - Cumulative Layout Shift

### **Bundle Size**

- **JavaScript** ~432KB (gzipped: ~128KB)
- **CSS** ~44KB (gzipped: ~8KB)
- **Images** ~4MB (optimized)

## 🚀 Deployment

### **Render.com**

```bash
# הגדרת build command
npm run build

# הגדרת start command
npm run start

# משתני סביבה
VITE_API_BASE_URL=https://your-server.onrender.com
```

### **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## 🤝 תרומה לפרויקט

### **הנחיות תרומה**

1. **Fork** הפרויקט
2. **צור branch** חדש (`git checkout -b feature/amazing-feature`)
3. **Commit** השינויים (`git commit -m 'Add amazing feature'`)
4. **Push** ל-branch (`git push origin feature/amazing-feature`)
5. **פתח Pull Request**

### **Code Review**

- **קוד נקי** - עקוב אחר ESLint
- **תיעוד** - הוסף הערות לקוד מורכב
- **בדיקות** - וודא שהקוד עובד
- **ביצועים** - בדוק השפעה על ביצועים

## 📄 רישיון

פרויקט זה מוגן תחת רישיון MIT. ראה קובץ [LICENSE](LICENSE) לפרטים.

## 👥 צוות הפיתוח

- **Elad Laster** - Full Stack Developer
- **Lior Kirshner** - Frontend Specialist

## 📞 יצירת קשר

- **GitHub Issues** - דיווח על באגים
- **Discussions** - שאלות ודיונים
- **Email** - contact@debateil.com

---

<div align="center">

**🌟 אם הפרויקט עזר לך, תן לו ⭐**

[![GitHub stars](https://img.shields.io/github/stars/EladLaster/Final-Project-debateIL-Client?style=social)](https://github.com/EladLaster/Final-Project-debateIL-Client)

</div>
