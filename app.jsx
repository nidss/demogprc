import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, Calendar, Plus, Trash2, Tag, CreditCard, Check, ArrowLeft, ArrowRight, MapPin, X, ChevronDown, Upload, FileText as FileIcon, Sparkles, Zap, Flag, Trophy } from 'lucide-react';
import { createRoot } from 'react-dom/client';
// Logo as inline base64 — single-file portability
const LOGO_DATA_URL = './assets/logo.png';
const BG_DATA_URL = './assets/bg.jpg';
const MASCOT_LEFT = './assets/mascot-left.jpg';
const MASCOT_RIGHT = './assets/mascot-right.jpg';
const HERO_BANNER = './assets/hero.png';
const SUCCESS_BANNER = './assets/success.png';
const GRANDPRIX_LOGO = './assets/grandprix-logo.png';
const HERO_VIDEO = './assets/GRANDPRIX%20RUNBIKE%20CHAMPIONSHIP%20_Monomax.mp4';

// Events available for registration
const EVENTS = [
  {
    id: 'evt1',
    title: 'RUN BIKE',
    subtitle: 'ซีรีส์เปิดสนาม',
    dateRange: '26 มีนาคม 2569 - 26 มี.ค.',
    venue: 'สนามแข่งหลัก กรุงเทพฯ',
    status: 'รอการประกาศ',
    registered: 9,
    capacity: 200,
    coverImage: './assets/hero.png',
  },
  {
    id: 'evt2',
    title: 'GRANDPRIX RUNBIKE CHAMPIONSHIP 2026',
    subtitle: 'รายการแชมเปี้ยนชิประดับประเทศ',
    dateRange: '26 มีนาคม 2569 - 27 มี.ค.',
    venue: 'Siam Amazing Park · IMPACT Muangthong Thani',
    status: 'รอติดตาม',
    registered: 3,
    capacity: 100,
    coverImage: './assets/success.png',
    featured: true,
  },
];


// ============================================================
// CONFIG
// ============================================================
// ปี ค.ศ. ปัจจุบันสำหรับเช็คเกณฑ์
const RACE_TIERS = [
  // รุ่นมาตรฐาน — เช็คตามอายุ (days)
  { id: 'U1', label: 'U1', name: 'รุ่น U1', minDays: 3 * 365 + 1, maxDays: 4 * 365, range: '3 ปี 1 วัน – 4 ปี', price: 500, group: 'standard' },
  { id: 'U2', label: 'U2', name: 'รุ่น U2', minDays: 4 * 365 + 1, maxDays: 5 * 365, range: '4 ปี 1 วัน – 5 ปี', price: 600, group: 'standard' },
  { id: 'U3', label: 'U3', name: 'รุ่น U3', minDays: 5 * 365 + 1, maxDays: 6 * 365, range: '5 ปี 1 วัน – 6 ปี', price: 700, group: 'standard' },
  { id: 'U4', label: 'U4', name: 'รุ่น U4', minDays: 6 * 365 + 1, maxDays: 7 * 365, range: '6 ปี 1 วัน – 7 ปี', price: 800, group: 'standard' },
  { id: 'U5', label: 'U5', name: 'รุ่น U5', minDays: 7 * 365 + 1, maxDays: 10 * 365, range: '7 ปี 1 วัน – 10 ปี', price: 900, group: 'standard' },
  { id: 'U6', label: 'U6', name: 'รุ่น U6', minDays: 10 * 365 + 1, maxDays: 13 * 365, range: '10 ปี 1 วัน – 13 ปี', price: 1000, group: 'standard' },
  { id: 'U7', label: 'U7', name: 'รุ่น U7', minDays: 13 * 365 + 1, maxDays: 15 * 365, range: '13 ปี 1 วัน – 15 ปี', price: 1200, group: 'standard' },

  // รุ่นผู้หญิง — เช็คตามปีเกิด
  { id: 'GJ', label: 'Open Girl · Junior', name: 'ผู้หญิงจูเนียร์', birthYears: [2022, 2023], range: 'เกิดปี 2022 – 2023', price: 800, group: 'girl', gender: 'female' },
  { id: 'GS', label: 'Open Girl · Senior', name: 'ผู้หญิงซีเนียร์', birthYears: [2020, 2021], range: 'เกิดปี 2020 – 2021', price: 900, group: 'girl', gender: 'female' },
  { id: 'GP', label: 'Open Girl · Pro', name: 'ผู้หญิงโปร', birthYears: [2017, 2018, 2019], range: 'เกิดปี 2017 – 2019', price: 1000, group: 'girl', gender: 'female' },

  // รุ่นโอเพ่น — เช็คตามปีเกิด
  { id: 'OJ', label: 'Open · Junior', name: 'โอเพ่นจูเนียร์', birthYears: [2022, 2023], range: 'เกิดปี 2022 – 2023', price: 800, group: 'open' },
  { id: 'OS', label: 'Open · Senior', name: 'โอเพ่นซีเนียร์', birthYears: [2020, 2021], range: 'เกิดปี 2020 – 2021', price: 900, group: 'open' },
  { id: 'OP', label: 'Open · Pro', name: 'โอเพ่นโปร', birthYears: [2013, 2014, 2015, 2016, 2017, 2018, 2019], range: 'เกิดปี 2013 – 2019', price: 1100, group: 'open' },
];

const TIER_GROUPS = [
  { id: 'standard', label: 'รุ่นมาตรฐาน', desc: 'แบ่งตามช่วงอายุ' },
  { id: 'girl', label: 'Open Girl (รุ่นผู้หญิง)', desc: 'เฉพาะนักแข่งหญิง' },
  { id: 'open', label: 'Open (รุ่นโอเพ่น)', desc: 'แบ่งตามปีเกิด' },
];

const RACE_DATES = [
  { id: 'D1', month: 'มิ.ย.', monthEn: 'JUN', day: 6, weekday: 'เสาร์', short: 'ส. 6 มิ.ย.', full: 'เสาร์ 6 มิถุนายน 2569' },
  { id: 'D2', month: 'มิ.ย.', monthEn: 'JUN', day: 7, weekday: 'อาทิตย์', short: 'อา. 7 มิ.ย.', full: 'อาทิตย์ 7 มิถุนายน 2569' },
  { id: 'D3', month: 'มิ.ย.', monthEn: 'JUN', day: 13, weekday: 'เสาร์', short: 'ส. 13 มิ.ย.', full: 'เสาร์ 13 มิถุนายน 2569' },
  { id: 'D4', month: 'มิ.ย.', monthEn: 'JUN', day: 14, weekday: 'อาทิตย์', short: 'อา. 14 มิ.ย.', full: 'อาทิตย์ 14 มิถุนายน 2569' },
  { id: 'D5', month: 'มิ.ย.', monthEn: 'JUN', day: 20, weekday: 'เสาร์', short: 'ส. 20 มิ.ย.', full: 'เสาร์ 20 มิถุนายน 2569' },
  { id: 'D6', month: 'มิ.ย.', monthEn: 'JUN', day: 21, weekday: 'อาทิตย์', short: 'อา. 21 มิ.ย.', full: 'อาทิตย์ 21 มิถุนายน 2569' },
  { id: 'D7', month: 'มิ.ย.', monthEn: 'JUN', day: 27, weekday: 'เสาร์', short: 'ส. 27 มิ.ย.', full: 'เสาร์ 27 มิถุนายน 2569' },
  { id: 'D8', month: 'มิ.ย.', monthEn: 'JUN', day: 28, weekday: 'อาทิตย์', short: 'อา. 28 มิ.ย.', full: 'อาทิตย์ 28 มิถุนายน 2569' },
];

const COUPONS = {
  'GPRC10': { type: 'percent10', label: 'ส่วนลด 10% (ทั้งหมดของนักแข่งคนนี้)' },
  'GPRCMAIN': { type: 'main-free', label: 'ฟรีรุ่นหลัก (รุ่นเพิ่มเติมคิดเงินปกติ)' },
};

// ============================================================
// HELPERS
// ============================================================
const calcAgeDays = (d) => { if (!d) return 0; return Math.floor((new Date() - new Date(d)) / 86400000); };
const calcAgeYM = (d) => {
  if (!d) return { years: 0, months: 0 };
  const b = new Date(d), today = new Date();
  let y = today.getFullYear() - b.getFullYear();
  let m = today.getMonth() - b.getMonth();
  if (today.getDate() < b.getDate()) m -= 1;
  if (m < 0) { y -= 1; m += 12; }
  return { years: y, months: m };
};
const getEligibleTiers = (d, gender) => {
  if (!d) return [];
  const days = calcAgeDays(d);
  const birthYear = new Date(d).getFullYear();
  return RACE_TIERS.filter(t => {
    // กรองเรื่องเพศ — รุ่นผู้หญิงเฉพาะนักแข่งหญิง
    if (t.gender === 'female' && gender !== 'female') return false;
    // เช็คตามปีเกิด
    if (t.birthYears) return t.birthYears.includes(birthYear);
    // เช็คตามอายุเป็นวัน
    if (t.minDays != null && t.maxDays != null) return days >= t.minDays && days <= t.maxDays;
    return false;
  });
};
const fmt = (n) => n.toLocaleString('th-TH');
const newRacer = () => ({
  id: Date.now() + Math.random(),
  thFirstName: '', thLastName: '',
  enFirstName: '', enLastName: '',
  nickname: '',
  birthDate: '',
  gender: '', // 'male' | 'female'
  shirtSize: '', // XS | S | M | L | XL | XXL | 3XL
  country: 'TH', // ISO code
  teamName: '',
  documents: [],
  selectedDates: [],
  selectedRaces: {},
});

// Shirt sizes
const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

// Countries (Thailand + ASEAN + ที่ใกล้)
const COUNTRIES = [
  { code: 'TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'LA', name: 'ลาว', flag: '🇱🇦' },
  { code: 'KH', name: 'กัมพูชา', flag: '🇰🇭' },
  { code: 'MY', name: 'มาเลเซีย', flag: '🇲🇾' },
  { code: 'SG', name: 'สิงคโปร์', flag: '🇸🇬' },
  { code: 'VN', name: 'เวียดนาม', flag: '🇻🇳' },
  { code: 'ID', name: 'อินโดนีเซีย', flag: '🇮🇩' },
  { code: 'PH', name: 'ฟิลิปปินส์', flag: '🇵🇭' },
  { code: 'MM', name: 'เมียนมา', flag: '🇲🇲' },
  { code: 'JP', name: 'ญี่ปุ่น', flag: '🇯🇵' },
  { code: 'KR', name: 'เกาหลีใต้', flag: '🇰🇷' },
  { code: 'CN', name: 'จีน', flag: '🇨🇳' },
  { code: 'TW', name: 'ไต้หวัน', flag: '🇹🇼' },
  { code: 'HK', name: 'ฮ่องกง', flag: '🇭🇰' },
  { code: 'AU', name: 'ออสเตรเลีย', flag: '🇦🇺' },
  { code: 'OTHER', name: 'อื่นๆ', flag: '🌍' },
];

// ============================================================
// PRIMITIVES
// ============================================================
const Input = React.forwardRef(({ className = '', icon: Icon, ...props }, ref) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />}
    <input
      ref={ref}
      {...props}
      className={`w-full h-10 ${Icon ? 'pl-9' : 'pl-3'} pr-3 text-sm rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition ${className}`}
    />
  </div>
));
Input.displayName = 'Input';

const Label = ({ children, required }) => (
  <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {children}{required && <span className="text-slate-600 ml-0.5">*</span>}
  </label>
);

const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
  };
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-11 px-5 text-sm', lg: 'h-12 px-6 text-base' };
  return (
    <button
      {...props}
      className={`${variants[variant]} ${sizes[size]} font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children }) => (
  <div className="relative bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-red-900/5">
    {/* corner accent */}
    <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" aria-hidden="true" />
    {children}
  </div>
);

const Header = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-5 flex items-start gap-3">
    {Icon && (
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Alert = ({ children }) => (
  <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
    {children}
  </div>
);

const Divider = () => <div className="border-t border-slate-100" />;

// ============================================================
// MODAL
// ============================================================
function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    // lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* dialog */}
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <h3 id="modal-title" className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 -m-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// RULES CONTENT
// ============================================================
const RULES_SECTIONS = [
  {
    title: '1. คุณสมบัตินักแข่ง',
    items: [
      'นักแข่งต้องมีอายุระหว่าง 3 ปี 1 วัน – 15 ปี ณ วันแข่งขัน',
      'นักแข่งต้องลงแข่งในรุ่นที่ตรงตามเกณฑ์อายุของตน',
      'ผู้ปกครองหรือผู้ดูแลตามกฎหมายต้องอยู่ในงานตลอดระยะเวลาการแข่งขัน',
      'ต้องแสดงสำเนาสูติบัตรหรือบัตรประชาชนของนักแข่งในวันลงทะเบียนหน้างาน',
    ],
  },
  {
    title: '2. รุ่นการแข่งขัน',
    items: [
      'U1 — อายุ 3 ปี 1 วัน – 4 ปี · ค่าสมัคร 500 บาท',
      'U2 — อายุ 4 ปี 1 วัน – 5 ปี · ค่าสมัคร 600 บาท',
      'U3 — อายุ 5 ปี 1 วัน – 6 ปี · ค่าสมัคร 700 บาท',
      'U4 — อายุ 6 ปี 1 วัน – 7 ปี · ค่าสมัคร 800 บาท',
      'U5 — อายุ 7 ปี 1 วัน – 10 ปี · ค่าสมัคร 900 บาท',
      'U6 — อายุ 10 ปี 1 วัน – 13 ปี · ค่าสมัคร 1,000 บาท',
      'U7 — อายุ 13 ปี 1 วัน – 15 ปี · ค่าสมัคร 1,200 บาท',
    ],
  },
  {
    title: '3. อุปกรณ์ที่ใช้ในการแข่งขัน',
    items: [
      'รถ Runbike (Balance Bike) ที่ไม่มีบันได ไม่มีโซ่ ไม่มีระบบขับเคลื่อน',
      'ขนาดล้อไม่เกิน 14 นิ้ว',
      'หมวกกันน็อกที่ได้มาตรฐาน (CE, DOT, Snell)',
      'แนะนำให้สวมสนับเข่า สนับศอก และถุงมือเพื่อความปลอดภัย',
      'ผู้จัดงานขอสงวนสิทธิ์ในการตรวจสอบและไม่อนุญาตให้ใช้อุปกรณ์ที่ไม่เป็นไปตามมาตรฐาน',
    ],
  },
  {
    title: '4. การแข่งขันและกติกา',
    items: [
      'นักแข่งต้องลงสนามตามลำดับและรุ่นที่ได้รับการจัดสรร',
      'ห้ามใช้เท้าถีบเกินกว่ากติกาที่กำหนดในแต่ละรุ่น',
      'การเล่นผิดกติกาหรือก่อกวนนักแข่งคนอื่นจะถูกตัดสิทธิ์ทันที',
      'การตัดสินของคณะกรรมการถือเป็นที่สิ้นสุด',
    ],
  },
  {
    title: '5. การคืนเงินและยกเลิก',
    items: [
      'เมื่อชำระเงินแล้ว ไม่สามารถขอคืนเงินได้ทุกกรณี',
      'สามารถเปลี่ยนวันแข่งหรือนักแข่งได้ภายใน 7 วันก่อนวันแข่ง',
      'หากการแข่งขันถูกเลื่อนเนื่องจากเหตุสุดวิสัย ผู้จัดงานจะแจ้งวันใหม่ผ่านอีเมลที่ลงทะเบียน',
      'หากการแข่งขันถูกยกเลิกโดยสิ้นเชิง ผู้สมัครจะได้รับเงินคืน 80% ของค่าสมัคร',
    ],
  },
  {
    title: '6. ความปลอดภัยและความรับผิดชอบ',
    items: [
      'ผู้ปกครองต้องลงนามรับทราบความเสี่ยงในการแข่งขัน',
      'ผู้จัดงานไม่รับผิดชอบต่อการสูญหายของทรัพย์สินส่วนบุคคล',
      'นักแข่งทุกคนได้รับการคุ้มครองด้วยประกันอุบัติเหตุระหว่างการแข่งขัน',
      'กรุณาพบเจ้าหน้าที่ปฐมพยาบาลทันทีหากเกิดอุบัติเหตุ',
    ],
  },
];

const PdpaContent = () => (
  <div className="space-y-4">
    <p className="text-xs text-slate-500 leading-relaxed">
      <span className="font-semibold text-slate-900">GRANDPRIX RUNBIKE CHAMPIONSHIP 2026</span> ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่านและผู้แข่งขัน โปรดอ่านนโยบายฉบับนี้โดยละเอียด เพื่อความเข้าใจในการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล
    </p>

    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1.5">1. ข้อมูลที่เราจัดเก็บ</h4>
      <ul className="space-y-1">
        {[
          'ชื่อ-นามสกุล ของผู้สมัครและผู้แข่ง (ภาษาไทยและภาษาอังกฤษ)',
          'วัน-เดือน-ปีเกิด, เพศ, อายุ ของผู้แข่ง',
          'อีเมล เบอร์โทรศัพท์ และที่อยู่ของผู้ปกครอง',
          'รูปสำเนาเอกสารยืนยันตัวตน (สูติบัตร/บัตรประชาชน) ของผู้แข่ง',
          'ข้อมูลการชำระเงิน (ผ่านระบบ BEAM)',
        ].map((item, i) => (
          <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
            <span className="text-slate-400 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1.5">2. วัตถุประสงค์การใช้ข้อมูล</h4>
      <ul className="space-y-1">
        {[
          'ลงทะเบียนเข้าร่วมการแข่งขันและจัดการรายชื่อนักแข่ง',
          'ตรวจสอบคุณสมบัติ (เช่น อายุ) ตามรุ่นที่ลงแข่ง',
          'ติดต่อสื่อสารเกี่ยวกับการแข่งขัน ผลการแข่งขัน และประชาสัมพันธ์กิจกรรมในเครือ',
          'ออกใบเสร็จและจัดส่งของรางวัล',
          'ตรวจสอบการชำระเงินและการเข้าร่วมงาน (เช่น เช็คอินหน้างาน)',
        ].map((item, i) => (
          <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
            <span className="text-slate-400 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1.5">3. การเปิดเผยข้อมูล</h4>
      <ul className="space-y-1">
        {[
          'เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านต่อบุคคลที่สามโดยปราศจากความยินยอม',
          'อาจเปิดเผยข้อมูลให้ผู้สนับสนุนหลัก (Sponsor) ตามที่ระบุในข้อตกลง',
          'การเปิดเผยข้อมูลกับหน่วยงานราชการเป็นไปตามกฎหมายที่กำหนด',
        ].map((item, i) => (
          <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
            <span className="text-slate-400 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1.5">4. สิทธิของเจ้าของข้อมูล</h4>
      <ul className="space-y-1">
        {[
          'ขอเข้าถึงข้อมูลส่วนบุคคลของตน',
          'ขอแก้ไขข้อมูลที่ไม่ถูกต้อง',
          'ขอลบหรือทำลายข้อมูล (ภายใต้เงื่อนไขที่กฎหมายกำหนด)',
          'ขอถอนความยินยอมเมื่อใดก็ได้',
          'ขอให้โอนถ่ายข้อมูลส่วนบุคคล',
        ].map((item, i) => (
          <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
            <span className="text-slate-400 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1.5">5. การเก็บรักษาข้อมูล</h4>
      <ul className="space-y-1">
        {[
          'ข้อมูลจะถูกเก็บรักษาเป็นระยะเวลาที่จำเป็นตามวัตถุประสงค์',
          'รูปและวิดีโอจากการแข่งขันอาจถูกเก็บไว้เพื่อประชาสัมพันธ์ในอนาคต',
          'ข้อมูลทางการเงินจะถูกเก็บตามที่กฎหมายภาษีกำหนด',
        ].map((item, i) => (
          <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
            <span className="text-slate-400 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-md bg-slate-50 border border-slate-200 p-3 mt-4">
      <p className="text-[11px] text-slate-500 leading-relaxed">
        เจ้าหน้าที่คุ้มครองข้อมูล (DPO): <span className="font-medium text-slate-900">privacy@gprc.example.com</span> · โทร <span className="font-medium text-slate-900">02-XXX-XXXX</span>
      </p>
      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
        การกด "รับทราบและยอมรับ" ถือเป็นการยินยอมให้จัดเก็บและใช้ข้อมูลส่วนบุคคลตามนโยบายฉบับนี้
      </p>
    </div>
  </div>
);

const RulesContent = () => (
  <div className="space-y-4">
    <p className="text-xs text-slate-500 leading-relaxed">
      กรุณาอ่านกฎกติกาการแข่งขัน <span className="font-semibold text-slate-900">GRANDPRIX RUNBIKE CHAMPIONSHIP 2026</span> โดยละเอียดก่อนยอมรับ การลงทะเบียนเข้าแข่งขันถือเป็นการยอมรับเงื่อนไขทั้งหมดต่อไปนี้
    </p>
    {RULES_SECTIONS.map((section, i) => (
      <div key={i}>
        <h4 className="text-sm font-semibold text-slate-900 mb-1.5">{section.title}</h4>
        <ul className="space-y-1">
          {section.items.map((item, j) => (
            <li key={j} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
              <span className="text-slate-400 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
    <div className="rounded-md bg-slate-50 border border-slate-200 p-3 mt-4">
      <p className="text-[11px] text-slate-500 leading-relaxed">
        หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อผู้จัดงานที่ <span className="font-medium text-slate-900">info@gprc.example.com</span> หรือโทร <span className="font-medium text-slate-900">02-XXX-XXXX</span>
      </p>
    </div>
  </div>
);

const QRPattern = () => (
  <div className="grid grid-cols-12 gap-px w-full h-full">
    {Array.from({ length: 144 }).map((_, i) => {
      const v = (i * 17 + Math.floor(i / 12) * 31) % 7;
      return <div key={i} className={`${v < 3 ? 'bg-slate-900' : 'bg-transparent'}`} />;
    })}
  </div>
);

// ============================================================
// PROGRESS BAR
// ============================================================
const STEPS = [
  { id: 1, label: 'บัญชี' },
  { id: 2, label: 'นักแข่ง' },
  { id: 3, label: 'ผู้ปกครอง' },
  { id: 4, label: 'สรุปยอด' },
  { id: 5, label: 'ชำระเงิน' },
];

function ProgressBar({ current }) {
  const pct = ((current - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="font-bold text-slate-900 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
          ขั้นตอนที่ {current} / {STEPS.length}
        </span>
        <span className="text-red-600 font-semibold">{STEPS[current - 1]?.label}</span>
      </div>
      <div className="relative h-2 bg-slate-200/70 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full transition-all duration-700 ease-out"
          style={{ left: `calc(${pct}% - 48px)`, opacity: pct > 0 && pct < 100 ? 1 : 0 }}
        />
      </div>
      <div className="flex justify-between mt-2.5">
        {STEPS.map(s => {
          const isDone = s.id < current;
          const isCurrent = s.id === current;
          return (
            <div key={s.id} className="flex flex-col items-center gap-1 flex-1">
              <div className={`relative w-2.5 h-2.5 rounded-full transition-all ${
                isCurrent ? 'bg-red-600 ring-4 ring-red-100 scale-110' :
                isDone ? 'bg-red-500' : 'bg-slate-300'
              }`}>
                {isCurrent && <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-40" />}
              </div>
              <span className={`text-[10px] hidden sm:block transition-colors ${
                isCurrent ? 'text-slate-900 font-bold' :
                isDone ? 'text-red-600 font-medium' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// STEP 1: ACCOUNT (signup + OTP + consent in one card)
// ============================================================
function StepAccount({ data, setData, next }) {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [phase, setPhase] = useState('signup'); // signup | otp | consent | login
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [err, setErr] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [pdpaOpen, setPdpaOpen] = useState(false);
  const [pdpaRead, setPdpaRead] = useState(false);
  const [rulesRead, setRulesRead] = useState(false);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setPhase(newMode === 'register' ? 'signup' : 'login');
    setErr('');
  };

  const goToOtp = () => {
    if (!data.username || !data.email || !data.password) return setErr('กรุณากรอกข้อมูลให้ครบ');
    if (data.password !== data.confirmPassword) return setErr('รหัสผ่านไม่ตรงกัน');
    if (!/^0\d{9}$/.test(data.phone || '')) return setErr('เบอร์โทรไม่ถูกต้อง (10 หลัก ขึ้นต้น 0)');
    if (!/\S+@\S+\.\S+/.test(data.email)) return setErr('รูปแบบอีเมลไม่ถูกต้อง');
    setErr('');
    setPhase('otp');
    setCountdown(300);
  };

  const submitLogin = () => {
    if (!loginForm.identifier || !loginForm.password) return setErr('กรุณากรอกอีเมล/ชื่อผู้ใช้ และรหัสผ่าน');
    // demo: รหัสอะไรก็ผ่าน → ข้ามไปขั้นตอนถัดไปเลย (สมาชิกเดิมไม่ต้อง OTP/consent)
    setErr('');
    // เก็บข้อมูลพื้นฐาน
    setData({
      ...data,
      username: loginForm.identifier,
      email: loginForm.identifier.includes('@') ? loginForm.identifier : data.email,
      pdpa: true,
      rules: true,
    });
    next();
  };

  const verifyOtp = () => {
    if (otp.join('').length !== 6) return setErr('กรุณากรอก OTP 6 หลัก');
    setErr('');
    setPhase('consent');
  };

  const handleOtpChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const arr = [...otp]; arr[i] = v; setOtp(arr);
    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const finish = () => {
    if (!data.pdpa || !data.rules) return;
    next();
  };

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <Card>
      {/* Tab toggle — แสดงเฉพาะตอน signup/login (ไม่แสดงตอน OTP/consent) */}
      {(phase === 'signup' || phase === 'login') && (
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-5">
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 h-9 text-sm font-semibold rounded-md transition-all ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            สมัครสมาชิก
          </button>
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 h-9 text-sm font-semibold rounded-md transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      )}

      {phase === 'login' && (
        <>
          <Header icon={Lock} title="เข้าสู่ระบบ" subtitle="ยินดีต้อนรับกลับ! เข้าสู่ระบบเพื่อลงทะเบียนนักแข่ง" />
          <div className="space-y-3">
            <div>
              <Label required>อีเมลหรือชื่อผู้ใช้</Label>
              <Input
                icon={User}
                placeholder="email@example.com หรือ username"
                value={loginForm.identifier}
                onChange={e => setLoginForm({ ...loginForm, identifier: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600">
                  รหัสผ่าน <span className="text-red-500 ml-0.5">*</span>
                </label>
                <button type="button" className="text-[11px] text-red-600 hover:underline font-medium">
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <Input
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 accent-red-600" />
              <span>จดจำฉันในระบบ</span>
            </label>

            {err && <Alert>{err}</Alert>}

            <div className="pt-2">
              <Button onClick={submitLogin} className="w-full">
                เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-[11px] text-slate-400">หรือ</span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500">
              ยังไม่มีบัญชี?{' '}
              <button type="button" onClick={() => switchMode('register')} className="text-red-600 font-semibold hover:underline">
                สมัครสมาชิกใหม่
              </button>
            </p>
          </div>
        </>
      )}

      {phase === 'signup' && (
        <>
          <Header icon={User} title="สมัครสมาชิก" subtitle="เริ่มต้นโดยสร้างบัญชีและยืนยันเบอร์โทร" />
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label required>ชื่อผู้ใช้</Label>
                <Input icon={User} placeholder="Username" value={data.username} onChange={e => setData({ ...data, username: e.target.value })} />
              </div>
              <div>
                <Label required>เบอร์โทรศัพท์</Label>
                <Input icon={Phone} placeholder="08X-XXX-XXXX" maxLength={10} value={data.phone} onChange={e => setData({ ...data, phone: e.target.value.replace(/\D/g, '') })} />
              </div>
            </div>
            <div>
              <Label required>อีเมล</Label>
              <Input icon={Mail} type="email" placeholder="you@example.com" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label required>รหัสผ่าน</Label>
                <Input icon={Lock} type="password" placeholder="••••••••" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} />
              </div>
              <div>
                <Label required>ยืนยันรหัสผ่าน</Label>
                <Input icon={Lock} type="password" placeholder="••••••••" value={data.confirmPassword} onChange={e => setData({ ...data, confirmPassword: e.target.value })} />
              </div>
            </div>

            {err && <Alert>{err}</Alert>}

            <div className="pt-2">
              <Button onClick={goToOtp} className="w-full">
                รับรหัส OTP <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {phase === 'otp' && (
        <>
          <Header icon={Phone} title="กรอกรหัส OTP" subtitle={`รหัสถูกส่งไปที่ ${data.phone}`} />
          <div className="max-w-sm mx-auto space-y-4">
            <div className="flex gap-1.5 justify-center">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-11 h-12 text-center text-lg font-semibold rounded-md border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              ))}
            </div>
            <div className="text-center text-xs">
              {countdown > 0 ? (
                <span className="text-slate-500">ขอรหัสใหม่ใน <span className="font-medium text-slate-900">{mm}:{ss}</span></span>
              ) : (
                <button onClick={() => setCountdown(300)} className="text-slate-900 font-medium hover:underline">ส่งรหัสใหม่</button>
              )}
            </div>
            {err && <Alert>{err}</Alert>}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setPhase('signup')} className="flex-1">
                <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
              </Button>
              <Button onClick={verifyOtp} className="flex-1">
                ยืนยัน <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {phase === 'consent' && (
        <>
          <Header icon={ShieldCheck} title="ข้อตกลงและเงื่อนไข" subtitle="กรุณาอ่านและยอมรับเพื่อดำเนินการต่อ" />
          <div className="space-y-3">
            <ConsentRowWithRead
              icon={ShieldCheck}
              title="นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)"
              desc="ข้าพเจ้ายินยอมให้จัดเก็บและใช้ข้อมูลส่วนบุคคลตามนโยบาย"
              checked={data.pdpa}
              hasRead={pdpaRead}
              onChange={v => setData({ ...data, pdpa: v })}
              onOpenRead={() => setPdpaOpen(true)}
              linkText="อ่านนโยบายความเป็นส่วนตัว"
            />
            <ConsentRowWithRead
              icon={Check}
              title="กฎ กติกาการแข่งขัน"
              desc="ข้าพเจ้าได้อ่านและยอมรับกฎกติกาการแข่งขันทุกข้อ"
              checked={data.rules}
              hasRead={rulesRead}
              onChange={v => setData({ ...data, rules: v })}
              onOpenRead={() => setRulesOpen(true)}
              linkText="อ่านกฎกติกาทั้งหมด"
            />

            {(!pdpaRead || !rulesRead) && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-900">กรุณาอ่านเอกสารทั้ง 2 ฉบับก่อนยอมรับ</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    คลิกที่ลิงก์ "{!pdpaRead ? 'อ่านนโยบายความเป็นส่วนตัว' : 'อ่านกฎกติกาทั้งหมด'}" เพื่อเปิดอ่านก่อน
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-3">
              <Button variant="secondary" onClick={() => setPhase('otp')} className="flex-1">
                <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
              </Button>
              <Button onClick={finish} disabled={!data.pdpa || !data.rules} className="flex-1">
                ดำเนินการต่อ <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* PDPA Modal */}
          <Modal
            open={pdpaOpen}
            onClose={() => setPdpaOpen(false)}
            title="นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)"
            footer={
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setPdpaOpen(false)} className="flex-1">
                  ปิด
                </Button>
                <Button
                  onClick={() => { setPdpaRead(true); setData({ ...data, pdpa: true }); setPdpaOpen(false); }}
                  className="flex-1"
                >
                  <Check className="w-4 h-4" /> รับทราบและยอมรับ
                </Button>
              </div>
            }
          >
            <PdpaContent />
          </Modal>

          {/* Rules Modal */}
          <Modal
            open={rulesOpen}
            onClose={() => setRulesOpen(false)}
            title="กฎกติกาการแข่งขัน"
            footer={
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setRulesOpen(false)} className="flex-1">
                  ปิด
                </Button>
                <Button
                  onClick={() => { setRulesRead(true); setData({ ...data, rules: true }); setRulesOpen(false); }}
                  className="flex-1"
                >
                  <Check className="w-4 h-4" /> รับทราบและยอมรับ
                </Button>
              </div>
            }
          >
            <RulesContent />
          </Modal>
        </>
      )}
    </Card>
  );
}

const ConsentRow = ({ icon: Icon, title, desc, checked, onChange, link, onLinkClick }) => (
  <label className={`flex gap-3 p-3 rounded-md border cursor-pointer transition ${checked ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
    <div className="pt-0.5">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 accent-slate-900" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <Icon className="w-4 h-4 text-slate-900" strokeWidth={1.5} />
        <span className="font-medium text-sm text-slate-900">{title}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      {link && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLinkClick?.(); }}
          className="text-xs text-slate-900 hover:underline mt-1 font-medium"
        >
          {link} →
        </button>
      )}
    </div>
  </label>
);

// ConsentRowWithRead — บังคับให้กดอ่านก่อนถึงจะติ๊กได้
const ConsentRowWithRead = ({ icon: Icon, title, desc, checked, hasRead, onChange, onOpenRead, linkText }) => {
  const canCheck = hasRead;
  return (
    <div className={`rounded-lg border-2 p-3.5 transition ${
      checked ? 'border-green-400 bg-green-50/50' :
      hasRead ? 'border-slate-300 bg-white' :
      'border-slate-200 bg-slate-50'
    }`}>
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          {checked ? (
            <div className="w-5 h-5 rounded-md bg-green-600 flex items-center justify-center shadow-sm">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          ) : (
            <input
              type="checkbox"
              checked={checked}
              disabled={!canCheck}
              onChange={e => onChange(e.target.checked)}
              className={`w-5 h-5 rounded-md ${canCheck ? 'accent-slate-900 cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
              title={canCheck ? '' : 'กรุณาเปิดอ่านเอกสารก่อน'}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <Icon className={`w-4 h-4 flex-shrink-0 ${checked ? 'text-green-600' : 'text-slate-900'}`} strokeWidth={1.75} />
            <span className={`font-semibold text-sm ${checked ? 'text-green-900' : 'text-slate-900'}`}>{title}</span>
            {hasRead && !checked && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-bold">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
                อ่านแล้ว
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-2">{desc}</p>

          {!hasRead ? (
            <button
              type="button"
              onClick={onOpenRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              <FileIcon className="w-3.5 h-3.5" strokeWidth={2} />
              {linkText || 'เปิดอ่านเอกสาร'}
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenRead}
              className="text-xs text-slate-500 hover:text-slate-900 hover:underline font-medium inline-flex items-center gap-1"
            >
              📄 เปิดอ่านอีกครั้ง
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STEP 2: RACERS
// ============================================================
function StepRacers({ racers, setRacers, savedRacers = [], next, prev }) {
  const [err, setErr] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const addRacer = () => setRacers([...racers, newRacer()]);
  const addFromSaved = (savedRacer) => {
    // copy ของจาก savedRacers แต่ reset เลือกวัน/รุ่น (เพราะของเดิมเป็นข้อมูลเก่า)
    const copy = {
      ...savedRacer,
      selectedDates: [],
      selectedRaces: {},
      documents: savedRacer.documents || [],
    };
    // หา index ของนักแข่งคนที่ยังว่าง (ยังไม่กรอกชื่อ) ที่จะถูกแทนที่
    const emptyIdx = racers.findIndex(r => !r.thFirstName && !r.thLastName && !r.enFirstName && !r.enLastName);
    if (emptyIdx !== -1) {
      // แทนที่คนที่ว่างอยู่
      const next = [...racers];
      next[emptyIdx] = copy;
      setRacers(next);
    } else {
      // ไม่มีคนว่าง — append ตามปกติ
      setRacers([...racers, copy]);
    }
    setPickerOpen(false);
  };
  const removeRacer = (id) => {
    if (racers.length === 1) return;
    setRacers(racers.filter(r => r.id !== id));
  };
  const updateRacer = (id, patch) => {
    setRacers(racers.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  // เช็คว่า saved racer คนไหนถูกเลือกไปแล้ว เพื่อไม่ให้ซ้ำ
  const usedIds = new Set(racers.map(r => r.id));
  const availableSaved = savedRacers.filter(r => !usedIds.has(r.id));

  const submit = () => {
    for (const r of racers) {
      if (!r.thFirstName || !r.thLastName || !r.enFirstName || !r.enLastName || !r.birthDate) {
        return setErr('กรุณากรอกข้อมูลนักแข่งให้ครบทุกคน');
      }
      if (!r.gender) {
        return setErr(`กรุณาเลือกเพศของนักแข่ง "${r.thFirstName}"`);
      }
      if (!r.shirtSize) {
        return setErr(`กรุณาเลือกไซส์เสื้อของนักแข่ง "${r.thFirstName}"`);
      }
      if (!r.country) {
        return setErr(`กรุณาเลือกประเทศของนักแข่ง "${r.thFirstName}"`);
      }
      if (!r.documents || r.documents.length === 0) {
        return setErr(`กรุณาอัปโหลดเอกสารยืนยันตัวตนของนักแข่ง "${r.thFirstName}"`);
      }
      // เช็คว่ามีรุ่นที่เลือกได้บ้างหรือไม่
      const eligible = getEligibleTiers(r.birthDate, r.gender);
      if (eligible.length === 0) {
        return setErr(`นักแข่ง "${r.thFirstName}" ไม่มีรุ่นที่ตรงเกณฑ์ — ตรวจสอบวันเกิดและเพศ`);
      }
      if (r.selectedDates.length === 0) {
        return setErr(`นักแข่ง "${r.thFirstName}" ต้องเลือกวันแข่งอย่างน้อย 1 วัน`);
      }
      for (const did of r.selectedDates) {
        if (!r.selectedRaces[did] || r.selectedRaces[did].length === 0) {
          return setErr(`นักแข่ง "${r.thFirstName}" ต้องเลือกรุ่นในทุกวันที่ลง`);
        }
      }
    }
    setErr('');
    next();
  };

  return (
    <Card>
      <Header icon={Flag} title="ข้อมูลนักแข่ง" subtitle="กรอกข้อมูล เลือกวัน และเลือกรุ่นที่จะลงแข่ง" />

      <div className="space-y-3">
        {/* Top banner: เลือกจากที่บันทึกไว้ */}
        {availableSaved.length > 0 && (
          <button
            onClick={() => setPickerOpen(true)}
            className="w-full p-3 rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 hover:border-red-400 hover:from-red-100 hover:to-red-50 text-left transition group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-red-500/30">
              <User className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-900 flex items-center gap-1.5">
                เลือกจากนักแข่งที่บันทึกไว้
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md bg-red-600 text-white text-[10px] font-black">
                  {availableSaved.length}
                </span>
              </p>
              <p className="text-[11px] text-red-700 mt-0.5">ใช้ข้อมูลจากเมนู "ข้อมูลนักแข่ง" ที่บันทึกไว้ — ประหยัดเวลา ไม่ต้องกรอกใหม่</p>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:text-red-700 group-hover:translate-x-0.5 transition flex-shrink-0" />
          </button>
        )}

        {racers.map((r, idx) => (
          <RacerCard
            key={r.id}
            racer={r}
            index={idx}
            canRemove={racers.length > 1}
            onRemove={() => removeRacer(r.id)}
            onUpdate={patch => updateRacer(r.id, patch)}
          />
        ))}

        <button
          onClick={addRacer}
          className="w-full h-11 border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-900 text-slate-500 text-sm font-medium rounded-md inline-flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> เพิ่มนักแข่งอีกคน
        </button>


        {err && <Alert>{err}</Alert>}

        <div className="flex gap-2 pt-2">
          {prev && (
            <Button variant="secondary" onClick={prev} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
            </Button>
          )}
          <Button onClick={submit} className="flex-1">
            ดำเนินการต่อ <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Saved racers picker modal */}
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="เลือกนักแข่งที่บันทึกไว้">
        <p className="text-xs text-slate-500 mb-3">เลือกนักแข่งจากรายการที่คุณบันทึกไว้ในระบบ (จะคัดลอกข้อมูลและให้คุณเลือกวัน-รุ่นแข่งใหม่)</p>
        {availableSaved.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-500">ไม่มีนักแข่งที่บันทึกไว้</div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto -mx-1 px-1">
            {availableSaved.map(r => {
              const country = COUNTRIES.find(c => c.code === r.country) || COUNTRIES[0];
              return (
                <button
                  key={r.id}
                  onClick={() => addFromSaved(r)}
                  className="w-full text-left p-3 rounded-lg border-2 border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/30 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl emoji-flag leading-none flex-shrink-0">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {r.thFirstName} {r.thLastName}
                        {r.nickname && <span className="text-slate-400 font-normal"> · {r.nickname}</span>}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {r.gender === 'male' || r.gender === 'M' ? 'ชาย' : 'หญิง'}
                        {r.shirtSize && ` · ไซส์ ${r.shirtSize}`}
                        {r.teamName && ` · ${r.teamName}`}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
        <button onClick={() => setPickerOpen(false)} className="w-full mt-3 h-10 text-sm font-medium text-slate-500 hover:text-slate-700">ปิด</button>
      </Modal>
    </Card>
  );
}

// Custom country dropdown — ทำให้ Windows + macOS เห็น flag เหมือนกัน
function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const selected = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = COUNTRIES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-10 px-3 text-sm rounded-md border bg-white text-left flex items-center justify-between gap-2 transition outline-none ${
          open ? 'border-slate-900 ring-2 ring-slate-200' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="emoji-flag text-lg leading-none flex-shrink-0">{selected.flag}</span>
          <span className="truncate text-slate-900">{selected.name}</span>
          <span className="text-[10px] font-mono text-slate-400">({selected.code})</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              autoFocus
              placeholder="ค้นหาประเทศ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-200 outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500">ไม่พบประเทศที่ค้นหา</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); setSearch(''); }}
                  className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 transition ${
                    c.code === value ? 'bg-red-50 text-red-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="emoji-flag text-lg leading-none flex-shrink-0">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{c.code}</span>
                  {c.code === value && <Check className="w-3.5 h-3.5 text-red-600 flex-shrink-0" strokeWidth={3} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RacerCard({ racer: r, index, canRemove, onRemove, onUpdate }) {
  const [open, setOpen] = useState(true);
  const ageYM = calcAgeYM(r.birthDate);
  const eligible = r.birthDate ? getEligibleTiers(r.birthDate, r.gender) : [];

  const toggleDate = (dateId) => {
    const has = r.selectedDates.includes(dateId);
    const newDates = has ? r.selectedDates.filter(d => d !== dateId) : [...r.selectedDates, dateId];
    const newRaces = { ...r.selectedRaces };
    if (has) delete newRaces[dateId];
    onUpdate({ selectedDates: newDates, selectedRaces: newRaces });
  };

  const toggleTier = (dateId, tierId) => {
    const current = r.selectedRaces[dateId] || [];
    const has = current.includes(tierId);
    const newList = has ? current.filter(t => t !== tierId) : [...current, tierId];
    onUpdate({ selectedRaces: { ...r.selectedRaces, [dateId]: newList } });
  };

  let racerTotal = 0;
  let racerCount = 0;
  for (const did of r.selectedDates) {
    const tiers = r.selectedRaces[did] || [];
    racerCount += tiers.length;
    racerTotal += tiers.reduce((s, tid) => s + (RACE_TIERS.find(x => x.id === tid)?.price || 0), 0);
  }

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
      <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/60 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left hover:opacity-80 transition"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-black shadow-md shadow-red-500/30">
            #{index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {r.thFirstName ? `${r.thFirstName} ${r.thLastName}` : `นักแข่งคนที่ ${index + 1}`}
            </p>
            {racerCount > 0 && (
              <p className="text-[11px] text-slate-500">
                {racerCount} รายการ · {fmt(racerTotal)} บาท
              </p>
            )}
          </div>
        </button>
        <div className="flex items-center gap-1 ml-2">
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              aria-label="ลบนักแข่ง"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-1.5 text-slate-400 hover:text-slate-600 transition"
            aria-label={open ? 'ปิด' : 'เปิด'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          {/* ข้อมูลส่วนตัว */}
          <div>
            <SectionLabel>ข้อมูลส่วนตัว</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label required>ชื่อ (ไทย)</Label>
                <Input value={r.thFirstName} onChange={e => onUpdate({ thFirstName: e.target.value })} />
              </div>
              <div>
                <Label required>นามสกุล (ไทย)</Label>
                <Input value={r.thLastName} onChange={e => onUpdate({ thLastName: e.target.value })} />
              </div>
              <div>
                <Label required>First name</Label>
                <Input value={r.enFirstName} onChange={e => onUpdate({ enFirstName: e.target.value })} />
              </div>
              <div>
                <Label required>Last name</Label>
                <Input value={r.enLastName} onChange={e => onUpdate({ enLastName: e.target.value })} />
              </div>
              <div>
                <Label>ชื่อเล่น</Label>
                <Input
                  placeholder="เช่น น้องเอ"
                  value={r.nickname || ''}
                  onChange={e => onUpdate({ nickname: e.target.value })}
                />
              </div>
              <div>
                <Label required>ประเทศ</Label>
                <CountrySelect
                  value={r.country || 'TH'}
                  onChange={code => onUpdate({ country: code })}
                />
              </div>
              <div>
                <Label required>เพศ</Label>
                <div className="grid grid-cols-2 gap-2">
                  <GenderOption
                    active={r.gender === 'male'}
                    onClick={() => onUpdate({ gender: 'male', selectedRaces: {} })}
                    label="ชาย"
                  />
                  <GenderOption
                    active={r.gender === 'female'}
                    onClick={() => onUpdate({ gender: 'female', selectedRaces: {} })}
                    label="หญิง"
                  />
                </div>
              </div>
              <div>
                <Label required>วันเดือนปีเกิด</Label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      icon={Calendar}
                      type="date"
                      value={r.birthDate}
                      onChange={e => onUpdate({ birthDate: e.target.value, selectedDates: [], selectedRaces: {} })}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {r.birthDate && (
                    <div className="h-10 px-2.5 rounded-md bg-slate-100 border border-slate-200 flex items-center text-[11px] font-medium text-slate-700 whitespace-nowrap">
                      {ageYM.years} ปี {ageYM.months} ด.
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label required>ไซส์เสื้อ</Label>
                <div className="grid grid-cols-7 gap-1">
                  {SHIRT_SIZES.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onUpdate({ shirtSize: size })}
                      className={`h-10 text-xs font-bold rounded-md border-2 transition ${
                        r.shirtSize === size
                          ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label>ชื่อทีม / สังกัด <span className="text-slate-400 font-normal">(ถ้ามี)</span></Label>
                <Input
                  icon={Flag}
                  placeholder="เช่น Bangkok Runbike Club"
                  value={r.teamName || ''}
                  onChange={e => onUpdate({ teamName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* เอกสารยืนยันตัวตน */}
          <div>
            <SectionLabel>เอกสารยืนยันตัวตน <span className="text-red-500 font-normal">*</span></SectionLabel>
            <DocumentUpload
              files={r.documents || []}
              onChange={(docs) => onUpdate({ documents: docs })}
            />
          </div>

          {/* รุ่นและวันแข่ง — ต้องกรอกข้อมูลครบก่อน */}
          {r.birthDate && r.gender && eligible.length > 0 && (
            <>
              <Divider />
              <div>
                <SectionLabel>เลือกวันแข่ง <span className="text-slate-400 font-normal">(เลือกได้หลายวัน)</span></SectionLabel>
                <DatePicker
                  dates={RACE_DATES}
                  selected={r.selectedDates}
                  onToggle={toggleDate}
                />
              </div>

              {r.selectedDates.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <SectionLabel>เลือกรุ่นในแต่ละวัน <span className="text-slate-400 font-normal">(แบ่งเป็น 3 หมวด · เลือกได้หลายรุ่นต่อวัน)</span></SectionLabel>
                    <div className="space-y-2">
                      {RACE_DATES.filter(d => r.selectedDates.includes(d.id)).map(d => (
                        <DateTierPicker
                          key={d.id}
                          date={d}
                          eligible={eligible}
                          selected={r.selectedRaces[d.id] || []}
                          onToggle={(tid) => toggleTier(d.id, tid)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {r.birthDate && r.gender && eligible.length === 0 && (
            <Alert>ไม่มีรุ่นใดตรงเกณฑ์อายุและเพศของนักแข่งคนนี้ — กรุณาตรวจสอบวันเกิดและเพศอีกครั้ง</Alert>
          )}

          {(!r.birthDate || !r.gender) && (
            <div className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              กรอกวันเกิดและเลือกเพศก่อน เพื่อแสดงรุ่นที่ลงแข่งได้
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB COMPONENTS ของ RacerCard
// ============================================================
const SectionLabel = ({ children }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-wide">{children}</span>
  </div>
);

const GenderOption = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-10 rounded-md border text-sm font-medium transition ${
      active
        ? 'bg-slate-900 border-slate-900 text-white'
        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
    }`}
  >
    {label}
  </button>
);

function DocumentUpload({ files, onChange }) {
  const inputRef = React.useRef(null);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    const newDocs = [];
    let pending = arr.length;
    if (pending === 0) return;
    arr.forEach((file) => {
      // จำกัด 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert(`ไฟล์ "${file.name}" ใหญ่เกิน 5MB`);
        pending -= 1;
        if (pending === 0 && newDocs.length > 0) onChange([...files, ...newDocs]);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        newDocs.push({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target.result,
        });
        pending -= 1;
        if (pending === 0) onChange([...files, ...newDocs]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (idx) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border border-dashed border-slate-300 hover:border-slate-900 hover:bg-slate-50 rounded-md p-4 text-center transition group"
      >
        <Upload className="w-5 h-5 mx-auto text-slate-400 group-hover:text-slate-900 transition mb-1.5" strokeWidth={1.5} />
        <p className="text-xs font-medium text-slate-900">คลิกเพื่ออัปโหลดเอกสาร</p>
        <p className="text-[11px] text-slate-500 mt-0.5">ใบเกิด หรือ บัตรประชาชน · PNG, JPG, PDF · ไม่เกิน 5MB</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-md border border-slate-200 bg-white">
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                <FileIcon className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate">{file.name}</p>
                <p className="text-[11px] text-slate-500">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition flex-shrink-0"
                aria-label="ลบไฟล์"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DatePicker({ dates, selected, onToggle }) {
  // จัด group ตามเดือน
  const byMonth = {};
  dates.forEach(d => {
    if (!byMonth[d.month]) byMonth[d.month] = [];
    byMonth[d.month].push(d);
  });

  // map เดือนไทย → เต็ม
  const fullMonth = {
    'ม.ค.': 'มกราคม', 'ก.พ.': 'กุมภาพันธ์', 'มี.ค.': 'มีนาคม', 'เม.ย.': 'เมษายน',
    'พ.ค.': 'พฤษภาคม', 'มิ.ย.': 'มิถุนายน', 'ก.ค.': 'กรกฎาคม', 'ส.ค.': 'สิงหาคม',
    'ก.ย.': 'กันยายน', 'ต.ค.': 'ตุลาคม', 'พ.ย.': 'พฤศจิกายน', 'ธ.ค.': 'ธันวาคม',
  };

  return (
    <div className="space-y-3">
      {Object.entries(byMonth).map(([month, days]) => {
        const selectedInMonth = days.filter(d => selected.includes(d.id)).length;
        return (
          <div key={month} className="rounded-lg border border-slate-200 overflow-hidden">
            {/* Month header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.75} />
                <span className="text-sm font-semibold tracking-tight">
                  {fullMonth[month] || month} <span className="text-slate-300 font-normal">2569</span>
                </span>
              </div>
              {selectedInMonth > 0 && (
                <span className="text-[11px] font-medium bg-white/15 px-2 py-0.5 rounded">
                  เลือกแล้ว {selectedInMonth} วัน
                </span>
              )}
            </div>
            {/* Day buttons */}
            <div className="p-2.5 bg-white">
              <div className="grid grid-cols-4 gap-1.5">
                {days.map(d => {
                  const isSel = selected.includes(d.id);
                  const isSat = d.weekday === 'เสาร์';
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onToggle(d.id)}
                      className={`px-2 py-2 rounded-md border text-center transition ${
                        isSel
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wide ${isSel ? 'text-slate-300' : isSat ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isSat ? 'SAT' : 'SUN'}
                      </div>
                      <div className="text-base font-semibold leading-tight">{d.day}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DateTierPicker({ date, eligible, selected, onToggle }) {
  const sub = selected.reduce((s, tid) => s + (RACE_TIERS.find(x => x.id === tid)?.price || 0), 0);

  // แยก main tier (standard - ตามอายุ) vs additional tiers (girl, open)
  const mainTiers = eligible.filter(t => t.group === 'standard');
  const additionalTiers = eligible.filter(t => t.group !== 'standard');

  // เช็คว่าเลือกรุ่นหลักแล้วหรือยัง
  const hasMainTier = mainTiers.some(t => selected.includes(t.id));

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      {/* Header — date + summary */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900 text-white flex-wrap gap-1">
        <span className="text-xs font-semibold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
          {date.full}
        </span>
        <span className="text-[11px] text-slate-300">
          {selected.length > 0 ? `${selected.length} รุ่น · ${fmt(sub)} ฿` : 'ยังไม่เลือก'}
        </span>
      </div>

      <div className="p-3 space-y-3">
        {/* Section 1: รุ่นหลัก (ตามอายุ) */}
        {mainTiers.length > 0 && (
          <div className="rounded-lg border-2 border-red-200 bg-red-50/40 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100/50 border-b border-red-200">
              <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">1</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-red-900 uppercase tracking-wide">รุ่นหลัก (ตามอายุ)</p>
                <p className="text-[10px] text-red-700">เลือกได้ 1 รุ่น · จำเป็นต้องเลือกก่อน</p>
              </div>
              {hasMainTier && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 border border-green-200 text-green-700 text-[9px] font-bold">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  เลือกแล้ว
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5">
              {mainTiers.map(t => {
                const isSel = selected.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      // เลือกรุ่นหลักได้แค่ 1 — toggle: ถ้าคลิก rerun เป็นการ deselect
                      if (isSel) {
                        // จะ deselect รุ่นหลัก ต้อง deselect additional tiers ทั้งหมดของวันนี้ก่อน (เพราะต้องเลือกหลักก่อน)
                        const otherMains = mainTiers.filter(x => x.id !== t.id && selected.includes(x.id));
                        // คลิก deselect ตัวเดียวอย่างเดียว ไม่ tap rerun additional
                        onToggle(t.id);
                      } else {
                        // เลือกใหม่ — deselect main อื่นก่อนแล้ว toggle ตัวนี้
                        const currentMain = mainTiers.find(x => selected.includes(x.id));
                        if (currentMain) onToggle(currentMain.id);
                        onToggle(t.id);
                      }
                    }}
                    className={`px-2.5 h-9 rounded-md border-2 text-xs font-bold transition flex items-center gap-1.5 ${
                      isSel
                        ? 'bg-red-600 border-red-700 text-white shadow-md shadow-red-600/30'
                        : 'bg-white border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50'
                    }`}
                    title={t.range}
                  >
                    {isSel && <Check className="w-3 h-3" strokeWidth={2.5} />}
                    {t.label}
                    <span className={`font-normal ${isSel ? 'text-red-100' : 'text-red-500'}`}>· {fmt(t.price)} ฿</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: รุ่นเพิ่มเติม (Open / Open Girl) — disabled ถ้ายังไม่เลือกหลัก */}
        {additionalTiers.length > 0 && (
          <div className={`rounded-lg border-2 overflow-hidden transition ${
            hasMainTier ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-slate-50/60 opacity-60'
          }`}>
            <div className={`flex items-center gap-2 px-3 py-2 border-b ${
              hasMainTier ? 'bg-amber-100/50 border-amber-200' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 ${
                hasMainTier ? 'bg-amber-600' : 'bg-slate-400'
              }`}>2</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-bold uppercase tracking-wide ${
                  hasMainTier ? 'text-amber-900' : 'text-slate-600'
                }`}>รุ่นเพิ่มเติม (Open)</p>
                <p className={`text-[10px] ${hasMainTier ? 'text-amber-700' : 'text-slate-500'}`}>
                  {hasMainTier ? 'เลือกได้หลายรุ่น · เพิ่มความท้าทาย' : '🔒 กรุณาเลือกรุ่นหลักก่อน'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5">
              {additionalTiers.map(t => {
                const isSel = selected.includes(t.id);
                const isGirl = t.group === 'girl';
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => hasMainTier && onToggle(t.id)}
                    disabled={!hasMainTier}
                    className={`px-2.5 h-9 rounded-md border-2 text-xs font-medium transition flex items-center gap-1.5 ${
                      !hasMainTier
                        ? 'cursor-not-allowed bg-white border-slate-200 text-slate-400'
                        : isSel
                          ? (isGirl ? 'bg-pink-600 border-pink-700 text-white' : 'bg-amber-600 border-amber-700 text-white')
                          : (isGirl ? 'bg-white border-pink-200 text-pink-700 hover:border-pink-400' : 'bg-white border-amber-200 text-amber-700 hover:border-amber-400')
                    }`}
                    title={t.range}
                  >
                    {isSel && <Check className="w-3 h-3" strokeWidth={2.5} />}
                    {t.label}
                    <span className={`font-normal ${
                      !hasMainTier ? 'text-slate-300' : isSel ? 'text-white/80' : 'text-slate-500'
                    }`}>· {fmt(t.price)} ฿</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// STEP 3: GUARDIAN
// ============================================================
function StepGuardian({ data, setData, next, prev, savedGuardian }) {
  const [err, setErr] = useState('');
  const [useSaved, setUseSaved] = useState(false);
  const g = data.guardian;
  const set = (patch) => setData({ ...data, guardian: { ...g, ...patch } });

  const toggleUseSaved = (checked) => {
    setUseSaved(checked);
    if (checked && savedGuardian) {
      // เอาเฉพาะ 4 fields ตาม spec: ชื่อ, ที่อยู่ติดต่อ, เบอร์, อีเมล
      setData({
        ...data,
        guardian: {
          ...g,
          name: savedGuardian.name || '',
          address: savedGuardian.contactAddress || '',
          phone: savedGuardian.phone || '',
          email: savedGuardian.email || '',
        }
      });
    }
  };

  const submit = () => {
    if (!g.name || !g.address || !g.email || !g.phone) return setErr('กรุณากรอกข้อมูลให้ครบ');
    if (!/^0\d{9}$/.test(g.phone.replace(/[-\s]/g, ''))) return setErr('เบอร์โทรไม่ถูกต้อง');
    if (!/\S+@\S+\.\S+/.test(g.email)) return setErr('อีเมลไม่ถูกต้อง');
    setErr('');
    next();
  };

  return (
    <Card>
      <Header icon={User} title="ข้อมูลผู้ปกครอง" subtitle="สำหรับติดต่อในกรณีฉุกเฉินและส่งใบเสร็จ" />
      <div className="space-y-3">
        {/* Use saved guardian checkbox */}
        {savedGuardian && (
          <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
            useSaved ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={useSaved}
              onChange={e => toggleUseSaved(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-red-600 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" strokeWidth={2.5} />
                ใช้ข้อมูลผู้ปกครองที่บันทึกไว้
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {savedGuardian.name} · {savedGuardian.phone} · {savedGuardian.email}
              </p>
            </div>
          </label>
        )}

        <div>
          <Label required>ชื่อ-นามสกุล</Label>
          <Input icon={User} placeholder="ชื่อ-นามสกุล ผู้ปกครอง" value={g.name} onChange={e => set({ name: e.target.value })} />
        </div>
        <div>
          <Label required>ที่อยู่ที่ติดต่อได้</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" strokeWidth={1.5} />
            <textarea
              rows={3}
              placeholder="บ้านเลขที่, หมู่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
              value={g.address}
              onChange={e => set({ address: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition resize-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label required>อีเมล</Label>
            <Input icon={Mail} type="email" placeholder="parent@example.com" value={g.email} onChange={e => set({ email: e.target.value })} />
          </div>
          <div>
            <Label required>เบอร์โทรศัพท์</Label>
            <Input icon={Phone} placeholder="08X-XXX-XXXX" maxLength={12} value={g.phone} onChange={e => set({ phone: e.target.value })} />
          </div>
        </div>

        {err && <Alert>{err}</Alert>}

        <div className="flex gap-2 pt-3">
          <Button variant="secondary" onClick={prev} className="flex-1">
            <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
          </Button>
          <Button onClick={submit} className="flex-1">
            ดำเนินการต่อ <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// STEP 4: SUMMARY + COUPON (per-racer)
// ============================================================
function StepSummary({ racers, data, setData, next, prev }) {
  // coupons เก็บเป็น map { [racerId]: 'COUPONCODE' } ใน data.racerCoupons
  const racerCoupons = data.racerCoupons || {};
  const [couponInputs, setCouponInputs] = useState({}); // { [racerId]: 'typed code' }
  const [couponMsgs, setCouponMsgs] = useState({}); // { [racerId]: { ok: bool, msg: string } }

  // ดึงข้อมูล per-racer breakdown
  const racerBreakdown = useMemo(() => {
    return racers.map(r => {
      const items = [];
      let mainTierPrice = 0;
      let mainTierId = null;
      r.selectedDates.forEach(did => {
        const dateObj = RACE_DATES.find(d => d.id === did);
        (r.selectedRaces[did] || []).forEach(tid => {
          const t = RACE_TIERS.find(x => x.id === tid);
          if (!t) return;
          const isMain = t.group === 'standard';
          if (isMain && mainTierPrice === 0) {
            mainTierPrice = t.price;
            mainTierId = t.id;
          }
          items.push({
            date: dateObj?.short || '',
            tier: t.label,
            tierName: t.name || t.label,
            tierId: t.id,
            price: t.price,
            isMain,
          });
        });
      });
      const subtotal = items.reduce((s, i) => s + i.price, 0);

      // คำนวณส่วนลด per-racer
      const couponCode = racerCoupons[r.id];
      const coupon = couponCode ? COUPONS[couponCode] : null;
      let discount = 0;
      if (coupon) {
        if (coupon.type === 'percent10') discount = Math.round(subtotal * 0.10);
        else if (coupon.type === 'main-free') discount = mainTierPrice;
      }
      const total = Math.max(0, subtotal - discount);

      return {
        racer: r,
        name: `${r.thFirstName} ${r.thLastName}`,
        nickname: r.nickname,
        items,
        subtotal,
        discount,
        total,
        couponCode,
        coupon,
        mainTierId,
        mainTierPrice,
      };
    });
  }, [racers, racerCoupons]);

  // ยอดรวมทั้งหมด
  const totalSubtotal = racerBreakdown.reduce((s, r) => s + r.subtotal, 0);
  const totalDiscount = racerBreakdown.reduce((s, r) => s + r.discount, 0);
  const totalNet = racerBreakdown.reduce((s, r) => s + r.total, 0);

  const applyCoupon = (racerId) => {
    const code = (couponInputs[racerId] || '').trim().toUpperCase();
    if (!code) return;
    if (COUPONS[code]) {
      setData({ ...data, racerCoupons: { ...racerCoupons, [racerId]: code } });
      setCouponMsgs({ ...couponMsgs, [racerId]: { ok: true, msg: `ใช้คูปองสำเร็จ — ${COUPONS[code].label}` } });
    } else {
      setCouponMsgs({ ...couponMsgs, [racerId]: { ok: false, msg: 'โค้ดไม่ถูกต้องหรือหมดอายุ' } });
    }
  };
  const removeCoupon = (racerId) => {
    const nc = { ...racerCoupons };
    delete nc[racerId];
    setData({ ...data, racerCoupons: nc });
    setCouponInputs({ ...couponInputs, [racerId]: '' });
    setCouponMsgs({ ...couponMsgs, [racerId]: null });
  };

  return (
    <Card>
      <Header icon={Tag} title="สรุปยอดการลงทะเบียน" subtitle="ตรวจสอบรายการและใช้โค้ดส่วนลดสำหรับนักแข่งแต่ละคน" />

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          {racerBreakdown.map((rb, ri) => (
            <div key={rb.racer.id} className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden">
              {/* Racer header */}
              <div className="px-3 py-2.5 bg-gradient-to-r from-slate-900 to-red-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-white text-[10px] font-black flex-shrink-0">
                    #{ri + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{rb.name}</p>
                    {rb.nickname && <p className="text-[10px] text-red-200 truncate">{rb.nickname}</p>}
                  </div>
                </div>
                <p className="text-sm font-black text-white">{fmt(rb.subtotal)} ฿</p>
              </div>

              {/* Items breakdown */}
              <div className="divide-y divide-slate-100">
                {rb.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        item.isMain ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.isMain ? 'หลัก' : 'เพิ่ม'}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-900 font-bold truncate">รุ่น {item.tier}</p>
                        <p className="text-[10px] text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-900 ml-2 font-mono">{fmt(item.price)} ฿</p>
                  </div>
                ))}
              </div>

              {/* Coupon per racer */}
              <div className="border-t border-slate-100 p-3 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">โค้ดส่วนลด</p>
                {rb.couponCode ? (
                  <div className="flex items-center justify-between px-2.5 py-2 rounded-md border border-emerald-200 bg-emerald-50/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" strokeWidth={2} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-900 font-mono">{rb.couponCode}</p>
                        <p className="text-[10px] text-emerald-700">{rb.coupon.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-700">−{fmt(rb.discount)} ฿</span>
                      <button onClick={() => removeCoupon(rb.racer.id)} className="text-slate-400 hover:text-red-600 p-0.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder="กรอกโค้ด"
                        value={couponInputs[rb.racer.id] || ''}
                        onChange={e => setCouponInputs({ ...couponInputs, [rb.racer.id]: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon(rb.racer.id)}
                      />
                      <Button variant="secondary" onClick={() => applyCoupon(rb.racer.id)}>ใช้</Button>
                    </div>
                    {couponMsgs[rb.racer.id] && (
                      <p className={`text-[10px] mt-1 ${couponMsgs[rb.racer.id].ok ? 'text-emerald-700' : 'text-red-600'}`}>
                        {couponMsgs[rb.racer.id].msg}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Coupon hints */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-[11px] font-bold text-blue-900 mb-1.5">💡 โค้ดส่วนลดที่มี (Demo)</p>
            <div className="space-y-1 text-[11px] text-blue-800">
              <p><span className="font-mono font-bold">GPRC10</span> · ลด 10% ทั้งหมดของนักแข่งคนนั้น</p>
              <p><span className="font-mono font-bold">GPRCMAIN</span> · ฟรีรุ่นหลัก (รุ่นเพิ่มเติมยังคิดเงินตามปกติ)</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative rounded-xl p-5 lg:sticky lg:top-4 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white shadow-xl shadow-slate-900/20">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-500/20 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <p className="text-[10px] font-bold text-red-300 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3 h-3" strokeWidth={2.5} />
                ยอดที่ต้องชำระ
              </p>

              {/* Per-racer mini summary */}
              <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto">
                {racerBreakdown.map((rb, ri) => (
                  <div key={rb.racer.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 truncate flex-1">#{ri + 1} {rb.name}</span>
                    <span className="text-white font-mono font-bold flex-shrink-0 ml-2">
                      {rb.discount > 0 && <span className="text-red-300 text-[10px] mr-1">−{fmt(rb.discount)}</span>}
                      {fmt(rb.total)} ฿
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-sm pt-2 border-t border-white/10">
                <div className="flex justify-between text-slate-300">
                  <span>ยอดรวม</span>
                  <span className="font-medium">{fmt(totalSubtotal)} ฿</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-300">ส่วนลดรวม</span>
                    <span className="font-medium text-red-300">−{fmt(totalDiscount)} ฿</span>
                  </div>
                )}
                <div className="border-t border-white/20 my-2.5"></div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">ยอดสุทธิ</span>
                  <span className="text-3xl font-black text-white tracking-tight">{fmt(totalNet)} <span className="text-base font-normal text-slate-300">฿</span></span>
                </div>
              </div>
              <div className="border-t border-white/10 mt-3 pt-3 text-[11px] text-slate-400 leading-relaxed">
                {racerBreakdown.reduce((s, r) => s + r.items.length, 0)} รายการ · นักแข่ง {racers.length} คน
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <Button variant="secondary" onClick={prev} className="flex-1">
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
        </Button>
        <Button onClick={() => { setData({ ...data, finalTotal: totalNet, subtotal: totalSubtotal, discount: totalDiscount }); next(); }} className="flex-1">
          ไปหน้าชำระเงิน <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

// ============================================================
// STEP 5: PAYMENT
// ============================================================
function StepPayment({ data, setData, next, prev, savedGuardian }) {
  const [method, setMethod] = useState('credit');
  const [processing, setProcessing] = useState(false);
  const taxInvoice = data.taxInvoice || { enabled: false, useSaved: false, name: '', address: '', taxId: '', email: '' };

  const updateTax = (patch) => setData({ ...data, taxInvoice: { ...taxInvoice, ...patch } });

  const toggleEnabled = (v) => {
    if (!v) {
      // ปิด tax invoice — reset
      updateTax({ enabled: false, useSaved: false, name: '', address: '', taxId: '', email: '' });
    } else {
      updateTax({ enabled: true });
    }
  };

  const toggleUseSaved = (v) => {
    if (v && savedGuardian) {
      updateTax({
        useSaved: true,
        name: savedGuardian.name || '',
        address: savedGuardian.taxAddress || savedGuardian.contactAddress || '',
        taxId: savedGuardian.taxId || '',
        email: savedGuardian.email || '',
      });
    } else {
      updateTax({ useSaved: false });
    }
  };

  const pay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); next(); }, 1500);
  };

  return (
    <Card>
      <Header icon={CreditCard} title="ชำระเงิน" subtitle="ระบบชำระเงินปลอดภัย · BEAM" />

      <div className="space-y-4">
        <div className="relative rounded-xl p-4 overflow-hidden bg-gradient-to-r from-slate-900 to-red-950 text-white flex items-center justify-between shadow-lg">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/20 rounded-full blur-2xl" aria-hidden="true" />
          <span className="relative text-[10px] font-bold text-red-300 uppercase tracking-widest">ยอดที่ต้องชำระ</span>
          <span className="relative text-3xl font-black tracking-tight">{fmt(data.finalTotal || 0)} <span className="text-sm font-normal text-slate-300">฿</span></span>
        </div>

        <div>
          <Label>วิธีชำระเงิน</Label>
          <div className="grid grid-cols-2 gap-2">
            <MethodCard id="credit" active={method === 'credit'} onClick={setMethod} title="บัตรเครดิต" sub="VISA · Mastercard · JCB" />
            <MethodCard id="qr" active={method === 'qr'} onClick={setMethod} title="QR / โอนเงิน" sub="Thai QR Payment" />
          </div>
        </div>

        {method === 'credit' ? (
          <div className="space-y-2.5 rounded-md border border-slate-200 p-4">
            <div>
              <Label>หมายเลขบัตร</Label>
              <Input icon={CreditCard} placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label>วันหมดอายุ</Label>
                <Input placeholder="MM/YY" />
              </div>
              <div>
                <Label>CVV</Label>
                <Input placeholder="123" maxLength={4} />
              </div>
            </div>
            <div>
              <Label>ชื่อบนบัตร</Label>
              <Input placeholder="NAME SURNAME" />
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 p-5 text-center">
            <div className="w-40 h-40 mx-auto bg-white border border-slate-200 rounded-md flex items-center justify-center p-2">
              <QRPattern />
            </div>
            <p className="text-xs text-slate-500 mt-3">สแกน QR เพื่อชำระเงิน · รองรับทุกธนาคาร</p>
          </div>
        )}

        {/* Tax invoice section */}
        <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
          <label className={`flex items-start gap-3 p-3 cursor-pointer transition ${
            taxInvoice.enabled ? 'bg-blue-50/40' : 'bg-slate-50/50 hover:bg-slate-50'
          }`}>
            <input
              type="checkbox"
              checked={taxInvoice.enabled}
              onChange={e => toggleEnabled(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileIcon className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
                ออกใบกำกับภาษี
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ติ๊กเพื่อกรอกข้อมูลสำหรับการออกใบกำกับภาษีตามกฎหมาย
              </p>
            </div>
          </label>

          {taxInvoice.enabled && (
            <div className="border-t border-slate-200 p-3 space-y-3 bg-white">
              {/* Use saved data checkbox */}
              {savedGuardian && (
                <label className={`flex items-start gap-3 p-2.5 rounded-lg border-2 cursor-pointer transition ${
                  taxInvoice.useSaved ? 'border-red-300 bg-red-50/40' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={taxInvoice.useSaved}
                    onChange={e => toggleUseSaved(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-red-600 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-red-600" strokeWidth={2.5} />
                      ใช้ข้อมูลที่บันทึกไว้
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {savedGuardian.taxId ? `${savedGuardian.name} · เลขผู้เสียภาษี ${savedGuardian.taxId}` : `${savedGuardian.name}`}
                    </p>
                  </div>
                </label>
              )}

              <div>
                <Label required>ชื่อ-นามสกุล (หรือชื่อบริษัท)</Label>
                <Input
                  icon={User}
                  placeholder="ชื่อบนใบกำกับภาษี"
                  value={taxInvoice.name}
                  onChange={e => updateTax({ name: e.target.value })}
                />
              </div>
              <div>
                <Label required>ที่อยู่สำหรับออกใบกำกับภาษี</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                  <textarea
                    rows={3}
                    placeholder="ที่อยู่ที่จะปรากฏบนใบกำกับภาษี"
                    value={taxInvoice.address}
                    onChange={e => updateTax({ address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition resize-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label required>เลขประจำตัวผู้เสียภาษี</Label>
                  <Input
                    icon={Tag}
                    placeholder="13 หลัก"
                    value={taxInvoice.taxId}
                    onChange={e => updateTax({ taxId: e.target.value.replace(/[^0-9]/g, '').slice(0, 13) })}
                  />
                </div>
                <div>
                  <Label required>อีเมล</Label>
                  <Input
                    icon={Mail}
                    type="email"
                    placeholder="สำหรับส่งใบกำกับภาษี"
                    value={taxInvoice.email}
                    onChange={e => updateTax({ email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-900" strokeWidth={1.5} />
          การชำระเงินเข้ารหัสและคุ้มครองโดย BEAM
        </p>

        <div className="flex gap-2 pt-1">
          <Button variant="secondary" onClick={prev} className="flex-1" disabled={processing}>
            <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
          </Button>
          <Button onClick={pay} disabled={processing} className="flex-1">
            {processing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                กำลังประมวลผล
              </>
            ) : (
              <>ยืนยันชำระ {fmt(data.finalTotal || 0)} ฿</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

const MethodCard = ({ id, active, onClick, title, sub }) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className={`text-left p-3 rounded-md border transition ${
      active ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-200' : 'border-slate-200 bg-white hover:border-slate-300'
    }`}
  >
    <div className="flex items-center justify-between mb-0.5">
      <span className="text-sm font-medium text-slate-900">{title}</span>
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-slate-900' : 'border-slate-300'}`}>
        {active && <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />}
      </span>
    </div>
    <p className="text-[11px] text-slate-500">{sub}</p>
  </button>
);

// ============================================================
// SUCCESS
// ============================================================
function StepSuccess({ racers, data, reset, onBackToHome }) {
  const refId = useMemo(() => 'REG-' + Date.now().toString().slice(-8), []);
  const totalItems = racers.reduce((s, r) => s + Object.values(r.selectedRaces || {}).reduce((a, b) => a + b.length, 0), 0);

  return (
    <Card>
      <div className="max-w-2xl mx-auto">
        {/* Success banner */}
        <div className="-mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-5 overflow-hidden rounded-t-2xl">
          <img src={SUCCESS_BANNER} alt="สำเร็จแล้ว" className="w-full h-auto block" />
        </div>

        {/* Headline */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">เจอกันที่สนามแข่ง!</h2>
          <p className="text-sm text-slate-500">เราได้ส่งอีเมลยืนยันการลงทะเบียนไปยังอีเมลของท่านแล้ว</p>
        </div>

        {/* Summary */}
        <div className="rounded-xl border-2 border-slate-200 p-4 text-left space-y-2 mb-5 bg-white">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">เลขอ้างอิง</span>
            <span className="font-mono font-bold text-red-600">{refId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">นักแข่ง</span>
            <span className="font-medium text-slate-900">{racers.length} คน</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">รายการ</span>
            <span className="font-medium text-slate-900">{totalItems} รายการ</span>
          </div>
          <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between items-baseline text-sm">
            <span className="text-slate-500">ยอดที่ชำระ</span>
            <span className="font-black text-xl text-slate-900">{fmt(data.finalTotal || 0)} <span className="text-sm font-normal text-slate-500">฿</span></span>
          </div>
        </div>

        {/* Per-racer QR cards */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2 text-center">บัตรนักแข่ง · {racers.length} ใบ</p>
          <p className="text-[11px] text-slate-500 text-center mb-3">📌 แต่ละนักแข่งมี QR Code ของตัวเอง · บันทึกไว้แสดงในวันแข่ง</p>
          <div className={`grid gap-3 ${racers.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {racers.map((r, ri) => {
              const racerRefId = `${refId}-${String(ri + 1).padStart(2, '0')}`;
              const items = [];
              for (const did of r.selectedDates || []) {
                const dateObj = RACE_DATES.find(d => d.id === did);
                for (const tid of (r.selectedRaces?.[did] || [])) {
                  const t = RACE_TIERS.find(x => x.id === tid);
                  if (dateObj && t) items.push({ date: dateObj, tier: t });
                }
              }
              const country = COUNTRIES.find(c => c.code === r.country) || COUNTRIES[0];
              return (
                <div key={r.id} className="rounded-xl border-2 border-red-200 overflow-hidden bg-white">
                  {/* Card header */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white p-3 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10 text-[10px] font-black">
                            #{ri + 1}
                          </span>
                          <span className="text-[9px] font-bold text-red-300 uppercase tracking-widest">นักแข่ง</span>
                        </div>
                        <span className="text-lg emoji-flag leading-none" title={country.name}>{country.flag}</span>
                      </div>
                      <p className="text-sm font-black truncate">{r.thFirstName} {r.thLastName}</p>
                      <p className="text-[10px] text-white/60 truncate">{r.enFirstName} {r.enLastName}{r.nickname && ` · ${r.nickname}`}</p>
                    </div>
                  </div>
                  {/* QR section */}
                  <div className="p-3 text-center bg-white">
                    <div className="w-28 h-28 mx-auto bg-white border-2 border-slate-200 rounded-lg p-1 shadow-sm mb-2">
                      <QRPattern />
                    </div>
                    <p className="font-mono text-[10px] font-bold text-red-600">{racerRefId}</p>
                  </div>
                  {/* Items */}
                  {items.length > 0 && (
                    <div className="border-t border-slate-100 p-2 bg-slate-50/50 space-y-1">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px]">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700 flex-shrink-0">
                            {item.date.short}
                          </span>
                          <span className="text-slate-700 truncate flex-1">รุ่น {item.tier.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {onBackToHome && (
            <Button onClick={onBackToHome} className="w-full">
              ดูประวัติการลงทะเบียน <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={reset} variant="secondary" className="w-full">
            {onBackToHome ? 'ลงทะเบียนเพิ่มเติม' : 'ลงทะเบียนนักแข่งเพิ่มเติม'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// NAVBAR — floating transparent style
// ============================================================
function Navbar({ currentView, onNavigate, user, onLogin, onLogout, transparent, onAdminLogin }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'หน้าหลัก' },
    { id: 'events', label: 'ปฏิทินกิจกรรม' },
    { id: 'news', label: 'ประชาสัมพันธ์' },
    { id: 'faq', label: 'คำถามที่พบบ่อย' },
    { id: 'contact', label: 'ติดต่อเรา' },
  ];

  const isTransparent = transparent && !scrolled;

  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-black/80 backdrop-blur-md border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 hover:opacity-80 transition">
          <img src={GRANDPRIX_LOGO} alt="Grandprix" className="h-9 sm:h-10 w-auto" />
          <span className="text-base sm:text-lg font-bold tracking-tight text-white">Runbike</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => item.id === 'landing' && onNavigate('landing')}
              className={`text-sm font-medium transition relative group ${
                currentView === item.id ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-1.5 left-0 right-0 h-0.5 bg-red-500 transition-all ${
                currentView === item.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
              }`} />
            </button>
          ))}
        </div>

        {/* Right area */}
        <div className="flex items-center gap-3">
          {/* Search icon */}
          <button className="hidden sm:inline-flex w-10 h-10 items-center justify-center text-white/80 hover:text-white transition" aria-label="ค้นหา">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('history')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition ${
                  currentView === 'history' ? 'bg-red-600 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileIcon className="w-4 h-4" strokeWidth={1.75} />
                ประวัติของฉัน
              </button>
              <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-bold flex items-center justify-center">
                  {(user.username || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-white max-w-[100px] truncate">{user.username}</span>
                <button onClick={onLogout} title="ออกจากระบบ" className="text-white/60 hover:text-red-400 transition p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => onLogin('login')}
                className="hidden sm:inline-flex items-center justify-center h-10 px-4 text-sm font-semibold text-white hover:text-red-400 transition leading-none"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => onLogin('register')}
                className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700 text-white transition leading-none"
              >
                สมัครสมาชิก
              </button>
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="เมนู"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileOpen
                ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-md px-4 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { item.id === 'landing' && onNavigate('landing'); setMobileOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => { onNavigate('history'); setMobileOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white"
            >
              ประวัติของฉัน
            </button>
          )}
          {!user && (
            <button
              onClick={() => { onLogin('login'); setMobileOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white"
            >
              เข้าสู่ระบบ
            </button>
          )}
          {onAdminLogin && (
            <div className="pt-2 mt-2 border-t border-white/10">
              <button
                onClick={() => { onAdminLogin(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-xs font-medium text-white/50 rounded-md hover:bg-white/5 hover:text-red-400 transition inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                Admin Console
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// ============================================================
// LANDING PAGE — dark cinematic
// ============================================================
function LandingPage({ onRegisterClick, user }) {
  const events = [
    {
      id: 'evt1',
      tag: 'RUN BIKE',
      title: 'RUN BIKE',
      dateRange: '26 มีนาคม 2569 - 26 มี.ค.',
      status: 'รอการประกาศ',
      registered: 9,
      capacity: 200,
      coverVideo: HERO_VIDEO,
      coverImage: HERO_BANNER,
      darkOverlay: true,
    },
    {
      id: 'evt2',
      tag: 'GRANDPRIX RUNBIKE CHAMPIONSHIP 2026',
      title: 'GRANDPRIX RUNBIKE CHAMPIONSHIP 2026',
      dateRange: '26 มีนาคม 2569 - 27 มี.ค.',
      status: 'รอติดตาม',
      registered: 3,
      capacity: 100,
      coverVideo: HERO_VIDEO,
      coverImage: SUCCESS_BANNER,
      darkOverlay: true,
    },
  ];

  return (
    <div className="bg-black text-white">
      {events.map((evt, idx) => (
        <EventHero key={evt.id} event={evt} onRegisterClick={onRegisterClick} index={idx} />
      ))}

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={GRANDPRIX_LOGO} alt="Grandprix" className="h-9 w-auto" />
                <span className="text-base font-bold text-white">Runbike</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Grandprix Runbike Championship 2025<br />
                The Starting Line for Future Champions!
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">เมนู</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/70 hover:text-white transition">ข่าวประชาสัมพันธ์</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition">ปฏิทินกิจกรรม</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition">รายงาน</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition">แผนผังเว็บไซต์</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">ติดต่อเรา</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-white/70">
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  <span>025538111</span>
                </li>
                <li className="flex items-center gap-2 text-white/70">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  <span>Grandprix@gmail.com</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 mt-4">
                <a href="https://www.facebook.com/p/Grandprix-Runbike-Championship-61572470865290/" target="_blank" rel="noopener" className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
            © 2569 Runbike — สงวนลิขสิทธิ์
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-component: EventHero — full-screen hero per event
function EventHero({ event, onRegisterClick, index }) {
  return (
    <>
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background video / image */}
        {event.coverVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={event.coverImage}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={event.coverVideo} type="video/mp4" />
            {/* Fallback ถ้า browser ไม่รองรับ — แสดง poster image */}
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          </video>
        ) : (
          <img
            src={event.coverImage}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" aria-hidden="true" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-end pb-16 sm:pb-24">
          <p className="text-[11px] sm:text-xs font-bold text-white/70 uppercase tracking-[0.3em] mb-3 sm:mb-4">
            {event.tag}
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-6 sm:mb-8 max-w-4xl">
            {event.title}
          </h1>

          {/* Meta pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Pill icon={Calendar}>{event.dateRange}</Pill>
            <Pill icon={Flag}>{event.status}</Pill>
            <Pill icon={User}>{event.registered}/{event.capacity} คน</Pill>
            <button
              onClick={() => onRegisterClick(event)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition shadow-lg shadow-red-600/40 group"
            >
              สมัครเลย
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Scroll indicator (only on first hero) */}
        {index === 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
            <ChevronDown className="w-4 h-4" strokeWidth={2} />
          </div>
        )}
      </section>

      {/* Marquee ticker between heroes */}
      <div className="bg-white overflow-hidden py-6 sm:py-10">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="text-5xl sm:text-7xl font-black px-8 select-none"
              style={{ WebkitTextStroke: '1px #e2e8f0', color: 'transparent' }}
            >
              {event.tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

// Pill component
function Pill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium">
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />}
      {children}
    </span>
  );
}

// ============================================================
// LOGIN MODAL
// ============================================================
function LoginModal({ open, onClose, onLogin, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode);
  const [form, setForm] = useState({ identifier: '', password: '', email: '', username: '', phone: '', confirmPassword: '' });
  const [err, setErr] = useState('');

  // Forgot password flow state
  const [forgotPhase, setForgotPhase] = useState('request'); // request | otp | reset | success
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState(['', '', '', '', '', '']);
  const [forgotNewPwd, setForgotNewPwd] = useState('');
  const [forgotConfirmPwd, setForgotConfirmPwd] = useState('');
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [forgotLoading, setForgotLoading] = useState(false);
  const forgotOtpRefs = useRef([]);

  useEffect(() => {
    setMode(defaultMode);
    setErr('');
    // reset forgot state ตอนเปิด modal
    setForgotPhase('request');
    setForgotEmail('');
    setForgotOtp(['', '', '', '', '', '']);
    setForgotNewPwd('');
    setForgotConfirmPwd('');
    setForgotCountdown(0);
  }, [defaultMode, open]);

  useEffect(() => {
    if (forgotCountdown <= 0) return;
    const t = setTimeout(() => setForgotCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [forgotCountdown]);

  const goForgot = () => {
    setMode('forgot');
    setForgotPhase('request');
    setErr('');
  };

  const submitForgotRequest = () => {
    if (!forgotEmail) return setErr('กรุณากรอกอีเมล');
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) return setErr('รูปแบบอีเมลไม่ถูกต้อง');
    setErr('');
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotPhase('otp');
      setForgotCountdown(60);
      // auto-focus ช่องแรก
      setTimeout(() => forgotOtpRefs.current[0]?.focus(), 50);
    }, 800);
  };

  const handleOtpInput = (i, v) => {
    if (v && !/^\d$/.test(v)) return;
    const next = [...forgotOtp];
    next[i] = v.slice(-1);
    setForgotOtp(next);
    if (v && i < 5) forgotOtpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !forgotOtp[i] && i > 0) {
      forgotOtpRefs.current[i - 1]?.focus();
    }
  };

  const submitForgotOtp = () => {
    const code = forgotOtp.join('');
    if (code.length !== 6) return setErr('กรุณากรอก OTP ให้ครบ 6 หลัก');
    setErr('');
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotPhase('reset');
    }, 600);
  };

  const resendOtp = () => {
    if (forgotCountdown > 0) return;
    setForgotOtp(['', '', '', '', '', '']);
    setForgotCountdown(60);
    setErr('');
    setTimeout(() => forgotOtpRefs.current[0]?.focus(), 50);
  };

  const submitForgotReset = () => {
    if (!forgotNewPwd || !forgotConfirmPwd) return setErr('กรุณากรอกรหัสผ่านทั้ง 2 ช่อง');
    if (forgotNewPwd.length < 8) return setErr('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
    if (forgotNewPwd !== forgotConfirmPwd) return setErr('รหัสผ่านไม่ตรงกัน');
    setErr('');
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotPhase('success');
    }, 800);
  };

  const submitLogin = () => {
    if (!form.identifier || !form.password) return setErr('กรุณากรอกอีเมล/ชื่อผู้ใช้ และรหัสผ่าน');
    setErr('');
    onLogin({
      username: form.identifier.includes('@') ? form.identifier.split('@')[0] : form.identifier,
      email: form.identifier.includes('@') ? form.identifier : `${form.identifier}@example.com`,
      phone: '',
    });
    onClose();
  };

  const submitRegister = () => {
    if (!form.username || !form.email || !form.password) return setErr('กรุณากรอกข้อมูลให้ครบ');
    if (form.password !== form.confirmPassword) return setErr('รหัสผ่านไม่ตรงกัน');
    if (!/\S+@\S+\.\S+/.test(form.email)) return setErr('รูปแบบอีเมลไม่ถูกต้อง');
    setErr('');
    onLogin({ username: form.username, email: form.email, phone: form.phone });
    onClose();
  };

  // กำหนด title แบบ dynamic
  const modalTitle =
    mode === 'forgot' ? (
      forgotPhase === 'request' ? 'ลืมรหัสผ่าน' :
      forgotPhase === 'otp' ? 'ยืนยัน OTP' :
      forgotPhase === 'reset' ? 'ตั้งรหัสผ่านใหม่' :
      'เสร็จสมบูรณ์'
    ) : (mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก');

  return (
    <Modal open={open} onClose={onClose} title={modalTitle}>
      {/* Toggle tabs — ซ่อนตอนอยู่ forgot mode */}
      {mode !== 'forgot' && (
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-4">
          <button
            type="button"
            onClick={() => { setMode('login'); setErr(''); }}
            className={`flex-1 h-9 text-sm font-semibold rounded-md transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErr(''); }}
            className={`flex-1 h-9 text-sm font-semibold rounded-md transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            สมัครสมาชิก
          </button>
        </div>
      )}

      {mode === 'login' && (
        <div className="space-y-3">
          <div>
            <Label required>อีเมลหรือชื่อผู้ใช้</Label>
            <Input
              icon={User}
              placeholder="email@example.com หรือ username"
              value={form.identifier}
              onChange={e => setForm({ ...form, identifier: e.target.value })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-600">
                รหัสผ่าน <span className="text-red-500 ml-0.5">*</span>
              </label>
              <button type="button" onClick={goForgot} className="text-[11px] text-red-600 hover:underline font-medium">ลืมรหัสผ่าน?</button>
            </div>
            <Input icon={Lock} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {err && <Alert>{err}</Alert>}
          <Button onClick={submitLogin} className="w-full">
            เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-[11px] text-slate-400 text-center">💡 Demo: ใส่อะไรก็เข้าได้</p>
        </div>
      )}

      {mode === 'forgot' && (
        <div className="space-y-3">
          {/* Step indicator */}
          {forgotPhase !== 'success' && (
            <div className="flex items-center gap-1 mb-1">
              {['request', 'otp', 'reset'].map((p, i) => {
                const order = ['request', 'otp', 'reset'].indexOf(forgotPhase);
                const active = i === order;
                const done = i < order;
                return (
                  <React.Fragment key={p}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black transition ${
                      active ? 'bg-red-600 text-white shadow shadow-red-600/30' :
                      done ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {done ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
                    </div>
                    {i < 2 && <div className={`flex-1 h-0.5 ${done ? 'bg-green-600' : 'bg-slate-200'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {forgotPhase === 'request' && (
            <>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div className="text-xs text-blue-900">
                  <p className="font-bold">รีเซ็ตรหัสผ่าน</p>
                  <p className="mt-0.5 text-blue-700">กรอกอีเมลที่ใช้สมัครสมาชิก ระบบจะส่ง OTP สำหรับยืนยันตัวตน</p>
                </div>
              </div>
              <div>
                <Label required>อีเมล</Label>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="email@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitForgotRequest()}
                />
              </div>
              {err && <Alert>{err}</Alert>}
              <div className="flex gap-2 pt-1">
                <Button variant="secondary" onClick={() => { setMode('login'); setErr(''); }} className="flex-1">
                  <ArrowLeft className="w-4 h-4" /> กลับ
                </Button>
                <Button onClick={submitForgotRequest} disabled={forgotLoading} className="flex-1">
                  {forgotLoading ? 'กำลังส่ง...' : <>ส่ง OTP <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
            </>
          )}

          {forgotPhase === 'otp' && (
            <>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div className="text-xs text-amber-900">
                  <p className="font-bold">ส่ง OTP ไปยังอีเมลแล้ว</p>
                  <p className="mt-0.5 text-amber-700">{forgotEmail}</p>
                </div>
              </div>
              <div>
                <Label required>รหัส OTP (6 หลัก)</Label>
                <div className="flex gap-1.5 justify-center">
                  {forgotOtp.map((d, i) => (
                    <input
                      key={i}
                      ref={el => forgotOtpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-black rounded-md border-2 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                    />
                  ))}
                </div>
              </div>
              <div className="text-center text-[11px] text-slate-500">
                {forgotCountdown > 0 ? (
                  <>ขอ OTP ใหม่ใน <span className="font-mono font-bold text-slate-700">{forgotCountdown}s</span></>
                ) : (
                  <button onClick={resendOtp} className="text-red-600 hover:underline font-medium">ขอ OTP ใหม่</button>
                )}
              </div>
              {err && <Alert>{err}</Alert>}
              <div className="flex gap-2 pt-1">
                <Button variant="secondary" onClick={() => { setForgotPhase('request'); setErr(''); }} className="flex-1">
                  <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
                </Button>
                <Button onClick={submitForgotOtp} disabled={forgotLoading} className="flex-1">
                  {forgotLoading ? 'กำลังตรวจสอบ...' : <>ยืนยัน <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 text-center">💡 Demo: กรอกตัวเลข 6 หลัก อะไรก็ได้</p>
            </>
          )}

          {forgotPhase === 'reset' && (
            <>
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <div className="text-xs text-green-900">
                  <p className="font-bold">ยืนยันตัวตนสำเร็จ</p>
                  <p className="mt-0.5 text-green-700">ตั้งรหัสผ่านใหม่ของคุณได้เลย</p>
                </div>
              </div>
              <div>
                <Label required>รหัสผ่านใหม่</Label>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  value={forgotNewPwd}
                  onChange={e => setForgotNewPwd(e.target.value)}
                />
              </div>
              <div>
                <Label required>ยืนยันรหัสผ่านใหม่</Label>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                  value={forgotConfirmPwd}
                  onChange={e => setForgotConfirmPwd(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitForgotReset()}
                />
              </div>
              {err && <Alert>{err}</Alert>}
              <Button onClick={submitForgotReset} disabled={forgotLoading} className="w-full">
                {forgotLoading ? 'กำลังบันทึก...' : <><Check className="w-4 h-4" /> บันทึกรหัสผ่านใหม่</>}
              </Button>
            </>
          )}

          {forgotPhase === 'success' && (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-3 shadow-lg shadow-green-500/30">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">รีเซ็ตรหัสผ่านสำเร็จ!</h3>
              <p className="text-sm text-slate-500 mb-5">คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว</p>
              <Button onClick={() => { setMode('login'); setErr(''); }} className="w-full">
                <ArrowLeft className="w-4 h-4" /> กลับไปเข้าสู่ระบบ
              </Button>
            </div>
          )}
        </div>
      )}

      {mode === 'register' && (
        <div className="space-y-3">
          <div>
            <Label required>ชื่อผู้ใช้</Label>
            <Input icon={User} placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <Label required>อีเมล</Label>
            <Input icon={Mail} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>เบอร์โทรศัพท์</Label>
            <Input icon={Phone} placeholder="08X-XXX-XXXX" maxLength={10} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>รหัสผ่าน</Label>
              <Input icon={Lock} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <Label required>ยืนยันรหัสผ่าน</Label>
              <Input icon={Lock} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
          </div>
          {err && <Alert>{err}</Alert>}
          <Button onClick={submitRegister} className="w-full">
            สมัครสมาชิก <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Modal>
  );
}

// ============================================================
// EVENT SELECT MODAL — เลือก event ก่อนไปลงทะเบียน
// ============================================================
function EventSelectModal({ open, onClose, events, onSelectEvent }) {
  return (
    <Modal open={open} onClose={onClose} title="เลือกการแข่งขันที่จะลงทะเบียน">
      <p className="text-xs text-slate-500 mb-4">เลือกรายการที่ต้องการลงทะเบียนนักแข่ง</p>
      <div className="space-y-3">
        {events.map(evt => {
          const pct = Math.round((evt.registered / evt.capacity) * 100);
          const isFull = evt.registered >= evt.capacity;
          return (
            <button
              key={evt.id}
              onClick={() => !isFull && onSelectEvent(evt)}
              disabled={isFull}
              className={`group w-full text-left rounded-xl overflow-hidden border-2 transition-all ${
                isFull
                  ? 'border-slate-200 opacity-60 cursor-not-allowed'
                  : 'border-slate-200 hover:border-red-300 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {/* Cover thumbnail strip */}
              <div className="relative h-24 overflow-hidden bg-gradient-to-br from-slate-800 to-red-900">
                <img
                  src={evt.coverImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                {evt.featured && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest shadow-md">
                    <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
                    แนะนำ
                  </span>
                )}
                <span className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                  isFull ? 'bg-slate-900/70 text-white/70' : 'bg-white/90 text-red-600'
                }`}>
                  <Flag className="w-2.5 h-2.5" strokeWidth={2.5} />
                  {isFull ? 'เต็มแล้ว' : evt.status}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none">{evt.subtitle}</p>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight mt-0.5 drop-shadow line-clamp-1">
                    {evt.title}
                  </h3>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-white">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" strokeWidth={2} />
                    {evt.dateRange}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" strokeWidth={2} />
                    {evt.venue}
                  </span>
                </div>

                {/* Progress + select indicator */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-500">ผู้สมัคร</span>
                      <span className="font-bold text-slate-900">{evt.registered}/{evt.capacity} คน</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-slate-400' : 'bg-gradient-to-r from-red-500 to-red-700'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  {!isFull && (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 font-bold opacity-60 group-hover:opacity-100 transition flex-shrink-0">
                      เลือก <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={onClose}
        className="w-full mt-4 h-10 text-sm font-medium text-slate-500 hover:text-slate-700 transition"
      >
        ยกเลิก
      </button>
    </Modal>
  );
}

// ============================================================
// USER SIDEBAR — navigation ระหว่างหน้าของ user หลัง login
// ============================================================
function UserSidebar({ currentView, onNavigate, user, racersCount, regsCount, hasGuardian }) {
  const items = [
    { id: 'racers', label: 'ข้อมูลนักแข่ง', icon: User, count: racersCount },
    { id: 'guardian', label: 'ข้อมูลผู้ปกครอง', icon: ShieldCheck, count: hasGuardian ? '✓' : '!' },
    { id: 'history', label: 'ประวัติการลงทะเบียน', icon: FileIcon, count: regsCount },
  ];
  return (
    <aside className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* User card */}
      <div className="p-4 bg-gradient-to-br from-slate-900 to-red-950 text-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-base font-black shadow-md">
            {(user?.username || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold truncate">{user?.username}</p>
            <p className="text-[10px] text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
      {/* Menu */}
      <nav className="p-2">
        {items.map(it => {
          const Icon = it.icon;
          const active = currentView === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onNavigate(it.id)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition mb-1 ${
                active ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${active ? 'text-red-600' : 'text-slate-400'}`} strokeWidth={1.75} />
                {it.label}
              </span>
              <span className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-md text-[10px] font-black ${
                active ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>{it.count}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// ============================================================
// MY RACERS PAGE — รายการนักแข่งที่ user เคยเพิ่ม
// ============================================================
function MyRacersPage({ racers, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">ข้อมูลนักแข่ง</h1>
          <p className="text-sm text-slate-500 mt-1">นักแข่งทั้งหมดที่บันทึกไว้ในระบบ · พร้อมใช้ลงทะเบียนการแข่งขัน</p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4" /> เพิ่มนักแข่ง
        </Button>
      </div>

      {racers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center bg-white">
          <div className="inline-flex w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
            <User className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">ยังไม่มีนักแข่งในระบบ</h3>
          <p className="text-sm text-slate-500 mb-4">เพิ่มข้อมูลนักแข่งเพื่อใช้ลงทะเบียนการแข่งขันได้รวดเร็ว</p>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4" /> เพิ่มนักแข่งคนแรก
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {racers.map((r, idx) => {
            const country = COUNTRIES.find(c => c.code === r.country) || COUNTRIES[0];
            let age = null;
            if (r.birthDate) {
              const birth = new Date(r.birthDate);
              const now = new Date();
              age = now.getFullYear() - birth.getFullYear();
              const m = now.getMonth() - birth.getMonth();
              if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
            }
            return (
              <div key={r.id} className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden hover:border-red-300 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row">
                  {/* Left: number + flag — accent strip */}
                  <div className="sm:w-48 bg-gradient-to-br from-slate-900 to-red-950 text-white p-4 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-2">
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm font-black flex-shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="sm:hidden flex-1 min-w-0">
                        <p className="text-sm font-black truncate">{r.thFirstName} {r.thLastName}</p>
                        <p className="text-[10px] text-red-300 truncate">{r.enFirstName} {r.enLastName}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[9px] font-bold text-red-300 uppercase tracking-widest leading-none mb-1">นักแข่ง</p>
                      <p className="text-[10px] text-white/60 leading-none">บันทึกแล้ว</p>
                    </div>
                    <span className="text-2xl emoji-flag leading-none flex-shrink-0" title={country.name}>{country.flag}</span>
                  </div>

                  {/* Right: info */}
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <p className="hidden sm:block text-lg font-black text-slate-900 leading-tight">
                          {r.thFirstName} {r.thLastName}
                          {r.nickname && <span className="text-slate-400 font-normal text-base ml-2">· {r.nickname}</span>}
                        </p>
                        <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
                          {r.enFirstName} {r.enLastName}
                        </p>
                        {/* meta line */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {r.gender === 'male' || r.gender === 'M' ? '👦 ชาย' : r.gender === 'female' || r.gender === 'F' ? '👧 หญิง' : '—'}
                          </span>
                          {age !== null && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {age} ปี
                            </span>
                          )}
                          {r.shirtSize && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold">
                              ไซส์ {r.shirtSize}
                            </span>
                          )}
                          {r.teamName && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold max-w-[160px]">
                              <Flag className="w-2.5 h-2.5 flex-shrink-0" strokeWidth={2.5} />
                              <span className="truncate">{r.teamName}</span>
                            </span>
                          )}
                          {r.documents && r.documents.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-[10px] font-bold">
                              <FileIcon className="w-2.5 h-2.5" strokeWidth={2.5} />
                              เอกสาร {r.documents.length} ไฟล์
                            </span>
                          )}
                          {(!r.documents || r.documents.length === 0) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                              <Upload className="w-2.5 h-2.5" strokeWidth={2.5} />
                              ยังไม่มีเอกสาร
                            </span>
                          )}
                          {r.isAnnualMember && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                              <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
                              สมาชิกรายปี
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => onEdit(r)}
                          className="inline-flex items-center gap-1 px-2.5 h-8 rounded-md border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 text-xs font-semibold text-slate-700 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          แก้ไข
                        </button>
                        <button
                          onClick={() => { if (confirm(`ลบ "${r.thFirstName} ${r.thLastName}"?`)) onDelete(r.id); }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 text-slate-500 transition"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// RACER EDITOR MODAL — เพิ่ม/แก้ไขนักแข่ง (form แบบไม่มีรุ่น/วันแข่ง)
// ============================================================
function RacerEditorModal({ open, onClose, racer, onSave }) {
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');
  const [annualMemberOpen, setAnnualMemberOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setR(racer ? { ...racer } : newRacer());
      setErr('');
    }
  }, [open, racer]);

  if (!r) return null;
  const update = (patch) => setR({ ...r, ...patch });
  const ageYM = calcAgeYM(r.birthDate);

  const submit = () => {
    if (!r.thFirstName || !r.thLastName || !r.enFirstName || !r.enLastName) {
      return setErr('กรุณากรอกชื่อ-นามสกุลให้ครบ');
    }
    if (!r.birthDate) return setErr('กรุณาเลือกวันเกิด');
    if (!r.gender) return setErr('กรุณาเลือกเพศ');
    if (!r.shirtSize) return setErr('กรุณาเลือกไซส์เสื้อ');
    if (!r.country) return setErr('กรุณาเลือกประเทศ');
    if (!r.documents || r.documents.length === 0) return setErr('กรุณาอัปโหลดเอกสารยืนยันตัวตนอย่างน้อย 1 ไฟล์');
    setErr('');
    onSave(r);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={racer ? 'แก้ไขนักแข่ง' : 'เพิ่มนักแข่งใหม่'}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label required>ชื่อ (ไทย)</Label>
            <Input value={r.thFirstName} onChange={e => update({ thFirstName: e.target.value })} />
          </div>
          <div>
            <Label required>นามสกุล (ไทย)</Label>
            <Input value={r.thLastName} onChange={e => update({ thLastName: e.target.value })} />
          </div>
          <div>
            <Label required>First name</Label>
            <Input value={r.enFirstName} onChange={e => update({ enFirstName: e.target.value })} />
          </div>
          <div>
            <Label required>Last name</Label>
            <Input value={r.enLastName} onChange={e => update({ enLastName: e.target.value })} />
          </div>
          <div>
            <Label>ชื่อเล่น</Label>
            <Input placeholder="เช่น น้องเอ" value={r.nickname || ''} onChange={e => update({ nickname: e.target.value })} />
          </div>
          <div>
            <Label required>ประเทศ</Label>
            <CountrySelect value={r.country || 'TH'} onChange={code => update({ country: code })} />
          </div>
          <div>
            <Label required>เพศ</Label>
            <div className="grid grid-cols-2 gap-2">
              <GenderOption active={r.gender === 'male' || r.gender === 'M'} onClick={() => update({ gender: 'male' })} label="ชาย" />
              <GenderOption active={r.gender === 'female' || r.gender === 'F'} onClick={() => update({ gender: 'female' })} label="หญิง" />
            </div>
          </div>
          <div>
            <Label required>วันเดือนปีเกิด</Label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  icon={Calendar}
                  type="date"
                  value={r.birthDate}
                  onChange={e => update({ birthDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              {r.birthDate && (
                <div className="h-10 px-2.5 rounded-md bg-slate-100 border border-slate-200 flex items-center text-[11px] font-medium text-slate-700 whitespace-nowrap">
                  {ageYM.years} ปี {ageYM.months} ด.
                </div>
              )}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label required>ไซส์เสื้อ</Label>
            <div className="grid grid-cols-7 gap-1">
              {SHIRT_SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => update({ shirtSize: size })}
                  className={`h-10 text-xs font-bold rounded-md border-2 transition ${
                    r.shirtSize === size ? 'border-red-600 bg-red-50 text-red-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>ชื่อทีม / สังกัด</Label>
            <Input icon={Flag} placeholder="เช่น Bangkok Runbike Club" value={r.teamName || ''} onChange={e => update({ teamName: e.target.value })} />
          </div>
        </div>

        {/* Documents — เอกสารยืนยันตัวตน */}
        <Divider />
        <div>
          <Label required>เอกสารยืนยันตัวตน</Label>
          <p className="text-[11px] text-slate-500 mb-2">อัปโหลดสูติบัตร / บัตรประชาชน / หนังสือเดินทาง (รับ JPG, PNG, PDF · สูงสุด 5MB ต่อไฟล์)</p>
          <DocumentUpload
            files={r.documents || []}
            onChange={docs => update({ documents: docs })}
          />
        </div>

        {/* Annual member checkbox */}
        <Divider />
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/40 p-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!r.isAnnualMember}
              onChange={e => {
                const v = e.target.checked;
                if (v) {
                  // เปิด popup ตรวจสอบก่อน
                  setAnnualMemberOpen(true);
                } else {
                  update({ isAnnualMember: false, annualMemberId: null });
                }
              }}
              className="w-4 h-4 mt-0.5 accent-amber-600 cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                เป็นสมาชิกรายปี
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                สมาชิกรายปีจะได้รับสิทธิพิเศษและส่วนลดการแข่งขัน
              </p>
              {r.isAnnualMember && r.annualMemberId && (
                <p className="text-[10px] font-mono font-bold text-amber-800 mt-1">
                  ✓ ยืนยันแล้ว · ID: {r.annualMemberId}
                </p>
              )}
            </div>
          </label>
        </div>

        {err && <Alert>{err}</Alert>}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">ยกเลิก</Button>
          <Button onClick={submit} className="flex-1">
            <Check className="w-4 h-4" /> บันทึก
          </Button>
        </div>
      </div>

      {/* Annual member verification modal */}
      <AnnualMemberVerifyModal
        open={annualMemberOpen}
        onClose={() => setAnnualMemberOpen(false)}
        onVerified={(memberId) => {
          update({ isAnnualMember: true, annualMemberId: memberId });
          setAnnualMemberOpen(false);
        }}
      />
    </Modal>
  );
}

// Annual member verification — popup ตรวจสอบสมาชิก
function AnnualMemberVerifyModal({ open, onClose, onVerified }) {
  const [identifier, setIdentifier] = useState('');
  const [checking, setChecking] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { if (open) { setIdentifier(''); setErr(''); setChecking(false); } }, [open]);

  const verify = () => {
    if (!identifier.trim()) return setErr('กรุณากรอกอีเมลหรือเบอร์โทร');
    setErr('');
    setChecking(true);
    // Mock: รออ 0.8 วินาที แล้ว approve (demo)
    setTimeout(() => {
      setChecking(false);
      // demo: ทุก identifier ถือว่าเจอ → gen member ID
      const memberId = 'MEM-' + String(Math.floor(Math.random() * 900000) + 100000);
      onVerified(memberId);
    }, 800);
  };

  return (
    <Modal open={open} onClose={onClose} title="ตรวจสอบสมาชิกรายปี">
      <div className="space-y-3">
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
          <div className="text-xs text-amber-800">
            <p className="font-bold">ตรวจสอบสถานะสมาชิกรายปี</p>
            <p className="mt-0.5">กรุณากรอกอีเมลหรือเบอร์โทรที่ใช้สมัครสมาชิก เพื่อตรวจสอบกับฐานข้อมูล</p>
          </div>
        </div>
        <div>
          <Label required>อีเมล หรือ เบอร์โทรศัพท์</Label>
          <Input
            icon={Mail}
            placeholder="email@example.com หรือ 08X-XXX-XXXX"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verify()}
          />
        </div>
        {err && <Alert>{err}</Alert>}
        <div className="flex gap-2 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1">ยกเลิก</Button>
          <Button onClick={verify} disabled={checking} className="flex-1">
            {checking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ'}
            {!checking && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 text-center">💡 Demo: ทุก identifier จะผ่านการตรวจสอบ</p>
      </div>
    </Modal>
  );
}

// ============================================================
// GUARDIAN PAGE — ข้อมูลผู้ปกครอง (จัดการได้ในที่เดียว)
// ============================================================
function GuardianPage({ guardian, onSave }) {
  const [editing, setEditing] = useState(!guardian);
  const [form, setForm] = useState(guardian || {
    name: '', contactAddress: '', taxAddress: '', taxId: '', phone: '', email: '',
  });
  const [err, setErr] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setForm(guardian || { name: '', contactAddress: '', taxAddress: '', taxId: '', phone: '', email: '' });
  }, [guardian]);

  const update = (patch) => setForm({ ...form, ...patch });

  const submit = () => {
    if (!form.name || !form.contactAddress || !form.phone || !form.email) {
      return setErr('กรุณากรอกข้อมูลที่จำเป็นให้ครบ (ชื่อ, ที่อยู่ติดต่อ, เบอร์, อีเมล)');
    }
    setErr('');
    onSave(form);
    setEditing(false);
    setSavedMsg('บันทึกข้อมูลผู้ปกครองเรียบร้อยแล้ว');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const copyContactToTax = () => {
    update({ taxAddress: form.contactAddress });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">ข้อมูลผู้ปกครอง</h1>
          <p className="text-sm text-slate-500 mt-1">บันทึกข้อมูลผู้ปกครองเพื่อนำมาใช้ลงทะเบียนได้รวดเร็ว</p>
        </div>
        {!editing && guardian && (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            แก้ไขข้อมูล
          </Button>
        )}
      </div>

      {savedMsg && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
          <p className="text-sm font-medium text-green-800">{savedMsg}</p>
        </div>
      )}

      {!editing && guardian ? (
        // VIEW MODE
        <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-red-950 text-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-base font-black">
                {guardian.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest leading-none">ผู้ปกครอง</p>
                <p className="text-lg font-black tracking-tight">{guardian.name}</p>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <InfoRow label="ที่อยู่ที่ติดต่อได้" value={guardian.contactAddress} icon={MapPin} />
            <InfoRow label="ที่อยู่สำหรับออกใบกำกับภาษี" value={guardian.taxAddress || '—'} icon={FileIcon} />
            <InfoRow label="เลขประจำตัวผู้เสียภาษี" value={guardian.taxId ? <span className="font-mono">{guardian.taxId}</span> : '—'} icon={Tag} />
            <InfoRow label="เบอร์โทรศัพท์" value={guardian.phone} icon={Phone} />
            <InfoRow label="อีเมล" value={guardian.email} icon={Mail} />
          </div>
        </div>
      ) : (
        // EDIT MODE
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-4">
          <div>
            <Label required>ชื่อ-นามสกุล</Label>
            <Input
              icon={User}
              placeholder="สมชาย ใจดี"
              value={form.name}
              onChange={e => update({ name: e.target.value })}
            />
          </div>
          <div>
            <Label required>ที่อยู่ที่ติดต่อได้</Label>
            <textarea
              placeholder="บ้านเลขที่, หมู่, ถนน, ตำบล, อำเภอ, จังหวัด, ไปรษณีย์"
              value={form.contactAddress}
              onChange={e => update({ contactAddress: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="!mb-0">ที่อยู่สำหรับออกใบกำกับภาษี</Label>
              {form.contactAddress && (
                <button
                  type="button"
                  onClick={copyContactToTax}
                  className="text-[11px] text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  คัดลอกจากที่อยู่ติดต่อ
                </button>
              )}
            </div>
            <textarea
              placeholder="กรอกที่อยู่สำหรับใบกำกับภาษี (ถ้าเหมือนที่อยู่ติดต่อให้กดคัดลอก)"
              value={form.taxAddress}
              onChange={e => update({ taxAddress: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition resize-none"
            />
          </div>
          <div>
            <Label>เลขประจำตัวผู้เสียภาษี</Label>
            <Input
              icon={Tag}
              placeholder="13 หลัก เช่น 1234567890123"
              value={form.taxId}
              onChange={e => update({ taxId: e.target.value.replace(/[^0-9]/g, '').slice(0, 13) })}
            />
            <p className="text-[10px] text-slate-400 mt-1">ใส่เลข 13 หลัก (สำหรับออกใบกำกับภาษีเท่านั้น)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label required>เบอร์โทรศัพท์</Label>
              <Input icon={Phone} placeholder="08X-XXX-XXXX" value={form.phone} onChange={e => update({ phone: e.target.value })} />
            </div>
            <div>
              <Label required>อีเมล</Label>
              <Input icon={Mail} type="email" placeholder="email@example.com" value={form.email} onChange={e => update({ email: e.target.value })} />
            </div>
          </div>

          {err && <Alert>{err}</Alert>}

          <div className="flex gap-2 pt-2">
            {guardian && (
              <Button variant="secondary" onClick={() => { setEditing(false); setErr(''); setForm(guardian); }} className="flex-1">
                ยกเลิก
              </Button>
            )}
            <Button onClick={submit} className="flex-1">
              <Check className="w-4 h-4" /> บันทึก
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// helper row component
function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex gap-3">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-red-600" strokeWidth={2} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">{label}</p>
        <p className="text-sm text-slate-900 mt-1 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

// ============================================================
// HISTORY PAGE
// ============================================================
function HistoryPage({ user, registrations, onRegisterClick, onBackToHome, onSelectRegistration, embedded }) {
  const wrapperClass = embedded ? '' : 'max-w-4xl mx-auto px-4 sm:px-6 py-8';
  return (
    <div className={wrapperClass}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">ประวัติการลงทะเบียน</h1>
          <p className="text-sm text-slate-500 mt-1">สวัสดี <span className="font-medium text-slate-700">{user?.username}</span> · นี่คือรายการนักแข่งที่คุณลงทะเบียนไว้</p>
        </div>
        <Button onClick={onRegisterClick}>
          <Plus className="w-4 h-4" /> ลงทะเบียนเพิ่ม
        </Button>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center bg-white">
          <div className="inline-flex w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
            <Flag className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">ยังไม่มีการลงทะเบียน</h3>
          <p className="text-sm text-slate-500 mb-4">เริ่มลงทะเบียนนักแข่งคนแรกของคุณวันนี้</p>
          <Button onClick={onRegisterClick}>
            ลงทะเบียนเลย <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg, idx) => (
            <div key={reg.id} className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden hover:border-red-200 hover:shadow-lg transition-all">
              <div className="px-5 py-3 bg-gradient-to-r from-slate-900 to-red-950 text-white flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest">การลงทะเบียน #{idx + 1}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono text-xs font-semibold">{reg.refId}</span>
                </div>
                <span className="text-[11px] text-slate-300">{reg.date}</span>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">นักแข่ง</p>
                    <p className="text-lg font-bold text-slate-900">{reg.racers.length} คน</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">รายการ</p>
                    <p className="text-lg font-bold text-slate-900">{reg.totalItems} รายการ</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">ยอดที่ชำระ</p>
                    <p className="text-lg font-black text-red-600">{fmt(reg.total)} ฿</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 mb-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">รายชื่อนักแข่ง · คลิกเพื่อดูบัตรนักแข่ง + QR</p>
                  <div className="space-y-2">
                    {reg.racers.map((racer, ri) => {
                      const tierLabels = [];
                      const dateLabels = new Set();
                      for (const did of racer.selectedDates || []) {
                        const dateObj = RACE_DATES.find(d => d.id === did);
                        if (dateObj) dateLabels.add(dateObj.short);
                        for (const tid of (racer.selectedRaces?.[did] || [])) {
                          const t = RACE_TIERS.find(x => x.id === tid);
                          if (t) tierLabels.push(t.label);
                        }
                      }
                      const uniqTiers = [...new Set(tierLabels)];

                      // คำนวณอายุ
                      let age = null;
                      if (racer.birthDate) {
                        const birth = new Date(racer.birthDate);
                        const now = new Date();
                        age = now.getFullYear() - birth.getFullYear();
                        const m = now.getMonth() - birth.getMonth();
                        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
                      }

                      return (
                        <button
                          key={ri}
                          onClick={() => onSelectRegistration(reg, racer)}
                          className="w-full text-left px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-300 hover:shadow-md transition group"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-black shadow-sm shadow-red-500/30 flex-shrink-0">
                              #{ri + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-900 truncate">
                                    {racer.thFirstName} {racer.thLastName}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {racer.enFirstName} {racer.enLastName}
                                  </p>
                                </div>
                                <span className="text-[10px] text-red-600 font-bold opacity-0 group-hover:opacity-100 transition flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                                  ดู QR <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>

                              {/* meta line: เพศ · อายุ · จำนวน */}
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                                <span className="inline-flex items-center gap-0.5">
                                  {racer.gender === 'M' ? '👦 ชาย' : racer.gender === 'F' ? '👧 หญิง' : '—'}
                                </span>
                                {age !== null && (
                                  <>
                                    <span className="text-slate-300">·</span>
                                    <span>{age} ปี</span>
                                  </>
                                )}
                                <span className="text-slate-300">·</span>
                                <span>{[...dateLabels].length} วัน</span>
                                <span className="text-slate-300">·</span>
                                <span>{uniqTiers.length} รุ่น</span>
                              </div>

                              {/* tier + date tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {uniqTiers.map((label, ti) => (
                                  <span key={'t' + ti} className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] font-bold">
                                    รุ่น {label}
                                  </span>
                                ))}
                                {[...dateLabels].map((label, di) => (
                                  <span key={'d' + di} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                                    <Calendar className="w-2.5 h-2.5" strokeWidth={2} />
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// QR CODE MODAL
// ============================================================
function QRModal({ open, onClose, registration, racer }) {
  if (!racer) return null;

  // จัดกลุ่ม รายการแข่งตาม date + tier
  const racerItems = [];
  for (const did of racer.selectedDates || []) {
    const dateObj = RACE_DATES.find(d => d.id === did);
    for (const tid of (racer.selectedRaces?.[did] || [])) {
      const t = RACE_TIERS.find(x => x.id === tid);
      if (dateObj && t) racerItems.push({ date: dateObj, tier: t });
    }
  }

  // คำนวณอายุจาก birthDate ถ้ามี
  const calcAge = () => {
    if (!racer.birthDate) return null;
    const birth = new Date(racer.birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    return m < 0 || (m === 0 && now.getDate() < birth.getDate()) ? years - 1 : years;
  };
  const age = calcAge();
  const racerNo = String(racer.id || '').slice(-6).padStart(6, '0');

  return (
    <Modal open={open} onClose={onClose} title="บัตรนักแข่ง">
      <div>
        {/* บัตรนักแข่ง — racing-pass style */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white mb-4 shadow-xl">
          {/* decoration */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative p-5">
            {/* Header: GPRC badge + racer number */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/40">
                  <Trophy className="w-5 h-5 text-white" strokeWidth={2.25} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-red-300 uppercase tracking-widest leading-none">Grandprix Runbike</p>
                  <p className="text-[10px] font-bold text-white/80 leading-tight mt-0.5">CHAMPIONSHIP 2026</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/50 uppercase tracking-wider leading-none">เลขนักแข่ง</p>
                <p className="font-mono text-base font-black tracking-wider text-red-300 mt-0.5">#{racerNo}</p>
              </div>
            </div>

            {/* ชื่อ-นามสกุล */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">ชื่อ-นามสกุล</p>
              <h3 className="text-2xl font-black tracking-tight leading-tight">
                {racer.thFirstName} {racer.thLastName}
              </h3>
              <p className="text-sm text-white/60 mt-0.5">
                {racer.enFirstName} {racer.enLastName}
              </p>
            </div>

            {/* meta grid: เพศ · อายุ · ผู้สมัคร */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-wider">เพศ</p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {racer.gender === 'M' ? 'ชาย' : racer.gender === 'F' ? 'หญิง' : '—'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-wider">อายุ</p>
                <p className="text-sm font-bold text-white mt-0.5">{age !== null ? `${age} ปี` : '—'}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-wider">รายการ</p>
                <p className="text-sm font-bold text-white mt-0.5">{racerItems.length} รุ่น</p>
              </div>
            </div>
          </div>

          {/* QR section — separator + light bg */}
          <div className="bg-white px-5 pt-4 pb-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">QR Code ลงทะเบียน</p>
                <p className="font-mono text-xs font-bold text-red-600 mt-0.5">{registration.refId}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold">
                <Check className="w-3 h-3" strokeWidth={3} />
                ยืนยันแล้ว
              </span>
            </div>
            <div className="w-44 h-44 mx-auto bg-white border-2 border-slate-200 rounded-xl p-2 shadow-md">
              <QRPattern />
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-3">📌 แสดง QR นี้ต่อเจ้าหน้าที่ในวันแข่งขัน</p>
          </div>
        </div>

        {/* รายการแข่ง — detailed */}
        {racerItems.length > 0 && (
          <div className="rounded-xl border-2 border-slate-200 overflow-hidden mb-4">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-red-600" strokeWidth={2.5} />
                รายการที่ลงแข่ง ({racerItems.length})
              </p>
              <span className="text-[10px] text-slate-500">มิถุนายน 2569</span>
            </div>
            <div className="divide-y divide-slate-100">
              {racerItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-bold text-red-600 leading-none">{item.date.short?.split(' ')[1] || 'มิ.ย.'}</span>
                    <span className="text-base font-black text-red-700 leading-none">{item.date.short?.split(' ')[0] || ''}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      รุ่น {item.tier.label}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.date.day} · {item.tier.desc || item.tier.ageRange || ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-mono flex-shrink-0">
                    {fmt(item.tier.price || 0)} ฿
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={onClose} variant="secondary" className="w-full">ปิด</Button>
      </div>
    </Modal>
  );
}

// ============================================================
// ADMIN — LOGIN MODAL
// ============================================================
function AdminLoginModal({ open, onClose, onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');

  useEffect(() => { if (open) { setForm({ username: '', password: '' }); setErr(''); } }, [open]);

  const submit = () => {
    if (!form.username || !form.password) return setErr('กรุณากรอกข้อมูลให้ครบ');
    onLogin({ username: form.username, role: 'admin' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="เข้าสู่ระบบผู้ดูแล">
      <div className="space-y-3">
        <div className="rounded-lg bg-slate-900 text-white p-3 flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="text-xs">
            <p className="font-bold">Admin Console</p>
            <p className="text-white/60">สำหรับเจ้าหน้าที่ดูแลระบบเท่านั้น</p>
          </div>
        </div>
        <div>
          <Label required>ชื่อผู้ใช้</Label>
          <Input icon={User} placeholder="admin" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        </div>
        <div>
          <Label required>รหัสผ่าน</Label>
          <Input icon={Lock} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        {err && <Alert>{err}</Alert>}
        <Button onClick={submit} className="w-full">
          เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-[11px] text-slate-400 text-center">💡 Demo: ใส่อะไรก็เข้าได้</p>
      </div>
    </Modal>
  );
}

// ============================================================
// ADMIN — NAVBAR
// ============================================================
function AdminNavbar({ adminView, onNavigate, admin, onLogout }) {
  const items = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: Tag },
    { id: 'admin-checkin', label: 'Check-in หน้างาน', icon: Flag },
  ];
  return (
    <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={GRANDPRIX_LOGO} alt="Grandprix" className="h-8 w-auto" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xs text-white/50">Admin Console</span>
              <span className="text-sm font-bold">Runbike 2026</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {items.map(it => {
              const Icon = it.icon;
              return (
                <button
                  key={it.id}
                  onClick={() => onNavigate(it.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition inline-flex items-center gap-1.5 ${
                    adminView === it.id ? 'bg-red-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-bold flex items-center justify-center">
              {(admin?.username || 'A')[0].toUpperCase()}
            </div>
            <span className="text-xs font-medium text-white max-w-[100px] truncate">{admin?.username}</span>
            <span className="text-[9px] font-bold text-red-300 uppercase tracking-wider bg-red-500/20 px-1.5 py-0.5 rounded">ADMIN</span>
          </div>
          <button onClick={onLogout} className="px-3 h-9 text-sm font-medium text-white/70 hover:text-white transition">ออกจากระบบ</button>
        </div>
      </div>
      <div className="md:hidden border-t border-slate-800 flex">
        {items.map(it => {
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => onNavigate(it.id)}
              className={`flex-1 py-3 text-xs font-medium inline-flex items-center justify-center gap-1.5 ${
                adminView === it.id ? 'text-white border-b-2 border-red-500' : 'text-white/60'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {it.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================
// ADMIN — DASHBOARD
// ============================================================
function AdminDashboard({ registrations, checkIns, onNavigate }) {
  const [selectedEventId, setSelectedEventId] = useState('all'); // 'all' | event.id
  const [detailReg, setDetailReg] = useState(null); // registration ที่กำลังดู detail

  // กรอง registrations ตาม event ที่เลือก
  const filteredRegs = useMemo(() => {
    if (selectedEventId === 'all') return registrations;
    return registrations.filter(r => r.eventId === selectedEventId);
  }, [registrations, selectedEventId]);

  const filteredCheckIns = useMemo(() => {
    if (selectedEventId === 'all') return checkIns;
    return checkIns.filter(c => c.eventId === selectedEventId);
  }, [checkIns, selectedEventId]);

  // KPIs (ใช้ filtered data)
  const totalRegs = filteredRegs.length;
  const totalRacers = filteredRegs.reduce((s, r) => s + r.racers.length, 0);
  const totalRevenue = filteredRegs.reduce((s, r) => s + (r.total || 0), 0);
  const checkInCount = filteredCheckIns.length;
  const checkInRate = totalRacers > 0 ? Math.round((checkInCount / totalRacers) * 100) : 0;

  // Event stats สำหรับ sidebar (เสมอใช้ all data)
  const eventStats = EVENTS.map(evt => {
    const regsForEvent = registrations.filter(r => r.eventId === evt.id);
    const racersForEvent = regsForEvent.reduce((s, r) => s + r.racers.length, 0);
    const checkInsForEvent = checkIns.filter(c => c.eventId === evt.id).length;
    return { ...evt, regsCount: regsForEvent.length, racersCount: racersForEvent, checkInsCount: checkInsForEvent };
  });

  const currentEvent = EVENTS.find(e => e.id === selectedEventId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5">
        <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">ภาพรวมระบบ</p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">สรุปข้อมูลการลงทะเบียน · อัปเดตเรียลไทม์</p>
      </div>

      {/* Event tabs */}
      <div className="mb-5 -mx-1 px-1 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <EventTab
            active={selectedEventId === 'all'}
            onClick={() => setSelectedEventId('all')}
            label="All Events"
            sublabel={`${registrations.length} รายการ`}
            count={registrations.reduce((s, r) => s + r.racers.length, 0)}
          />
          {eventStats.map(evt => (
            <EventTab
              key={evt.id}
              active={selectedEventId === evt.id}
              onClick={() => setSelectedEventId(evt.id)}
              label={evt.id === 'evt1' ? 'RUN BIKE' : 'GPRC 2026'}
              sublabel={`${evt.regsCount} รายการ`}
              count={evt.racersCount}
              isFeatured={evt.id === 'evt2'}
            />
          ))}
        </div>
      </div>

      {/* Event header banner เฉพาะตอนเลือก event ใดอันหนึ่ง */}
      {currentEvent && (
        <div className="mb-5 rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-red-950 text-white relative shadow-md">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 p-4 sm:p-5 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/20 flex-shrink-0 bg-slate-800">
              <img src={currentEvent.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest leading-none mb-1.5">{currentEvent.subtitle}</p>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight truncate">{currentEvent.title}</h2>
              <p className="text-xs text-white/60 mt-1 flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{currentEvent.dateRange}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{currentEvent.venue}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label="การลงทะเบียน" value={totalRegs} unit="รายการ" icon={Tag} trend="+12%" color="from-blue-500 to-blue-700" />
        <KpiCard label="จำนวนนักแข่ง" value={totalRacers} unit="คน" icon={User} trend="+8%" color="from-red-500 to-red-700" />
        <KpiCard label="รายได้รวม" value={fmt(totalRevenue)} unit="บาท" icon={CreditCard} trend="+15%" color="from-green-500 to-green-700" />
        <KpiCard label="เช็คอินแล้ว" value={checkInCount} unit={`${checkInRate}%`} icon={Check} trend={`${checkInRate}%`} color="from-amber-500 to-amber-700" trendIsRate />
      </div>

      {/* Registration table — full width */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-5">
        <RegistrationsTable
          registrations={filteredRegs}
          checkIns={checkIns}
          eventLabel={selectedEventId === 'all' ? null : (currentEvent ? (currentEvent.id === 'evt1' ? 'RUN BIKE' : 'GPRC 2026') : null)}
        />
      </div>

      {/* Sidebar bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">แยกตาม Event</h2>
          </div>
          <div className="p-4 space-y-3">
            {eventStats.map(evt => {
              const pct = Math.round((evt.racersCount / evt.capacity) * 100);
              const checkInPct = evt.racersCount > 0 ? Math.round((evt.checkInsCount / evt.racersCount) * 100) : 0;
              const isActive = selectedEventId === evt.id;
              return (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEventId(isActive ? 'all' : evt.id)}
                  className={`w-full text-left rounded-lg p-2 -m-2 transition ${isActive ? 'bg-red-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={`text-xs font-bold truncate flex-1 ${isActive ? 'text-red-700' : 'text-slate-900'}`}>{evt.title}</p>
                    <span className="text-xs font-mono font-bold text-slate-900 ml-2">{evt.racersCount}/{evt.capacity}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {evt.regsCount} การลงทะเบียน · เช็คอิน {evt.checkInsCount}/{evt.racersCount} ({checkInPct}%)
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onNavigate('admin-checkin')}
          className="w-full rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-red-950 text-white text-left hover:shadow-xl transition-all group overflow-hidden relative"
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <Flag className="w-6 h-6 text-red-300 mb-2" strokeWidth={2} />
            <p className="text-xs font-bold text-red-300 uppercase tracking-widest mb-1">เริ่มงาน</p>
            <p className="text-lg font-black tracking-tight mb-1">Check-in หน้างาน</p>
            <p className="text-xs text-white/60">สแกน QR Code เพื่อบันทึกการเข้าร่วม</p>
            <p className="inline-flex items-center gap-1 text-xs font-bold text-white mt-3 group-hover:gap-2 transition-all">
              ไปยังหน้า Check-in <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

// EventTab pill — เลือก event ใน Dashboard
function EventTab({ active, onClick, label, sublabel, count, isFeatured }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-700 text-white shadow-md shadow-red-600/30'
          : 'bg-white border-slate-200 text-slate-700 hover:border-red-200 hover:shadow-sm'
      }`}
    >
      <div className="text-left">
        <p className={`text-xs font-bold leading-none ${active ? 'text-white' : 'text-slate-900'}`}>{label}</p>
        <p className={`text-[10px] mt-0.5 leading-none ${active ? 'text-red-100' : 'text-slate-500'}`}>{sublabel}</p>
      </div>
      <span className={`inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md text-[11px] font-black ${
        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-900'
      }`}>
        {count}
      </span>
      {isFeatured && !active && (
        <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
      )}
    </button>
  );
}

// Registration detail modal — แสดงข้อมูลครบของการลงทะเบียน
// ============================================================
// REGISTRATIONS TABLE — table view ของ registrations (flatten by racer)
// ============================================================
function RegistrationsTable({ registrations, checkIns, eventLabel }) {
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // flatten registrations → 1 row per racer
  const rows = useMemo(() => {
    const out = [];
    registrations.forEach(reg => {
      reg.racers.forEach(racer => {
        let age = null;
        if (racer.birthDate) {
          const birth = new Date(racer.birthDate);
          const now = new Date();
          age = now.getFullYear() - birth.getFullYear();
          const m = now.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        }
        const mainTiers = [];
        const additionalTiers = [];
        const raceDays = []; // วันที่ลงแข่ง (short labels)
        (racer.selectedDates || []).forEach(did => {
          const dateObj = RACE_DATES.find(d => d.id === did);
          if (dateObj && !raceDays.includes(dateObj.short)) raceDays.push(dateObj.short);
          (racer.selectedRaces?.[did] || []).forEach(tid => {
            const t = RACE_TIERS.find(x => x.id === tid);
            if (!t) return;
            if (t.group === 'standard') {
              if (!mainTiers.includes(t.label)) mainTiers.push(t.label);
            } else {
              if (!additionalTiers.includes(t.label)) additionalTiers.push(t.label);
            }
          });
        });
        const isCheckedIn = checkIns.some(c => c.refId === reg.refId && c.racerId === racer.id);
        const checkInRecord = checkIns.find(c => c.refId === reg.refId && c.racerId === racer.id);

        out.push({
          regId: reg.id, refId: reg.refId, date: reg.date,
          dateRaw: reg.dateRaw || reg.date,
          eventId: reg.eventId,
          racerId: racer.id,
          fullName: `${racer.thFirstName} ${racer.thLastName}`,
          nickname: racer.nickname || '-',
          gender: racer.gender, age, birthDate: racer.birthDate,
          raceDays, // array ของ short labels เช่น ['1 มิ.ย.', '2 มิ.ย.']
          mainTiers: mainTiers.length > 0 ? mainTiers.join(', ') : '-',
          additionalTiers: additionalTiers.length > 0 ? additionalTiers.join(', ') : '-',
          isCheckedIn, checkInTime: checkInRecord?.time,
          shirtSize: racer.shirtSize, country: racer.country, teamName: racer.teamName,
        });
      });
    });
    return out;
  }, [registrations, checkIns]);

  const filteredRows = useMemo(() => {
    let result = [...rows];
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(r =>
        r.fullName.toLowerCase().includes(q) ||
        r.nickname.toLowerCase().includes(q) ||
        r.refId.toLowerCase().includes(q)
      );
    }
    if (filterGender !== 'all') result = result.filter(r => r.gender === filterGender);
    if (filterStatus === 'checked') result = result.filter(r => r.isCheckedIn);
    else if (filterStatus === 'pending') result = result.filter(r => !r.isCheckedIn);
    if (filterAge !== 'all') {
      const ageRanges = {
        'u5': (a) => a !== null && a < 5,
        '5-8': (a) => a !== null && a >= 5 && a < 8,
        '8-12': (a) => a !== null && a >= 8 && a < 12,
        '12+': (a) => a !== null && a >= 12,
      };
      const fn = ageRanges[filterAge];
      if (fn) result = result.filter(r => fn(r.age));
    }
    if (sortBy === 'date-desc') result.sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw));
    else if (sortBy === 'date-asc') result.sort((a, b) => new Date(a.dateRaw) - new Date(b.dateRaw));
    else if (sortBy === 'name') result.sort((a, b) => a.fullName.localeCompare(b.fullName, 'th'));
    return result;
  }, [rows, search, filterGender, filterStatus, filterAge, sortBy]);

  const exportExcel = () => {
    if (typeof window.XLSX === 'undefined') {
      alert('ระบบ Export กำลังโหลด กรุณาลองใหม่อีกครั้ง');
      return;
    }
    const exportRows = filteredRows.map((r, i) => ({
      'ลำดับ': i + 1,
      'วันที่ลงทะเบียน': r.date,
      'เลขอ้างอิง': r.refId,
      'ชื่อ-นามสกุล': r.fullName,
      'ชื่อเล่น': r.nickname,
      'เพศ': r.gender === 'M' ? 'ชาย' : r.gender === 'F' ? 'หญิง' : '-',
      'อายุ': r.age !== null ? r.age + ' ปี' : '-',
      'วันที่ลงแข่ง': r.raceDays.length > 0 ? r.raceDays.join(', ') : '-',
      'รุ่นที่แข่ง (หลัก)': r.mainTiers,
      'รุ่นที่แข่ง (เพิ่ม)': r.additionalTiers,
      'สถานะเช็คอิน': r.isCheckedIn ? `เช็คอินแล้ว ${r.checkInTime || ''}` : 'รอเช็คอิน',
      'Event': r.eventId === 'evt1' ? 'RUN BIKE' : 'GPRC 2026',
      'ไซส์เสื้อ': r.shirtSize || '-',
      'ประเทศ': r.country || '-',
      'ทีม': r.teamName || '-',
    }));
    const ws = window.XLSX.utils.json_to_sheet(exportRows);
    ws['!cols'] = [
      { wch: 6 }, { wch: 18 }, { wch: 14 }, { wch: 25 }, { wch: 14 },
      { wch: 8 }, { wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 },
      { wch: 14 }, { wch: 10 }, { wch: 8 }, { wch: 22 },
    ];
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, 'การลงทะเบียน');
    const dateStr = new Date().toISOString().slice(0, 10);
    window.XLSX.writeFile(wb, `registrations-${dateStr}.xlsx`);
  };

  const checkedCount = filteredRows.filter(r => r.isCheckedIn).length;

  return (
    <>
      <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              ตารางการลงทะเบียน
              {eventLabel && <span className="ml-2 text-xs text-slate-500 font-normal">— {eventLabel}</span>}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              พบ <span className="font-bold text-slate-900">{filteredRows.length}</span> รายการ ·
              เช็คอินแล้ว <span className="font-bold text-green-700">{checkedCount}</span> ·
              รอเช็คอิน <span className="font-bold text-amber-700">{filteredRows.length - checkedCount}</span>
            </p>
          </div>
          <button
            onClick={exportExcel}
            disabled={filteredRows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export Excel
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="col-span-2 sm:col-span-2">
            <Input
              placeholder="🔍 ค้นหาชื่อ / ชื่อเล่น / เลขอ้างอิง"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="h-10 px-2 text-sm rounded-md border border-slate-200 bg-white">
            <option value="all">ทุกเพศ</option>
            <option value="M">ชาย</option>
            <option value="F">หญิง</option>
          </select>
          <select value={filterAge} onChange={e => setFilterAge(e.target.value)} className="h-10 px-2 text-sm rounded-md border border-slate-200 bg-white">
            <option value="all">ทุกอายุ</option>
            <option value="u5">น้อยกว่า 5 ปี</option>
            <option value="5-8">5 - 7 ปี</option>
            <option value="8-12">8 - 11 ปี</option>
            <option value="12+">12 ปีขึ้นไป</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-10 px-2 text-sm rounded-md border border-slate-200 bg-white">
            <option value="all">ทุกสถานะ</option>
            <option value="checked">เช็คอินแล้ว</option>
            <option value="pending">รอเช็คอิน</option>
          </select>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-[11px] text-slate-500">เรียง:</span>
          <div className="flex gap-1 p-0.5 bg-slate-100 rounded-md">
            {[
              { id: 'date-desc', label: 'ล่าสุด' },
              { id: 'date-asc', label: 'เก่าสุด' },
              { id: 'name', label: 'ชื่อ A-Z' },
            ].map(s => (
              <button key={s.id} onClick={() => setSortBy(s.id)} className={`px-2.5 h-6 text-[11px] font-medium rounded transition ${
                sortBy === s.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredRows.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">วันที่</th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">เลขอ้างอิง</th>
                <th className="px-3 py-2.5 text-left">ชื่อ-นามสกุล</th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">ชื่อเล่น</th>
                <th className="px-3 py-2.5 text-center whitespace-nowrap">เพศ</th>
                <th className="px-3 py-2.5 text-center whitespace-nowrap">อายุ</th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">วันที่ลงแข่ง</th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">รุ่นหลัก</th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">รุ่นเพิ่ม</th>
                <th className="px-3 py-2.5 text-center whitespace-nowrap">เช็คอิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.slice(0, 100).map(r => {
                const ev = EVENTS.find(e => e.id === r.eventId);
                return (
                  <tr key={`${r.regId}-${r.racerId}`} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-2.5 whitespace-nowrap text-[11px] text-slate-600">{r.date}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-slate-900">{r.refId}</span>
                        {ev && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            ev.id === 'evt1' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {ev.id === 'evt1' ? 'RUN' : 'GPRC'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{r.fullName}</p>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">{r.nickname}</td>
                    <td className="px-3 py-2.5 text-center text-xs">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.gender === 'M' ? 'bg-blue-50 text-blue-700' : r.gender === 'F' ? 'bg-pink-50 text-pink-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {r.gender === 'M' ? 'ชาย' : r.gender === 'F' ? 'หญิง' : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs font-bold text-slate-900 whitespace-nowrap">{r.age !== null ? `${r.age} ปี` : '-'}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {r.raceDays.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.raceDays.map((d, di) => (
                            <span key={di} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] font-bold">
                        {r.mainTiers}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {r.additionalTiers !== '-' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold">
                          {r.additionalTiers}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                      {r.isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                          {r.checkInTime}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          รอเช็คอิน
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {filteredRows.length > 100 && (
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            แสดง 100 รายการแรกจาก {filteredRows.length} รายการ · กด Export Excel เพื่อดูทั้งหมด
          </div>
        )}
      </div>
    </>
  );
}

function RegistrationDetailModal({ open, onClose, registration, checkIns }) {
  if (!registration) return null;
  const ev = EVENTS.find(e => e.id === registration.eventId);
  const regCheckIns = checkIns.filter(c => c.refId === registration.refId);

  return (
    <Modal open={open} onClose={onClose} title="รายละเอียดการลงทะเบียน">
      <div className="space-y-4">
        {/* Header: ref + event + total */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-red-950 text-white p-4 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest leading-none">เลขอ้างอิง</p>
                <p className="font-mono text-lg font-black tracking-wider mt-0.5">{registration.refId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest leading-none">ยอดชำระ</p>
                <p className="text-xl font-black tracking-tight mt-0.5">{fmt(registration.total)} <span className="text-xs font-normal">฿</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/10 flex-wrap">
              {ev && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold">
                  <Flag className="w-2.5 h-2.5" strokeWidth={2.5} />
                  {ev.title}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white/80 text-[10px]">
                <Calendar className="w-2.5 h-2.5" strokeWidth={2} />
                ลงทะเบียน {registration.date}
              </span>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-slate-200 p-3 text-center">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-none">นักแข่ง</p>
            <p className="text-xl font-black text-slate-900 mt-1 leading-none">{registration.racers.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 text-center">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-none">รายการ</p>
            <p className="text-xl font-black text-slate-900 mt-1 leading-none">{registration.totalItems}</p>
          </div>
          <div className={`rounded-lg border-2 p-3 text-center ${regCheckIns.length > 0 ? 'border-green-300 bg-green-50' : 'border-slate-200'}`}>
            <p className={`text-[9px] font-bold uppercase tracking-wide leading-none ${regCheckIns.length > 0 ? 'text-green-700' : 'text-slate-500'}`}>เช็คอิน</p>
            <p className={`text-xl font-black mt-1 leading-none ${regCheckIns.length > 0 ? 'text-green-700' : 'text-slate-400'}`}>
              {regCheckIns.length}/{registration.racers.length}
            </p>
          </div>
        </div>

        {/* Racers list — แสดงข้อมูลครบของแต่ละคน */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" strokeWidth={2} />
            รายชื่อนักแข่ง ({registration.racers.length})
          </p>
          <div className="space-y-2">
            {registration.racers.map((racer, ri) => {
              const checkedIn = regCheckIns.some(c => c.racerId === racer.id);
              const checkInRecord = regCheckIns.find(c => c.racerId === racer.id);

              // คำนวณอายุ
              let age = null;
              if (racer.birthDate) {
                const birth = new Date(racer.birthDate);
                const now = new Date();
                age = now.getFullYear() - birth.getFullYear();
                const m = now.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
              }

              // กรุ๊ป tiers + dates
              const items = [];
              for (const did of racer.selectedDates || []) {
                const dateObj = RACE_DATES.find(d => d.id === did);
                for (const tid of (racer.selectedRaces?.[did] || [])) {
                  const t = RACE_TIERS.find(x => x.id === tid);
                  if (dateObj && t) items.push({ date: dateObj, tier: t });
                }
              }

              return (
                <div key={ri} className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden">
                  <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-white text-[10px] font-black shadow-sm shadow-red-500/30 flex-shrink-0">
                        #{ri + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                          {racer.thFirstName} {racer.thLastName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate leading-tight">
                          {racer.enFirstName} {racer.enLastName}
                        </p>
                      </div>
                    </div>
                    {checkedIn ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold">
                        <Check className="w-3 h-3" strokeWidth={3} />
                        เช็คอิน {checkInRecord?.time}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                        รอเช็คอิน
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    {/* meta */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2 flex-wrap">
                      <span>{racer.gender === 'M' ? '👦 ชาย' : racer.gender === 'F' ? '👧 หญิง' : '—'}</span>
                      {age !== null && (<><span className="text-slate-300">·</span><span>{age} ปี</span></>)}
                      <span className="text-slate-300">·</span>
                      <span>{items.length} รายการแข่ง</span>
                    </div>
                    {/* race items table */}
                    {items.length > 0 && (
                      <div className="rounded-lg bg-slate-50 divide-y divide-white">
                        {items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-2">
                            <div className="flex-shrink-0 w-9 h-9 rounded-md bg-white border border-red-200 flex flex-col items-center justify-center">
                              <span className="text-[8px] font-bold text-red-600 leading-none">{item.date.short?.split(' ')[1] || 'มิ.ย.'}</span>
                              <span className="text-sm font-black text-red-700 leading-none">{item.date.short?.split(' ')[0] || ''}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">รุ่น {item.tier.label}</p>
                              <p className="text-[10px] text-slate-500 truncate">{item.date.day}</p>
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 font-mono flex-shrink-0">{fmt(item.tier.price || 0)} ฿</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full">ปิด</Button>
      </div>
    </Modal>
  );
}

function KpiCard({ label, value, unit, icon: Icon, trend, color, trendIsRate }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            trendIsRate ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
      <p className="text-[10px] text-slate-500 mt-1">{unit}</p>
    </div>
  );
}

// ============================================================
// ADMIN — CHECK-IN PAGE
// ============================================================
function AdminCheckInPage({ registrations, checkIns, onCheckIn }) {
  const [scanInput, setScanInput] = useState('');
  const [foundRacer, setFoundRacer] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState(checkIns);
  const [eventFilter, setEventFilter] = useState('all');
  const [racerFilter, setRacerFilter] = useState('all');
  const [racerSearch, setRacerSearch] = useState('');
  const [activeTab, setActiveTab] = useState('scan'); // scan | list

  useEffect(() => { setRecentCheckIns(checkIns); }, [checkIns]);

  const handleScan = (input) => {
    const q = (input || scanInput).trim();
    if (!q) { setError('กรุณาสแกน QR หรือใส่เลขอ้างอิง'); setFoundRacer(null); return; }
    setError('');
    setScanning(true);

    setTimeout(() => {
      let found = null;
      for (const reg of registrations) {
        if (reg.refId.toLowerCase() === q.toLowerCase()) {
          found = { reg, racer: reg.racers[0] };
          break;
        }
        const racer = reg.racers.find(r =>
          (r.thFirstName + ' ' + r.thLastName).includes(q) ||
          (r.enFirstName + ' ' + r.enLastName).toLowerCase().includes(q.toLowerCase()) ||
          String(r.id) === q
        );
        if (racer) { found = { reg, racer }; break; }
      }
      setScanning(false);
      if (found) {
        const alreadyCheckedIn = recentCheckIns.some(c => c.refId === found.reg.refId && c.racerId === found.racer.id);
        setFoundRacer({ ...found, alreadyCheckedIn });
        setError('');
      } else {
        setFoundRacer(null);
        setError('ไม่พบข้อมูลในระบบ — ตรวจสอบเลขอ้างอิงหรือชื่ออีกครั้ง');
      }
    }, 400);
  };

  const confirmCheckIn = () => {
    if (!foundRacer || foundRacer.alreadyCheckedIn) return;
    const checkInRecord = {
      id: Date.now(),
      refId: foundRacer.reg.refId,
      racerId: foundRacer.racer.id,
      racerName: `${foundRacer.racer.thFirstName} ${foundRacer.racer.thLastName}`,
      eventId: foundRacer.reg.eventId,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
    };
    onCheckIn(checkInRecord);
    setRecentCheckIns([checkInRecord, ...recentCheckIns]);
    setFoundRacer({ ...foundRacer, alreadyCheckedIn: true });
    setTimeout(() => {
      setScanInput('');
      setFoundRacer(null);
    }, 2000);
  };

  const quickFillSamples = registrations.flatMap(r => r.racers.map(racer => ({ refId: r.refId, name: `${racer.thFirstName} ${racer.thLastName}` }))).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5">
        <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">เริ่มงานหน้าสนาม</p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Check-in หน้างาน</h1>
        <p className="text-sm text-slate-500 mt-1">สแกน QR Code ของผู้แข่งเพื่อบันทึกการเข้าร่วม</p>
      </div>

      {/* Tabs */}
      <div className="mb-5 border-b border-slate-200 flex gap-1">
        <button
          onClick={() => setActiveTab('scan')}
          className={`relative px-4 py-2.5 text-sm font-bold transition flex items-center gap-1.5 ${
            activeTab === 'scan' ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Flag className="w-4 h-4" strokeWidth={2} />
          สแกน QR
          {activeTab === 'scan' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`relative px-4 py-2.5 text-sm font-bold transition flex items-center gap-1.5 ${
            activeTab === 'list' ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-4 h-4" strokeWidth={2} />
          ผู้สมัครทั้งหมด
          <span className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-md text-[10px] font-black ${
            activeTab === 'list' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {registrations.reduce((s, r) => s + r.racers.length, 0)}
          </span>
          {activeTab === 'list' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />}
        </button>
      </div>

      {activeTab === 'scan' && (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white border-2 border-slate-200 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-6 sm:inset-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-red-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-red-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-red-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-red-500 rounded-br-lg" />
              </div>
              {scanning && (
                <div className="absolute inset-x-10 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" style={{ animation: 'scanline 1s ease-in-out infinite', top: '50%' }} />
              )}
              <div className="text-center text-white relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-3">
                  <Flag className="w-10 h-10 text-red-400" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">{scanning ? 'กำลังสแกน...' : 'รอการสแกน'}</p>
                <p className="text-[11px] text-white/40 mt-1">เล็งกล้องไปที่ QR Code บนบัตรนักแข่ง</p>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <Label>หรือใส่เลขอ้างอิง / ชื่อผู้แข่งด้วยตนเอง</Label>
              <div className="flex gap-2">
                <Input
                  icon={Tag}
                  placeholder="เช่น REG-20260315 หรือ ภูริชญา"
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                />
                <Button onClick={() => handleScan()} disabled={scanning} className="flex-shrink-0">
                  {scanning ? 'กำลังค้นหา...' : 'ค้นหา'}
                  {!scanning && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>

              {quickFillSamples.length > 0 && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-medium">ทดสอบ:</span>
                  {quickFillSamples.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setScanInput(s.refId); handleScan(s.refId); }}
                      className="text-[10px] px-2 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 transition font-mono font-bold"
                    >
                      {s.refId}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-3">
                  <Alert>{error}</Alert>
                </div>
              )}
            </div>
          </div>

          {foundRacer && (
            <div className={`mt-4 rounded-2xl overflow-hidden border-2 ${foundRacer.alreadyCheckedIn ? 'border-amber-300' : 'border-green-300'} bg-white`}>
              <div className={`px-4 py-3 ${foundRacer.alreadyCheckedIn ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${foundRacer.alreadyCheckedIn ? 'bg-amber-600' : 'bg-green-600'} flex items-center justify-center`}>
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-sm font-black">
                      {foundRacer.alreadyCheckedIn ? 'นักแข่งเช็คอินแล้ว' : 'พบข้อมูลนักแข่ง'}
                    </p>
                    <p className="text-[11px]">
                      {foundRacer.alreadyCheckedIn ? 'ตรวจสอบรายการด้านล่าง' : 'ตรวจสอบและกดยืนยันการเช็คอิน'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">ชื่อนักแข่ง</p>
                    <p className="text-lg font-bold text-slate-900">{foundRacer.racer.thFirstName} {foundRacer.racer.thLastName}</p>
                    <p className="text-xs text-slate-500">{foundRacer.racer.enFirstName} {foundRacer.racer.enLastName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">เลขอ้างอิง</p>
                    <p className="text-lg font-mono font-bold text-red-600">{foundRacer.reg.refId}</p>
                    <p className="text-xs text-slate-500">ลงทะเบียน {foundRacer.reg.date}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">รายการแข่ง</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(foundRacer.racer.selectedDates || []).map(did => {
                      const dateObj = RACE_DATES.find(d => d.id === did);
                      const tiers = (foundRacer.racer.selectedRaces?.[did] || []).map(tid => {
                        const t = RACE_TIERS.find(x => x.id === tid);
                        return t?.label;
                      }).filter(Boolean);
                      return tiers.map((label, ti) => (
                        <span key={did + ti} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          <Calendar className="w-2.5 h-2.5" strokeWidth={2} />
                          {dateObj?.short} · รุ่น {label}
                        </span>
                      ));
                    })}
                  </div>
                </div>
                {!foundRacer.alreadyCheckedIn ? (
                  <Button onClick={confirmCheckIn} className="w-full">
                    <Check className="w-4 h-4" /> ยืนยันการเช็คอิน
                  </Button>
                ) : (
                  <div className="text-center text-xs text-amber-700 font-medium py-2">
                    ✓ นักแข่งคนนี้ได้เช็คอินไปแล้ว ไม่สามารถเช็คอินซ้ำได้
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden lg:sticky lg:top-24">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">เช็คอินล่าสุด</h2>
                <p className="text-[10px] text-slate-500">{recentCheckIns.length} รายการ</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            {recentCheckIns.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">ยังไม่มีการเช็คอิน</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {recentCheckIns.slice(0, 15).map(ci => (
                  <div key={ci.id} className="px-4 py-3 hover:bg-slate-50/50 transition">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-green-700" strokeWidth={3} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{ci.racerName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{ci.refId}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{ci.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {activeTab === 'list' && (
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" strokeWidth={2} />
                ผู้สมัครทั้งหมด
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">รายชื่อนักแข่งที่ลงทะเบียน · คลิกเพื่อเช็คอินด่วน</p>
            </div>
          </div>

          {/* Event filter tabs */}
          <div className="flex gap-2 flex-wrap mb-3">
            {(() => {
              const allRacers = registrations.flatMap(r => r.racers.map(racer => ({ racer, reg: r })));
              const allCount = allRacers.length;
              return (
                <button
                  onClick={() => setEventFilter('all')}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    eventFilter === 'all'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ทั้งหมด
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-black ${
                    eventFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white text-slate-900'
                  }`}>{allCount}</span>
                </button>
              );
            })()}
            {EVENTS.map(evt => {
              const racersForEvent = registrations
                .filter(r => r.eventId === evt.id)
                .reduce((s, r) => s + r.racers.length, 0);
              const isActive = eventFilter === evt.id;
              return (
                <button
                  key={evt.id}
                  onClick={() => setEventFilter(evt.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    isActive
                      ? 'bg-red-600 text-white shadow shadow-red-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {evt.id === 'evt1' ? 'RUN BIKE' : 'GPRC 2026'}
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-900'
                  }`}>{racersForEvent}</span>
                </button>
              );
            })}
          </div>

          {/* Status filter + search */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'pending', label: 'รอเช็คอิน' },
                { id: 'checked', label: 'เช็คอินแล้ว' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setRacerFilter(f.id)}
                  className={`px-3 h-7 text-[11px] font-semibold rounded-md transition ${
                    racerFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="ค้นหาชื่อนักแข่ง..."
                value={racerSearch}
                onChange={e => setRacerSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List */}
        {(() => {
          // คำนวณ flat list ของนักแข่งทั้งหมด + check status
          let allRacers = registrations.flatMap(r =>
            r.racers.map(racer => {
              const isCheckedIn = recentCheckIns.some(c => c.refId === r.refId && c.racerId === racer.id);
              const checkInRecord = recentCheckIns.find(c => c.refId === r.refId && c.racerId === racer.id);
              return { racer, reg: r, isCheckedIn, checkInRecord };
            })
          );

          // Filter by event
          if (eventFilter !== 'all') {
            allRacers = allRacers.filter(x => x.reg.eventId === eventFilter);
          }
          // Filter by status
          if (racerFilter === 'checked') allRacers = allRacers.filter(x => x.isCheckedIn);
          else if (racerFilter === 'pending') allRacers = allRacers.filter(x => !x.isCheckedIn);

          // Search
          const q = racerSearch.trim().toLowerCase();
          if (q) {
            allRacers = allRacers.filter(x => {
              const th = `${x.racer.thFirstName} ${x.racer.thLastName}`;
              const en = `${x.racer.enFirstName} ${x.racer.enLastName}`.toLowerCase();
              return th.includes(q) || en.includes(q) || x.reg.refId.toLowerCase().includes(q);
            });
          }

          // นับสรุป
          const totalCheckedIn = allRacers.filter(x => x.isCheckedIn).length;
          const totalPending = allRacers.length - totalCheckedIn;

          return (
            <>
              <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] flex-wrap gap-2">
                <span className="font-bold text-slate-700">
                  พบ <span className="text-red-600">{allRacers.length}</span> คน
                </span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    เช็คอินแล้ว {totalCheckedIn}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    รอเช็คอิน {totalPending}
                  </span>
                </div>
              </div>

              {allRacers.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">ไม่พบรายชื่อตามเงื่อนไขที่เลือก</div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {allRacers.map((x, idx) => {
                    const ev = EVENTS.find(e => e.id === x.reg.eventId);
                    let age = null;
                    if (x.racer.birthDate) {
                      const birth = new Date(x.racer.birthDate);
                      const now = new Date();
                      age = now.getFullYear() - birth.getFullYear();
                      const m = now.getMonth() - birth.getMonth();
                      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
                    }
                    const tierLabels = [];
                    for (const did of x.racer.selectedDates || []) {
                      for (const tid of (x.racer.selectedRaces?.[did] || [])) {
                        const t = RACE_TIERS.find(t => t.id === tid);
                        if (t) tierLabels.push(t.label);
                      }
                    }
                    return (
                      <button
                        key={x.reg.id + '-' + x.racer.id}
                        onClick={() => { setScanInput(x.reg.refId); handleScan(x.reg.refId); }}
                        className="w-full px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition group text-left"
                      >
                        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-white text-[10px] font-black shadow-sm flex-shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {x.racer.thFirstName} {x.racer.thLastName}
                            </p>
                            {ev && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-bold uppercase tracking-wider">
                                {ev.id === 'evt1' ? 'RUN BIKE' : 'GPRC'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">
                            <span className="font-mono">{x.reg.refId}</span>
                            <span className="text-slate-300 mx-1">·</span>
                            {x.racer.gender === 'M' ? '👦' : x.racer.gender === 'F' ? '👧' : ''} {age !== null ? `${age} ปี` : ''}
                            <span className="text-slate-300 mx-1">·</span>
                            {tierLabels.length > 0 && `รุ่น ${tierLabels.join(', ')}`}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {x.isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold">
                              <Check className="w-2.5 h-2.5" strokeWidth={3} />
                              <span className="hidden sm:inline">{x.checkInRecord?.time}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold group-hover:bg-red-50 group-hover:text-red-600 transition">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full group-hover:bg-red-500" />
                              รอเช็คอิน
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}
      </div>
      )}
    </div>
  );
}

// ============================================================
// APP — view routing + auth state
// ============================================================
function App() {
  // view: 'landing' | 'register' | 'history' | 'admin-dashboard' | 'admin-checkin'
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState('login');
  const [registrations, setRegistrations] = useState([]);
  const [savedRacers, setSavedRacers] = useState([]); // นักแข่งที่เซฟไว้ใน profile ของ user
  const [racerEditor, setRacerEditor] = useState({ open: false, racer: null }); // เปิด/ปิด modal เพิ่ม-แก้ไขนักแข่ง
  const [savedGuardian, setSavedGuardian] = useState(null); // ข้อมูลผู้ปกครองที่บันทึกไว้
  const [checkIns, setCheckIns] = useState([]);
  const [qrModal, setQrModal] = useState({ open: false, registration: null, racer: null });
  const [eventSelectOpen, setEventSelectOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openLogin = (mode = 'login') => {
    setLoginMode(mode);
    setLoginOpen(true);
  };

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    // โหลด mock registrations ถ้ายังไม่มี เพื่อให้ admin มีข้อมูลให้ดู
    if (registrations.length === 0) {
      // Helper สร้าง mock — กระจาย event, gender, age, รุ่น, สถานะเช็คอิน
      const firstNamesM = ['ธีรภัทร', 'อนุภัทร', 'กิตติพงษ์', 'ภานุวัฒน์', 'ปัณณวิชญ์', 'พีรพัฒน์', 'สรวิชญ์', 'ณภัทร', 'ชวินธร', 'รัชชานนท์'];
      const firstNamesF = ['ภูริชญา', 'นภัสสร', 'พิมพ์ลภัส', 'ปวริศา', 'ธัญชนก', 'กชกร', 'อนัญญา', 'พิชญาภา', 'ลภัสรดา', 'จิรชยา'];
      const lastNames = ['จันทร์เพ็ญ', 'วงศ์สว่าง', 'ศรีสุวรรณ', 'พรหมจรรย์', 'แก้วใส', 'ดวงดี', 'มั่นคง', 'รุ่งเรือง', 'กิจสำราญ', 'ไกรเกียรติ'];
      const nicknamesM = ['น้องเต้', 'น้องอนุ', 'น้องโตโน่', 'น้องภู', 'น้องปัณ', 'น้องพี', 'น้องวิช', 'น้องณ', 'น้องชิน', 'น้องนนท์'];
      const nicknamesF = ['น้องฟ้า', 'น้องนัส', 'น้องพิม', 'น้องมุก', 'น้องพลอย', 'น้องเอม', 'น้องมิ้น', 'น้องแพร', 'น้องลภัส', 'น้องจี'];
      const teams = ['Bangkok Runbike Club', 'Chiang Mai Speedy', 'Phuket Riders', 'Pattaya Junior Racing', 'Korat Speed Team', 'Hat Yai Champions', '', '', 'Lao Runners', 'Singapore Riders'];
      const enFirstM = ['Teerapat', 'Anupat', 'Kittipong', 'Phanuwat', 'Pannawit', 'Peeraphat', 'Sorawit', 'Naphat', 'Chawinthorn', 'Ratchanon'];
      const enFirstF = ['Phurichaya', 'Naphatsorn', 'Pimlapat', 'Pawarisa', 'Thanchanok', 'Kotchakorn', 'Ananya', 'Pitchayapa', 'Lapassarada', 'Jirachaya'];
      const enLast = ['Chanphen', 'Wongsawang', 'Srisuwan', 'Promchan', 'Kaewsai', 'Duangdee', 'Mankong', 'Rungrueang', 'Kitsamran', 'Kraikiat'];
      const sizes = ['XS', 'S', 'M', 'L', 'XL'];
      const countries = ['TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'LA', 'SG', 'MY']; // weight TH

      // ฟังก์ชันสุ่ม
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const pickIdx = (arr, i) => arr[i % arr.length];

      // กำหนด tier ตาม birthYear (ใช้ logic เดียวกับ getEligibleTiers)
      const tierByBirthYear = (y, gender) => {
        const now = new Date();
        const ageYears = now.getFullYear() - y;
        if (ageYears >= 3 && ageYears <= 4) return 'U1';
        if (ageYears >= 4 && ageYears <= 5) return 'U2';
        if (ageYears >= 5 && ageYears <= 6) return 'U3';
        if (ageYears >= 6 && ageYears <= 7) return 'U4';
        if (ageYears >= 7 && ageYears <= 10) return 'U5';
        if (ageYears >= 10 && ageYears <= 13) return 'U6';
        return 'U7';
      };

      // generate 20 registrations
      const mock = [];
      const allRacerIds = [];
      for (let i = 0; i < 20; i++) {
        const isMale = Math.random() > 0.45;
        const numRacers = Math.random() < 0.3 ? 2 : 1; // 30% มี 2 นักแข่ง
        const eventId = Math.random() > 0.4 ? 'evt2' : 'evt1';

        const regRacers = [];
        let regTotal = 0;
        let regTotalItems = 0;

        for (let j = 0; j < numRacers; j++) {
          const racerIsMale = j === 0 ? isMale : Math.random() > 0.5;
          const birthYear = 2014 + Math.floor(Math.random() * 9); // 2014-2022
          const birthMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
          const birthDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
          const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;
          const mainTier = tierByBirthYear(birthYear, racerIsMale ? 'male' : 'female');
          // 40% มีรุ่นเพิ่มเติม (Open)
          const hasOpen = Math.random() < 0.4;
          const openTier = hasOpen ? (racerIsMale ? pick(['OJ', 'OS', 'OP']) : pick(['GJ', 'GS', 'GP', 'OJ', 'OS', 'OP'])) : null;

          // จำนวนวันที่ลง (1-2 วัน)
          const numDays = Math.random() < 0.3 ? 2 : 1;
          const allDays = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
          const selectedDates = [];
          for (let k = 0; k < numDays; k++) {
            const day = pick(allDays);
            if (!selectedDates.includes(day)) selectedDates.push(day);
          }

          // กำหนดรุ่นต่อวัน
          const selectedRaces = {};
          selectedDates.forEach((day, dIdx) => {
            if (dIdx === 0) {
              // วันแรก: มีหลัก + อาจมีเพิ่ม
              selectedRaces[day] = openTier ? [mainTier, openTier] : [mainTier];
            } else {
              selectedRaces[day] = [mainTier];
            }
          });

          // คำนวณราคา rough
          const itemsCount = Object.values(selectedRaces).reduce((s, arr) => s + arr.length, 0);
          const racerPrice = itemsCount * 700; // rough

          const racerId = `R${String(allRacerIds.length + 1).padStart(3, '0')}`;
          allRacerIds.push(racerId);

          regRacers.push({
            id: racerId,
            thFirstName: racerIsMale ? pickIdx(firstNamesM, i + j) : pickIdx(firstNamesF, i + j),
            thLastName: pickIdx(lastNames, i + j),
            enFirstName: racerIsMale ? pickIdx(enFirstM, i + j) : pickIdx(enFirstF, i + j),
            enLastName: pickIdx(enLast, i + j),
            nickname: racerIsMale ? pickIdx(nicknamesM, i + j) : pickIdx(nicknamesF, i + j),
            gender: racerIsMale ? 'M' : 'F',
            birthDate,
            shirtSize: pick(sizes),
            country: pick(countries),
            teamName: pick(teams),
            selectedDates,
            selectedRaces,
          });
          regTotal += racerPrice;
          regTotalItems += itemsCount;
        }

        // วันที่ลงทะเบียน (ย้อนหลัง 1-60 วัน)
        const daysAgo = Math.floor(Math.random() * 60) + 1;
        const regDate = new Date(Date.now() - daysAgo * 86400000);
        const dateStr = regDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

        mock.push({
          id: Date.now() - i * 100000,
          refId: 'REG-' + String(20260100 + i).slice(0, 8),
          date: dateStr,
          dateRaw: regDate.toISOString(),
          eventId,
          racers: regRacers,
          totalItems: regTotalItems,
          total: regTotal,
        });
      }
      setRegistrations(mock);

      // mock check-ins — สุ่ม 30% เช็คอินแล้ว
      const mockCheckIns = [];
      mock.forEach(reg => {
        reg.racers.forEach(racer => {
          if (Math.random() < 0.3) {
            mockCheckIns.push({
              id: Date.now() + Math.random(),
              refId: reg.refId,
              racerId: racer.id,
              racerName: `${racer.thFirstName} ${racer.thLastName}`,
              eventId: reg.eventId,
              time: `${String(Math.floor(Math.random() * 5) + 7).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
              date: reg.date,
            });
          }
        });
      });
      setCheckIns(mockCheckIns);
    }
    setView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    setView('landing');
  };

  const handleCheckIn = (record) => {
    setCheckIns(prev => [record, ...prev]);
  };

  // Keyboard shortcut: Ctrl+Shift+Z เปิด admin login
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'Z' || e.key === 'z')) {
        e.preventDefault();
        if (!admin) setAdminLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [admin]);

  const handleLogin = (userData) => {
    setUser(userData);
    // เพิ่ม mock registrations เริ่มต้น ถ้ายังไม่มี เพื่อให้เห็นตัวอย่างทันที
    if (registrations.length === 0) {
      const mockRegistrations = [
        {
          id: Date.now() - 1000000,
          refId: 'REG-20260315',
          date: '15 มี.ค. 2569',
          racers: [
            {
              id: 'R001',
              thFirstName: 'ภูริชญา',
              thLastName: 'จันทร์เพ็ญ',
              enFirstName: 'Phurichaya',
              enLastName: 'Chanphen',
              nickname: 'น้องฟ้า',
              gender: 'F',
              birthDate: '2020-08-12',
              shirtSize: 'S',
              country: 'TH',
              teamName: 'Bangkok Runbike Club',
              selectedDates: ['D1', 'D3'],
              selectedRaces: { D1: ['U3'], D3: ['GS'] },
            },
            {
              id: 'R002',
              thFirstName: 'ธีรภัทร',
              thLastName: 'จันทร์เพ็ญ',
              enFirstName: 'Teerapat',
              enLastName: 'Chanphen',
              nickname: 'น้องเต้',
              gender: 'M',
              birthDate: '2022-03-25',
              shirtSize: 'XS',
              country: 'TH',
              teamName: 'Bangkok Runbike Club',
              selectedDates: ['D1', 'D2'],
              selectedRaces: { D1: ['U2'], D2: ['OJ'] },
            },
          ],
          totalItems: 4,
          total: 2800,
        },
        {
          id: Date.now() - 500000,
          refId: 'REG-20260420',
          date: '20 เม.ย. 2569',
          racers: [
            {
              id: 'R003',
              thFirstName: 'อนุภัทร',
              thLastName: 'วงศ์สว่าง',
              enFirstName: 'Anupat',
              enLastName: 'Wongsawang',
              nickname: 'น้องอนุ',
              gender: 'M',
              birthDate: '2018-11-30',
              shirtSize: 'M',
              country: 'TH',
              teamName: 'Chiang Mai Speedy',
              selectedDates: ['D5', 'D7'],
              selectedRaces: { D5: ['U5'], D7: ['OP'] },
            },
          ],
          totalItems: 2,
          total: 2000,
        },
      ];
      setRegistrations(mockRegistrations);
      // savedRacers: เอานักแข่งที่เคย register แล้วเก็บใน profile
      const uniqueRacers = new Map();
      mockRegistrations.forEach(reg => {
        reg.racers.forEach(racer => {
          if (!uniqueRacers.has(racer.id)) uniqueRacers.set(racer.id, racer);
        });
      });
      setSavedRacers(Array.from(uniqueRacers.values()));
      // mock guardian data
      setSavedGuardian({
        name: 'สมชาย จันทร์เพ็ญ',
        contactAddress: '123/45 หมู่ 6 ถ.สุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
        taxAddress: '123/45 หมู่ 6 ถ.สุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
        taxId: '1234567890123',
        phone: '081-234-5678',
        email: userData.email || 'somchai@example.com',
      });
    }
    setView('racers'); // เปลี่ยน default landing หลัง login → หน้า "นักแข่ง"
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const handleRegisterClick = (mode = null) => {
    if (mode === 'login') { openLogin('login'); return; }
    // landing — รับ event โดยตรง (event_id) หรือเปิด modal ถ้าไม่ได้ระบุ
    if (mode && typeof mode === 'object' && mode.id) {
      setSelectedEvent(mode);
      setView('register');
      return;
    }
    // ไม่ได้ระบุ event → เปิด event select modal
    setEventSelectOpen(true);
  };

  const handleSelectEvent = (evt) => {
    setSelectedEvent(evt);
    setEventSelectOpen(false);
    setView('register');
  };

  const handleRegistrationComplete = ({ racers, data }) => {
    const newReg = {
      id: Date.now(),
      refId: 'REG-' + Date.now().toString().slice(-8),
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      eventId: data.eventId || null,
      racers: racers,
      totalItems: racers.reduce((s, r) => s + Object.values(r.selectedRaces || {}).reduce((a, b) => a + b.length, 0), 0),
      total: data.finalTotal,
    };
    setRegistrations([newReg, ...registrations]);
    // Sync savedRacers — เพิ่มนักแข่งที่ใหม่ลงใน profile
    const existingIds = new Set(savedRacers.map(r => r.id));
    const newOnes = racers.filter(r => !existingIds.has(r.id));
    if (newOnes.length > 0) setSavedRacers([...savedRacers, ...newOnes]);
    setView('history');
  };

  // CRUD savedRacers
  const handleSaveRacer = (racer) => {
    if (racer.id && savedRacers.some(r => r.id === racer.id)) {
      // update
      setSavedRacers(savedRacers.map(r => r.id === racer.id ? racer : r));
    } else {
      // create
      setSavedRacers([...savedRacers, { ...racer, id: racer.id || (Date.now() + Math.random()) }]);
    }
    setRacerEditor({ open: false, racer: null });
  };
  const handleDeleteRacer = (racerId) => {
    setSavedRacers(savedRacers.filter(r => r.id !== racerId));
  };

  const isAdminView = view === 'admin-dashboard' || view === 'admin-checkin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Admin views มี navbar แยก */}
      {isAdminView && admin ? (
        <>
          <AdminNavbar
            adminView={view}
            onNavigate={setView}
            admin={admin}
            onLogout={handleAdminLogout}
          />
          <main>
            {view === 'admin-dashboard' && (
              <AdminDashboard
                registrations={registrations}
                checkIns={checkIns}
                onNavigate={setView}
              />
            )}
            {view === 'admin-checkin' && (
              <AdminCheckInPage
                registrations={registrations}
                checkIns={checkIns}
                onCheckIn={handleCheckIn}
              />
            )}
          </main>
        </>
      ) : (
        <div className="min-h-screen bg-white">
          <Navbar
            currentView={view}
            onNavigate={setView}
            user={user}
            onLogin={openLogin}
            onLogout={handleLogout}
            transparent={view === 'landing'}
            onAdminLogin={() => setAdminLoginOpen(true)}
          />

          <main className={view === 'landing' ? '' : 'pt-20'}>
            {view === 'landing' && (
              <LandingPage user={user} onRegisterClick={handleRegisterClick} />
            )}

            {view === 'register' && (
              <div className="relative min-h-[calc(100vh-4rem)]" style={{ backgroundColor: '#fef2f2' }}>
                <div
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    backgroundImage: `url(${BG_DATA_URL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 60%)',
                  }}
                  aria-hidden="true"
                />
                <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-8">
                  <RaceRegistration
                    onBackToHome={() => setView(user ? 'history' : 'landing')}
                    onComplete={handleRegistrationComplete}
                    startStep={user ? 2 : 1}
                    prefillUser={user}
                    selectedEvent={selectedEvent}
                    savedRacers={savedRacers}
                    savedGuardian={savedGuardian}
                  />
                </div>
              </div>
            )}

            {(view === 'history' || view === 'racers' || view === 'guardian') && user && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 lg:gap-6">
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <UserSidebar
                      currentView={view}
                      onNavigate={setView}
                      user={user}
                      racersCount={savedRacers.length}
                      regsCount={registrations.length}
                      hasGuardian={!!savedGuardian}
                    />
                  </div>
                  <div className="min-w-0">
                    {view === 'racers' && (
                      <MyRacersPage
                        racers={savedRacers}
                        onAdd={() => setRacerEditor({ open: true, racer: null })}
                        onEdit={(r) => setRacerEditor({ open: true, racer: r })}
                        onDelete={handleDeleteRacer}
                      />
                    )}
                    {view === 'guardian' && (
                      <GuardianPage
                        guardian={savedGuardian}
                        onSave={setSavedGuardian}
                      />
                    )}
                    {view === 'history' && (
                      <HistoryPage
                        user={user}
                        registrations={registrations}
                        onRegisterClick={() => setEventSelectOpen(true)}
                        onBackToHome={() => setView('landing')}
                        onSelectRegistration={(reg, racer) => setQrModal({ open: true, registration: reg, racer })}
                        embedded
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      <RacerEditorModal
        open={racerEditor.open}
        onClose={() => setRacerEditor({ open: false, racer: null })}
        racer={racerEditor.racer}
        onSave={handleSaveRacer}
      />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        defaultMode={loginMode}
      />

      <AdminLoginModal
        open={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />

      <EventSelectModal
        open={eventSelectOpen}
        onClose={() => setEventSelectOpen(false)}
        events={EVENTS}
        onSelectEvent={handleSelectEvent}
      />

      <QRModal
        open={qrModal.open}
        onClose={() => setQrModal({ open: false, registration: null, racer: null })}
        registration={qrModal.registration}
        racer={qrModal.racer}
      />
    </div>
  );
}

// ============================================================
// MAIN APP (multi-step registration flow)
// ============================================================
function RaceRegistration({ onBackToHome, onComplete, startStep = 1, prefillUser, selectedEvent, savedRacers = [], savedGuardian = null }) {
  const [step, setStep] = useState(startStep);
  const [data, setData] = useState({
    username: prefillUser?.username || '',
    email: prefillUser?.email || '',
    password: '', confirmPassword: '',
    phone: prefillUser?.phone || '',
    pdpa: !!prefillUser, rules: !!prefillUser,
    guardian: { name: '', address: '', email: '', phone: '' },
    couponCode: '', appliedCoupon: null,
    finalTotal: 0, subtotal: 0, discount: 0,
    eventId: selectedEvent?.id || null,
    eventTitle: selectedEvent?.title || null,
  });
  const [racers, setRacers] = useState([newRacer()]);

  const next = () => setStep(s => Math.min(s + 1, 6));
  const prev = () => setStep(s => Math.max(s - 1, startStep));
  const reset = () => {
    if (onComplete) {
      onComplete({ racers, data });
      return;
    }
    setStep(1);
  };

  return (
    <div className="relative">
      {/* Back to home button */}
      {onBackToHome && step <= 5 && (
        <button
          onClick={onBackToHome}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> กลับหน้าหลัก
        </button>
      )}

      {/* Event banner — แสดง event ที่เลือก */}
      {selectedEvent && step <= 5 && (
        <div className="mb-4 rounded-xl overflow-hidden border-2 border-red-200 bg-gradient-to-r from-slate-900 to-red-950 text-white relative">
          <div className="flex items-center gap-3 p-3 sm:p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 bg-slate-800">
              <img src={selectedEvent.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-red-300 uppercase tracking-widest leading-none mb-1">กำลังลงทะเบียน</p>
              <p className="text-sm sm:text-base font-black text-white tracking-tight truncate leading-tight">{selectedEvent.title}</p>
              <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5 flex items-center gap-1 truncate">
                <Calendar className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
                <span className="truncate">{selectedEvent.dateRange}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero banner — แสดงเฉพาะกรณี landing ไม่ login แล้วเริ่ม step 1 + ไม่มี selectedEvent */}
      {!selectedEvent && step === startStep && step === 1 && (
        <div className="mb-4 sm:mb-5 -mx-2 sm:mx-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl shadow-red-900/10">
          <img
            src={HERO_BANNER}
            alt="GRANDPRIX RUNBIKE CHAMPIONSHIP — เปิดรับสมัครแล้ว"
            className="w-full h-auto block"
          />
        </div>
      )}

      {step <= 5 && <ProgressBar current={step} />}

      {step === 1 && <StepAccount data={data} setData={setData} next={next} />}
      {step === 2 && <StepRacers racers={racers} setRacers={setRacers} savedRacers={savedRacers} next={next} prev={step > startStep ? prev : null} />}
      {step === 3 && <StepGuardian data={data} setData={setData} next={next} prev={prev} savedGuardian={savedGuardian} />}
      {step === 4 && <StepSummary racers={racers} data={data} setData={setData} next={next} prev={prev} />}
      {step === 5 && <StepPayment data={data} setData={setData} next={next} prev={prev} savedGuardian={savedGuardian} />}
      {step === 6 && <StepSuccess racers={racers} data={data} reset={reset} onBackToHome={onBackToHome} />}
    </div>
  );
}


const root = createRoot(document.getElementById('root'));
root.render(<App />);
