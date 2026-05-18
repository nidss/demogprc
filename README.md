# GRANDPRIX RUNBIKE CHAMPIONSHIP 2026

ระบบลงทะเบียนนักแข่ง Runbike Championship 2026 — Static HTML app เปิดได้ตรงๆ ในเบราว์เซอร์

## 🏁 Live Demo

เปิดที่ → **https://nidss.github.io/demogprc/**

## ✨ Features

- 📝 สมัครสมาชิก + เข้าสู่ระบบ + ยืนยัน OTP + รับข้อตกลง PDPA
- 🏎️ ลงทะเบียนนักแข่งหลายคน (เพิ่ม/ลบได้)
- 🗓️ เลือกวันแข่ง 8 วัน เดือนมิถุนายน 2569 (เสาร์/อาทิตย์)
- 🏆 เลือกรุ่น 13 รุ่น 3 กลุ่ม
  - **มาตรฐาน:** U1–U7 (แบ่งตามอายุ)
  - **Open Girl:** Junior / Senior / Pro (เฉพาะนักแข่งหญิง)
  - **Open:** Junior / Senior / Pro (แบ่งตามปีเกิด)
- 📎 อัปโหลดเอกสารยืนยัน (ใบเกิด / บัตรประชาชน)
- 👨‍👩‍👧 ข้อมูลผู้ปกครอง
- 🎫 ใส่คูปองส่วนลด
- 💳 ชำระเงินผ่าน BEAM (จำลอง)
- ✅ QR Code ลงทะเบียน
- หน้า Dashboard (Admin)
- หน้า Check-in (Admin)

## 🧪 Test Coupons

- `RACE100` — ลด 100 บาท
- `RACE10P` — ลด 10%
- `NEWBIE` — ลด 200 บาท

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
