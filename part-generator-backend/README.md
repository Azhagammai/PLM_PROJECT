# Part Number Generator — Spring Boot Backend

## Quick Start (IntelliJ IDEA)

### Step 1 — Prerequisites
- Java 21 JDK installed
- PostgreSQL installed and running
- IntelliJ IDEA (any edition)

### Step 2 — Create the PostgreSQL Database
Open pgAdmin or psql and run:
```sql
CREATE DATABASE partgeneratordb;
```

### Step 3 — Configure your password
Open:  src/main/resources/application.properties

Change this line to match YOUR PostgreSQL password:
```
spring.datasource.password=your_postgres_password_here
```

### Step 4 — Open in IntelliJ
1. Open IntelliJ IDEA
2. File → Open → select the `part-generator-backend` folder
3. IntelliJ will auto-detect it as a Maven project
4. Wait for it to download all dependencies (takes 1-2 minutes first time)

### Step 5 — Run the Application
- Open:  src/main/java/com/partgenerator/PartGeneratorApplication.java
- Click the green ▶ Run button
- Watch the console — you will see:
  ```
  =====================================================
    Part Number Generator Backend is RUNNING!
    API available at: http://localhost:8080/api
    Health check:     http://localhost:8080/api/health
  =====================================================
  ```

### Step 6 — Test the API
Open your browser and go to:
  http://localhost:8080/api/health

You should see:
```json
{
  "status": "UP",
  "service": "Part Number Generator",
  "version": "1.0.0"
}
```

---

## API Endpoints Reference

| Method | URL                          | What It Does                    |
|--------|------------------------------|---------------------------------|
| GET    | /api/health                  | Health check                    |
| POST   | /api/parts/generate          | Generate a new part number      |
| GET    | /api/parts                   | Get all parts (paginated)       |
| GET    | /api/parts/{id}              | Get one part by ID              |
| GET    | /api/parts/number/{pn}       | Get one part by part number     |
| GET    | /api/parts/search?q=MECH     | Search and filter parts         |
| GET    | /api/parts/recent            | Get last 10 parts               |
| PATCH  | /api/parts/{id}/status       | Update part status              |
| DELETE | /api/parts/{id}              | Delete a part                   |
| GET    | /api/analytics               | Dashboard analytics data        |

---

## Generate Part — Sample Request Body (POST /api/parts/generate)

```json
{
  "category":    "MECH",
  "subcategory": "BODY",
  "material":    "AL",
  "plant":       "MX",
  "revision":    "A",
  "description": "Chassis Main Body Panel",
  "owner":       "student6"
}
```

## Sample Response
```json
{
  "success": true,
  "message": "Part number generated successfully: MECH-BODY-AL-MX26-10009-A",
  "data": {
    "id": 9,
    "partNumber": "MECH-BODY-AL-MX26-10009-A",
    "description": "Chassis Main Body Panel",
    "category": "MECH",
    "subcategory": "BODY",
    "material": "AL",
    "plant": "MX",
    "revision": "A",
    "status": "IN_REVIEW",
    "owner": "student6",
    "quantity": 0,
    "createdAt": "2026-03-02T10:30:00",
    "updatedAt": "2026-03-02T10:30:00"
  }
}
```

---

## Part Number Schema
```
[CATEGORY]-[SUBCATEGORY]-[MATERIAL]-[PLANT][YY]-[SERIAL]-[REVISION]

Example: MECH-BODY-AL-MX26-10009-A
```

| Segment     | Example | Description                              |
|-------------|---------|------------------------------------------|
| CATEGORY    | MECH    | MECH, ELEC, HYDR, PNEU, STRC            |
| SUBCATEGORY | BODY    | Depends on category                      |
| MATERIAL    | AL      | AL, SS, TI, PL, CR, RB                  |
| PLANT+YEAR  | MX26    | Plant code + last 2 digits of year       |
| SERIAL      | 10009   | Auto-incremented, stored in DB           |
| REVISION    | A       | A through E                              |

---

## Teamcenter Integration (Future)
When ready to connect to Teamcenter, add:
- src/main/java/com/partgenerator/service/TeamcenterService.java
- Call it from PartService.generateAndSave() after saving to PostgreSQL
- No other files need to change
