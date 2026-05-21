# GRANDPRIX RUNBIKE CHAMPIONSHIP 2026

ระบบลงทะเบียนนักแข่ง Runbike Championship 2026 — Static HTML app เปิดได้ตรงๆ ในเบราว์เซอร์

## 🏁 Live Demo

เปิดที่ → **https://nidss.github.io/demogprc/**

## ✨ Features

- 📝 สมัครสมาชิก + เข้าสู่ระบบ + ยืนยัน OTP + รับข้อตกลง PDPA
- 📝 ลืมรหัสผ่าน
- 🏎️ ลงทะเบียนนักแข่งหลายคน (เพิ่ม/ลบได้)
- 🗓️ เลือกวันแข่ง 8 วัน เดือนมิถุนายน 2569 (เสาร์/อาทิตย์)
- 🏆 เลือกรุ่น 17 รุ่น
  - รุ่นอายุ 2 ปี (2.0-3.0 Years Old)
  - รุ่นอายุ 3 ปี "B" (3.1-3.6 Years Old)
  - รุ่นอายุ 3 ปี "A" (3.7-4.0 Years Old)
  - รุ่นอายุ 4 ปี "B" (4.1-4.6 Years Old)
  - รุ่นอายุ 4 ปี "A" (4.7-5.0 Years Old)
  - รุ่นอายุ 5 ปี "B" (5.1-5.6 Years Old)
  - รุ่นอายุ 5 ปี "A" (5.7-6.0 Years Old)
  - รุ่นอายุ 6 ปี "B" (6.1-6.6 Years Old)
  - รุ่นอายุ 6 ปี "A" (6.7-7.0 Years Old)
  - รุ่นอายุ 7.1 -8.0 ปี (7.1-8.0 Years Old)
  - รุ่นอายุ 8.1-10.0 ปี (8.1-10.0 Years Old)
  - รุ่นผู้หญิงจูเนียร์ เกิดปี 2022-2023 (Open Girl - Junior 2022-2023)
  - รุ่นผู้หญิงซีเนียร์ เกิดปี 2020-2021 (Open Girl - Senior 2020-2021)
  - รุ่นผู้หญิงโปร เกิดปี 2017-2019 (Open Girl - Pro 2017-2019 )
  - รุ่นโอเพ่นจูเนียร์ เกิดปี 2022-2023 (Open Junior/2022-2023)
  - รุ่นโอเพ่นซีเนียร์ เกิดปี 2020-2021 (Open Senior/2020-2021)
  - รุ่นโอเพ่นโปร เกิดปี 2013-2019 (Open Pro/2013-2019)
- 📎 อัปโหลดเอกสารยืนยัน (ใบเกิด / บัตรประชาชน)
- 👨‍👩‍👧 ข้อมูลผู้ปกครอง
- 🎫 ใส่คูปองส่วนลด
- 💳 ชำระเงินผ่าน BEAM (จำลอง)
- ✅ QR Code ลงทะเบียน
- หน้า Dashboard (Admin) (กด Ctrl+Shift+Z เพื่อเปิดหน้า Login Admin)
- หน้า Check-in (Admin)

## 🧪 Test Coupons

- `GPRC10` — ลด 10% (เฉพาะรุ่นหลัก)
- `GPRCMAIN` — ฟรีรุ่นหลัก (รุ่นเพิ่มเติมยังคิดเงินตามปกติ)

## 🛠️ Tech Stack

- **React 18** (via esm.sh ESM CDN)
- **Tailwind CSS** (Play CDN)
- **Babel Standalone** (JSX transform ในเบราว์เซอร์)
- **Lucide React** icons
- ไม่มี build step — รันได้ตรงๆ จาก static files

## 📂 Structure

```
demogprc/
├── index.html       — HTML entry + CDN imports + JSX runner
├── app.jsx          — React app code (JSX, ~73KB)
└── assets/
    ├── hero.png     — Hero banner
    ├── grandprix-logo.png     — Logo GPRC
    ├── bg.jpg       — Background image
    └── success.png
```

## 🚀 Local Development

```bash
# clone
git clone https://github.com/nidss/demogprc.git
cd demogprc

# เปิด local server
python3 -m http.server 8000
# หรือ
npx serve

# เปิดเบราว์เซอร์ที่ http://localhost:8000
```

## 📄 License

© 2026 NidSs
