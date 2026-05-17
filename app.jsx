import React, { useState, useMemo, useEffect } from 'react';
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
  'RACE100': { type: 'fixed', value: 100, label: 'ลด 100 บาท' },
  'RACE10P': { type: 'percent', value: 10, label: 'ลด 10%' },
  'NEWBIE': { type: 'fixed', value: 200, label: 'ลด 200 บาท' },
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
  birthDate: '',
  gender: '', // 'male' | 'female'
  documents: [], // [{ name, size, type, dataUrl }]
  selectedDates: [],
  selectedRaces: {},
});

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
            <ConsentRow
              icon={ShieldCheck}
              title="นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)"
              desc="ข้าพเจ้ายินยอมให้จัดเก็บและใช้ข้อมูลส่วนบุคคลตามนโยบาย"
              checked={data.pdpa}
              onChange={v => setData({ ...data, pdpa: v })}
            />
            <ConsentRow
              icon={Check}
              title="กฎ กติกาการแข่งขัน"
              desc="ข้าพเจ้าได้อ่านและยอมรับกฎกติกาการแข่งขันทุกข้อ"
              checked={data.rules}
              onChange={v => setData({ ...data, rules: v })}
              link="อ่านกฎกติกาทั้งหมด"
              onLinkClick={() => setRulesOpen(true)}
            />

            <div className="flex gap-2 pt-3">
              <Button variant="secondary" onClick={() => setPhase('otp')} className="flex-1">
                <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
              </Button>
              <Button onClick={finish} disabled={!data.pdpa || !data.rules} className="flex-1">
                ดำเนินการต่อ <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

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
                  onClick={() => { setData({ ...data, rules: true }); setRulesOpen(false); }}
                  className="flex-1"
                >
                  <Check className="w-4 h-4" /> ยอมรับและปิด
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

// ============================================================
// STEP 2: RACERS
// ============================================================
function StepRacers({ racers, setRacers, next, prev }) {
  const [err, setErr] = useState('');

  const addRacer = () => setRacers([...racers, newRacer()]);
  const removeRacer = (id) => {
    if (racers.length === 1) return;
    setRacers(racers.filter(r => r.id !== id));
  };
  const updateRacer = (id, patch) => {
    setRacers(racers.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const submit = () => {
    for (const r of racers) {
      if (!r.thFirstName || !r.thLastName || !r.enFirstName || !r.enLastName || !r.birthDate) {
        return setErr('กรุณากรอกข้อมูลนักแข่งให้ครบทุกคน');
      }
      if (!r.gender) {
        return setErr(`กรุณาเลือกเพศของนักแข่ง "${r.thFirstName}"`);
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
    </Card>
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

  // group eligible tiers by tier group
  const byGroup = TIER_GROUPS.map(g => ({
    ...g,
    tiers: eligible.filter(t => t.group === g.id),
  })).filter(g => g.tiers.length > 0);

  // visual style ของแต่ละ group
  const groupStyles = {
    standard: { dot: 'bg-slate-700', text: 'text-slate-900', bg: 'bg-slate-50/70', border: 'border-slate-200' },
    girl: { dot: 'bg-pink-500', text: 'text-pink-900', bg: 'bg-pink-50/60', border: 'border-pink-200' },
    open: { dot: 'bg-amber-500', text: 'text-amber-900', bg: 'bg-amber-50/60', border: 'border-amber-200' },
  };

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

      {/* Tier groups — แต่ละ group เป็นกล่องของตัวเอง */}
      <div className="p-2.5 space-y-2">
        {byGroup.map(group => {
          const style = groupStyles[group.id];
          const selectedInGroup = group.tiers.filter(t => selected.includes(t.id)).length;
          return (
            <div key={group.id} className={`rounded-md border ${style.border} ${style.bg} overflow-hidden`}>
              {/* group header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-current/10">
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
                <span className={`text-[11px] font-bold ${style.text} uppercase tracking-wide`}>
                  {group.label}
                </span>
                <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">
                  · {group.desc}
                </span>
                {selectedInGroup > 0 && (
                  <span className="ml-auto text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded">
                    เลือกแล้ว {selectedInGroup}
                  </span>
                )}
              </div>
              {/* tier buttons */}
              <div className="flex flex-wrap gap-1.5 p-2.5">
                {group.tiers.map(t => {
                  const isSel = selected.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onToggle(t.id)}
                      className={`px-2.5 h-8 rounded-md border text-xs font-medium transition flex items-center gap-1.5 ${
                        isSel
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                      title={t.range}
                    >
                      {isSel && <Check className="w-3 h-3" strokeWidth={2.5} />}
                      {t.label}
                      <span className={isSel ? 'text-slate-300' : 'text-slate-400'}>· {fmt(t.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// STEP 3: GUARDIAN
// ============================================================
function StepGuardian({ data, setData, next, prev }) {
  const [err, setErr] = useState('');
  const g = data.guardian;
  const set = (patch) => setData({ ...data, guardian: { ...g, ...patch } });

  const submit = () => {
    if (!g.name || !g.address || !g.email || !g.phone) return setErr('กรุณากรอกข้อมูลให้ครบ');
    if (!/^0\d{9}$/.test(g.phone)) return setErr('เบอร์โทรไม่ถูกต้อง');
    if (!/\S+@\S+\.\S+/.test(g.email)) return setErr('อีเมลไม่ถูกต้อง');
    setErr('');
    next();
  };

  return (
    <Card>
      <Header icon={User} title="ข้อมูลผู้ปกครอง" subtitle="สำหรับติดต่อในกรณีฉุกเฉินและส่งใบเสร็จ" />
      <div className="space-y-3">
        <div>
          <Label required>ชื่อ-นามสกุล</Label>
          <Input icon={User} placeholder="ชื่อ-นามสกุล ผู้ปกครอง" value={g.name} onChange={e => set({ name: e.target.value })} />
        </div>
        <div>
          <Label required>ที่อยู่</Label>
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
            <Input icon={Phone} placeholder="08X-XXX-XXXX" maxLength={10} value={g.phone} onChange={e => set({ phone: e.target.value.replace(/\D/g, '') })} />
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
// STEP 4: SUMMARY + COUPON
// ============================================================
function StepSummary({ racers, data, setData, next, prev }) {
  const [coupon, setCoupon] = useState(data.couponCode || '');
  const [couponMsg, setCouponMsg] = useState('');

  const lineItems = useMemo(() => {
    const items = [];
    racers.forEach(r => {
      r.selectedDates.forEach(did => {
        const dateObj = RACE_DATES.find(d => d.id === did);
        (r.selectedRaces[did] || []).forEach(tid => {
          const t = RACE_TIERS.find(x => x.id === tid);
          items.push({
            racer: `${r.thFirstName} ${r.thLastName}`,
            date: dateObj?.short || '',
            tier: t.label,
            tierName: t.name || t.label,
            price: t.price,
          });
        });
      });
    });
    return items;
  }, [racers]);

  const grouped = useMemo(() => {
    const map = {};
    racers.forEach(r => {
      const name = `${r.thFirstName} ${r.thLastName}`;
      map[name] = [];
      r.selectedDates.forEach(did => {
        const dateObj = RACE_DATES.find(d => d.id === did);
        (r.selectedRaces[did] || []).forEach(tid => {
          const t = RACE_TIERS.find(x => x.id === tid);
          map[name].push({ date: dateObj?.short || '', tier: t.label, tierName: t.name || t.label, price: t.price });
        });
      });
    });
    return map;
  }, [racers]);

  const subtotal = lineItems.reduce((s, i) => s + i.price, 0);
  const discount = useMemo(() => {
    if (!data.appliedCoupon) return 0;
    const c = COUPONS[data.appliedCoupon];
    if (!c) return 0;
    if (c.type === 'fixed') return c.value;
    if (c.type === 'percent') return Math.round(subtotal * c.value / 100);
    return 0;
  }, [data.appliedCoupon, subtotal]);
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (COUPONS[code]) {
      setData({ ...data, couponCode: code, appliedCoupon: code });
      setCouponMsg(`ใช้คูปอง ${code} สำเร็จ — ${COUPONS[code].label}`);
    } else {
      setData({ ...data, appliedCoupon: null });
      setCouponMsg('โค้ดไม่ถูกต้องหรือหมดอายุ');
    }
  };
  const removeCoupon = () => {
    setData({ ...data, couponCode: '', appliedCoupon: null });
    setCoupon('');
    setCouponMsg('');
  };

  return (
    <Card>
      <Header icon={Tag} title="สรุปยอดการลงทะเบียน" subtitle="ตรวจสอบรายการก่อนชำระเงิน" />

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          {Object.entries(grouped).map(([name, items]) => (
            <div key={name}>
              <p className="text-xs font-medium text-slate-500 mb-2">{name}</p>
              <div className="rounded-md border border-slate-200 divide-y divide-slate-100">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-900 truncate">{item.date}</p>
                      <p className="text-[11px] text-slate-500">{item.tier}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900 ml-2">{fmt(item.price)} ฿</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Label>โค้ดส่วนลด</Label>
            {data.appliedCoupon ? (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-md border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-emerald-900">{data.appliedCoupon}</p>
                    <p className="text-[11px] text-emerald-700">{COUPONS[data.appliedCoupon].label}</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-slate-400 hover:text-red-600 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    placeholder="กรอกโค้ดส่วนลด"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                  />
                  <Button variant="secondary" onClick={applyCoupon}>ใช้</Button>
                </div>
                {couponMsg && (
                  <p className={`text-[11px] mt-1.5 ${couponMsg.startsWith('ใช้') ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponMsg}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">ลองใช้: RACE100 · RACE10P · NEWBIE</p>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative rounded-xl p-5 lg:sticky lg:top-4 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white shadow-xl shadow-slate-900/20">
            {/* speed lines decoration */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-500/20 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <p className="text-[10px] font-bold text-red-300 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3 h-3" strokeWidth={2.5} />
                ยอดที่ต้องชำระ
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>ยอดรวม</span>
                  <span className="font-medium">{fmt(subtotal)} ฿</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">ส่วนลด</span>
                  <span className="font-medium text-red-300">−{fmt(discount)} ฿</span>
                </div>
                <div className="border-t border-white/20 my-2.5"></div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">ยอดสุทธิ</span>
                  <span className="text-3xl font-black text-white tracking-tight">{fmt(total)} <span className="text-base font-normal text-slate-300">฿</span></span>
                </div>
              </div>
              <div className="border-t border-white/10 mt-3 pt-3 text-[11px] text-slate-400 leading-relaxed">
                {lineItems.length} รายการ · นักแข่ง {racers.length} คน
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <Button variant="secondary" onClick={prev} className="flex-1">
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
        </Button>
        <Button onClick={() => { setData({ ...data, finalTotal: total, subtotal, discount }); next(); }} className="flex-1">
          ไปหน้าชำระเงิน <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

// ============================================================
// STEP 5: PAYMENT
// ============================================================
function StepPayment({ data, next, prev }) {
  const [method, setMethod] = useState('credit');
  const [processing, setProcessing] = useState(false);

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
      <div className="max-w-md mx-auto">
        {/* Success banner — รูปเดียวมีทั้ง trophy, mascot, badge */}
        <div className="-mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-5 overflow-hidden rounded-t-2xl">
          <img
            src={SUCCESS_BANNER}
            alt="สำเร็จแล้ว"
            className="w-full h-auto block"
          />
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">เจอกันที่สนามแข่ง!</h2>
          <p className="text-sm text-slate-500">เราได้ส่งอีเมลยืนยันการลงทะเบียนไปยังอีเมลของท่านแล้ว</p>
        </div>

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

        <div className="rounded-xl border-2 border-dashed border-red-200 p-4 mb-5 bg-red-50/30 text-center">
          <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">QR Code ลงทะเบียน</p>
          <div className="w-32 h-32 mx-auto bg-white border-2 border-slate-200 rounded-lg p-1.5 shadow-md">
            <QRPattern />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">📌 แสดง QR นี้ต่อเจ้าหน้าที่ในวันแข่งขัน</p>
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
function Navbar({ currentView, onNavigate, user, onLogin, onLogout, transparent }) {
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
              onClick={onRegisterClick}
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

  useEffect(() => { setMode(defaultMode); setErr(''); }, [defaultMode, open]);

  const submitLogin = () => {
    if (!form.identifier || !form.password) return setErr('กรุณากรอกอีเมล/ชื่อผู้ใช้ และรหัสผ่าน');
    setErr('');
    // demo: เข้าได้ทุกอันที่กรอก
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
    >
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

      {mode === 'login' ? (
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
              <button type="button" className="text-[11px] text-red-600 hover:underline font-medium">ลืมรหัสผ่าน?</button>
            </div>
            <Input icon={Lock} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {err && <Alert>{err}</Alert>}
          <Button onClick={submitLogin} className="w-full">
            เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-[11px] text-slate-400 text-center">💡 Demo: ใส่อะไรก็เข้าได้</p>
        </div>
      ) : (
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
// HISTORY PAGE
// ============================================================
function HistoryPage({ user, registrations, onRegisterClick, onBackToHome, onSelectRegistration }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
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
// APP — view routing + auth state
// ============================================================
function App() {
  // view: 'landing' | 'register' | 'history'
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState('login');
  const [registrations, setRegistrations] = useState([]);
  const [qrModal, setQrModal] = useState({ open: false, registration: null, racer: null });
  const [eventSelectOpen, setEventSelectOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openLogin = (mode = 'login') => {
    setLoginMode(mode);
    setLoginOpen(true);
  };

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
              gender: 'F',
              birthDate: '2020-08-12',
              selectedDates: ['D1', 'D3'],
              selectedRaces: { D1: ['U3'], D3: ['GS'] },
            },
            {
              id: 'R002',
              thFirstName: 'ธีรภัทร',
              thLastName: 'จันทร์เพ็ญ',
              enFirstName: 'Teerapat',
              enLastName: 'Chanphen',
              gender: 'M',
              birthDate: '2022-03-25',
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
              gender: 'M',
              birthDate: '2018-11-30',
              selectedDates: ['D5', 'D7'],
              selectedRaces: { D5: ['U5'], D7: ['OP'] },
            },
          ],
          totalItems: 2,
          total: 2000,
        },
      ];
      setRegistrations(mockRegistrations);
    }
    setView('history');
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
      racers: racers,
      totalItems: racers.reduce((s, r) => s + Object.values(r.selectedRaces || {}).reduce((a, b) => a + b.length, 0), 0),
      total: data.finalTotal,
    };
    setRegistrations([newReg, ...registrations]);
    setView('history');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      <Navbar
        currentView={view}
        onNavigate={setView}
        user={user}
        onLogin={openLogin}
        onLogout={handleLogout}
        transparent={view === 'landing'}
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
              />
            </div>
          </div>
        )}

        {view === 'history' && user && (
          <HistoryPage
            user={user}
            registrations={registrations}
            onRegisterClick={() => setEventSelectOpen(true)}
            onBackToHome={() => setView('landing')}
            onSelectRegistration={(reg, racer) => setQrModal({ open: true, registration: reg, racer })}
          />
        )}
      </main>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        defaultMode={loginMode}
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
function RaceRegistration({ onBackToHome, onComplete, startStep = 1, prefillUser, selectedEvent }) {
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
      {step === 2 && <StepRacers racers={racers} setRacers={setRacers} next={next} prev={step > startStep ? prev : null} />}
      {step === 3 && <StepGuardian data={data} setData={setData} next={next} prev={prev} />}
      {step === 4 && <StepSummary racers={racers} data={data} setData={setData} next={next} prev={prev} />}
      {step === 5 && <StepPayment data={data} next={next} prev={prev} />}
      {step === 6 && <StepSuccess racers={racers} data={data} reset={reset} onBackToHome={onBackToHome} />}
    </div>
  );
}


const root = createRoot(document.getElementById('root'));
root.render(<App />);
