import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, Calendar, Plus, Trash2, Tag, CreditCard, Check, ArrowLeft, ArrowRight, MapPin, X, ChevronDown, Upload, FileText as FileIcon, Sparkles, Zap, Flag, Trophy } from 'lucide-react';
import { createRoot } from 'react-dom/client';

const LOGO_DATA_URL = './assets/logo.png';
const BG_DATA_URL = './assets/bg.jpg';
const MASCOT_LEFT = './assets/mascot-left.jpg';
const MASCOT_RIGHT = './assets/mascot-right.jpg';
const HERO_BANNER = './assets/hero.png';
const SUCCESS_BANNER = './assets/success.png';
const GRANDPRIX_LOGO = './assets/grandprix-logo.png';
const HERO_VIDEO = './assets/GRANDPRIX%20RUNBIKE%20CHAMPIONSHIP%20_Monomax.mp4';

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

const EVENT_REF_DATE = new Date('2026-06-06');

const RACE_TIERS = [
  { id: '2Y', label: 'รุ่นอายุ 2 ปี (2.0-3.0 ปี)', name: 'รุ่นอายุ 2 ปี', minMonths: 24, maxMonths: 36, range: '2.0-3.0 Years Old', price: 500 },
  { id: '3YB', label: 'รุ่นอายุ 3 ปี "B" (3.1-3.6 ปี)', name: 'รุ่นอายุ 3 ปี "B"', minMonths: 37, maxMonths: 42, range: '3.1-3.6 Years Old (เกิดเดือน 03/2023 - 11/2023)', price: 600 },
  { id: '3YA', label: 'รุ่นอายุ 3 ปี "A" (3.7-4.0 ปี)', name: 'รุ่นอายุ 3 ปี "A"', minMonths: 43, maxMonths: 48, range: '3.7-4.0 Years Old', price: 600 },
  { id: '4YB', label: 'รุ่นอายุ 4 ปี "B" (4.1-4.6 ปี)', name: 'รุ่นอายุ 4 ปี "B"', minMonths: 49, maxMonths: 54, range: '4.1-4.6 Years Old', price: 700 },
  { id: '4YA', label: 'รุ่นอายุ 4 ปี "A" (4.7-5.0 ปี)', name: 'รุ่นอายุ 4 ปี "A"', minMonths: 55, maxMonths: 60, range: '4.7-5.0 Years Old', price: 700 },
  { id: '5YB', label: 'รุ่นอายุ 5 ปี "B" (5.1-5.6 ปี)', name: 'รุ่นอายุ 5 ปี "B"', minMonths: 61, maxMonths: 66, range: '5.1-5.6 Years Old', price: 800 },
  { id: '5YA', label: 'รุ่นอายุ 5 ปี "A" (5.7-6.0 ปี)', name: 'รุ่นอายุ 5 ปี "A"', minMonths: 67, maxMonths: 72, range: '5.7-6.0 Years Old', price: 800 },
  { id: '6YB', label: 'รุ่นอายุ 6 ปี "B" (6.1-6.6 ปี)', name: 'รุ่นอายุ 6 ปี "B"', minMonths: 73, maxMonths: 78, range: '6.1-6.6 Years Old', price: 900 },
  { id: '6YA', label: 'รุ่นอายุ 6 ปี "A" (6.7-7.0 ปี)', name: 'รุ่นอายุ 6 ปี "A"', minMonths: 79, maxMonths: 84, range: '6.7-7.0 Years Old', price: 900 },
  { id: '7Y', label: 'รุ่นอายุ 7.1-8.0 ปี', name: 'รุ่นอายุ 7.1 -8.0 ปี', minMonths: 85, maxMonths: 96, range: '7.1-8.0 Years Old', price: 1000 },
  { id: '8Y', label: 'รุ่นอายุ 8.1-10.0 ปี', name: 'รุ่นอายุ 8.1-10.0 ปี', minMonths: 97, maxMonths: 120, range: '8.1-10.0 Years Old', price: 1200 },

  { id: 'GJ', label: 'Open Girl · Junior (เกิดปี 2022-2023)', name: 'รุ่นผู้หญิงจูเนียร์ เกิดปี 2022-2023', birthYears: [2022, 2023], range: 'Open Girl - Junior 2022-2023', price: 800, gender: 'female' },
  { id: 'GS', label: 'Open Girl · Senior (เกิดปี 2020-2021)', name: 'รุ่นผู้หญิงซีเนียร์ เกิดปี 2020-2021', birthYears: [2020, 2021], range: 'Open Girl - Senior 2020-2021', price: 900, gender: 'female' },
  { id: 'GP', label: 'Open Girl · Pro (เกิดปี 2017-2019)', name: 'รุ่นผู้หญิงโปร เกิดปี 2017-2019', birthYears: [2017, 2018, 2019], range: 'Open Girl - Pro 2017-2019', price: 1000, gender: 'female' },

  { id: 'OJ', label: 'Open · Junior (เกิดปี 2022-2023)', name: 'รุ่นโอเพ่นจูเนียร์ เกิดปี 2022-2023', birthYears: [2022, 2023], range: 'Open Junior/2022-2023', price: 800 },
  { id: 'OS', label: 'Open · Senior (เกิดปี 2020-2021)', name: 'รุ่นโอเพ่นซีเนียร์ เกิดปี 2020-2021', birthYears: [2020, 2021], range: 'Open Senior/2020-2021', price: 900 },
  { id: 'OP', label: 'Open · Pro (เกิดปี 2013-2019)', name: 'รุ่นโอเพ่นโปร เกิดปี 2013-2019', birthYears: [2013, 2014, 2015, 2016, 2017, 2018, 2019], range: 'Open Pro/2013-2019', price: 1100 },
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
  'GPRC10': { type: 'percent10', label: 'ส่วนลด 10%' },
  'GPRCMAIN': { type: 'main-free', label: 'ฟรีรุ่นหลัก' },
};

const calcAgeYM = (d) => {
  if (!d) return { years: 0, months: 0 };
  const b = new Date(d);
  let y = EVENT_REF_DATE.getFullYear() - b.getFullYear();
  let m = EVENT_REF_DATE.getMonth() - b.getMonth();
  if (EVENT_REF_DATE.getDate() < b.getDate()) m -= 1;
  if (m < 0) { y -= 1; m += 12; }
  return { years: y, months: m };
};

const getEligibleTiers = (d, gender) => {
  if (!d) return [];
  const birthDate = new Date(d);
  const birthYear = birthDate.getFullYear();
  let totalMonths = (EVENT_REF_DATE.getFullYear() - birthYear) * 12 + (EVENT_REF_DATE.getMonth() - birthDate.getMonth());
  if (EVENT_REF_DATE.getDate() < birthDate.getDate()) {
    totalMonths -= 1;
  }
  return RACE_TIERS.filter(t => {
    if (t.gender === 'female' && gender !== 'female') return false;
    if (t.birthYears) return t.birthYears.includes(birthYear);
    if (t.minMonths != null && t.maxMonths != null) {
      return totalMonths >= t.minMonths && totalMonths <= t.maxMonths;
    }
    return false;
  });
};

const fmt = (n) => n.toLocaleString('th-TH');

const newRacer = () => ({
  id: Date.now() + Math.random(),
  thFirstName: '', thLastName: '',
  enFirstName: '', enLastName: '',
  nickname: '', birthDate: '', gender: '', shirtSize: '',
  country: 'TH', teamName: '', documents: [],
  selectedDates: [], selectedRaces: {},
});

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const COUNTRIES = [
  { code: 'TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'OTHER', name: 'อื่นๆ', flag: '🌍' },
];

const Input = React.forwardRef(({ className = '', icon: Icon, ...props }, ref) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
    <input ref={ref} {...props} className={`w-full h-10 ${Icon ? 'pl-9' : 'pl-3'} pr-3 text-sm rounded-md border bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition ${className}`} />
  </div>
));
Input.displayName = 'Input';

const Label = ({ children, required }) => (
  <label className="block text-xs font-medium text-slate-600 mb-1.5">{children}{required && '*'}</label>
);

const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-md',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
  };
  return <button {...props} className={`${variants[variant]} h-10 px-4 text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition ${className}`}>{children}</button>;
};

const Card = ({ children }) => <div className="relative bg-white rounded-2xl border p-5 sm:p-6 shadow-sm">{children}</div>;

const Header = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-4 flex items-start gap-3">
    {Icon && <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white"><Icon className="w-4 h-4" /></div>}
    <div><h2 className="text-base font-bold text-slate-900">{title}</h2>{subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}</div>
  </div>
);

const Alert = ({ children }) => <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{children}</div>;
const Divider = () => <div className="border-t border-slate-100" />;

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl border shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer && <div className="p-3 border-t bg-slate-50">{footer}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ current }) {
  const pct = ((current - 1) / 4) * 100;
  return (
    <div className="mb-4 text-xs">
      <div className="flex justify-between mb-1"><span>ขั้นตอนที่ {current} / 5</span></div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-red-600 transition-all" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function StepAccount({ data, setData, next }) {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [err, setErr] = useState('');
  const submit = () => {
    if (!form.username || !form.password) return setErr('กรุณากรอกข้อมูลให้ครบถ้วน');
    if (form.password !== form.confirmPassword) return setErr('รหัสผ่านไม่ตรงกัน');
    setData({ ...data, username: form.username, email: form.username + '@example.com' });
    next();
  };
  return (
    <Card>
      <Header icon={User} title="ลงทะเบียนบัญชีผู้ใช้งาน" />
      <div className="space-y-3">
        <div><Label required>ชื่อผู้ใช้</Label><Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
        <div><Label required>รหัสผ่าน</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <div><Label required>ยืนยันรหัสผ่าน</Label><Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} /></div>
        {err && <Alert>{err}</Alert>}
        <Button onClick={submit} className="w-full">ถัดไป</Button>
      </div>
    </Card>
  );
}

function StepRacers({ racers, setRacers, savedRacers = [], next, prev }) {
  const [err, setErr] = useState('');
  const updateRacer = (id, patch) => setRacers(racers.map(r => r.id === id ? { ...r, ...patch } : r));
  const submit = () => {
    for (const r of racers) {
      if (!r.thFirstName || !r.thLastName || !r.birthDate || !r.gender || !r.shirtSize) return setErr('กรุณากรอกข้อมูลนักแข่งให้ครบ');
      if (r.selectedDates.length === 0) return setErr('กรุณาเลือกวันสมัครแข่งอย่างน้อย 1 วัน');
      for (const d of r.selectedDates) {
        if (!r.selectedRaces[d] || r.selectedRaces[d].length === 0) return setErr('กรุณาระบุรุ่นหลักให้ครบถ้วน');
      }
    }
    next();
  };
  return (
    <Card>
      <Header icon={Flag} title="ข้อมูลนักแข่งและรุ่นสมัครแข่งขัน" />
      <div className="space-y-4">
        {racers.map((r, i) => (
          <RacerCard key={r.id} racer={r} index={i} onUpdate={patch => updateRacer(r.id, patch)} />
        ))}
        {err && <Alert>{err}</Alert>}
        <div className="flex gap-2">
          {prev && <Button variant="secondary" onClick={prev} className="flex-1">ย้อนกลับ</Button>}
          <Button onClick={submit} className="flex-1">ดำเนินการต่อ</Button>
        </div>
      </div>
    </Card>
  );
}

function RacerCard({ racer: r, index, onUpdate }) {
  const ageYM = calcAgeYM(r.birthDate);
  const eligibleTiers = useMemo(() => getEligibleTiers(r.birthDate, r.gender), [r.birthDate, r.gender]);
  const toggleDate = (did) => {
    const isSel = r.selectedDates.includes(did);
    const nextDates = isSel ? r.selectedDates.filter(x => x !== did) : [...r.selectedDates, did];
    const nextRaces = { ...r.selectedRaces };
    if (isSel) delete nextRaces[did];
    onUpdate({ selectedDates: nextDates, selectedRaces: nextRaces });
  };
  return (
    <div className="border p-4 rounded-xl space-y-3 bg-white text-xs">
      <div className="font-bold text-sm text-slate-800 border-b pb-1.5">นักแข่งคนที่ {index+1}</div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label required>ชื่อจริง (ไทย)</Label><Input value={r.thFirstName} onChange={e => onUpdate({ thFirstName: e.target.value })} /></div>
        <div><Label required>นามสกุล (ไทย)</Label><Input value={r.thLastName} onChange={e => onUpdate({ thLastName: e.target.value })} /></div>
        <div>
          <Label required>เพศสภาพ</Label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => onUpdate({ gender: 'male', selectedDates: [], selectedRaces: {} })} className={`h-9 rounded border font-medium ${r.gender === 'male' ? 'bg-slate-900 text-white' : ''}`}>ชาย</button>
            <button type="button" onClick={() => onUpdate({ gender: 'female', selectedDates: [], selectedRaces: {} })} className={`h-9 rounded border font-medium ${r.gender === 'female' ? 'bg-slate-900 text-white' : ''}`}>หญิง</button>
          </div>
        </div>
        <div>
          <Label required>วันเดือนปีเกิด</Label>
          <Input type="date" value={r.birthDate} onChange={e => onUpdate({ birthDate: e.target.value, selectedDates: [], selectedRaces: {} })} />
        </div>
      </div>
      {r.birthDate && <div className="text-xs bg-slate-100 p-2 rounded">อายุคำนวณได้ ณ วันงาน: {ageYM.years} ปี {ageYM.months} เดือน</div>}
      <div>
        <Label required>ไซส์เสื้อสิทธิ์</Label>
        <div className="flex gap-1.5">
          {SHIRT_SIZES.map(sz => (
            <button key={sz} type="button" onClick={() => onUpdate({ shirtSize: sz })} className={`h-8 border flex-1 font-bold rounded ${r.shirtSize === sz ? 'bg-red-600 text-white' : ''}`}>{sz}</button>
          ))}
        </div>
      </div>
      <div>
        <Label>อัปโหลดสูติบัตร/บัตรประชาชน (สมมติจำลอง)</Label>
        <input type="file" onChange={() => onUpdate({ documents: [{ name: 'doc.jpg' }] })} className="w-full text-xs" />
      </div>
      {r.birthDate && r.gender && eligibleTiers.length > 0 && (
        <>
          <Divider />
          <div>
            <Label required>1. เลือกวันร่วมแข่งขัน</Label>
            <DatePicker dates={RACE_DATES} selected={r.selectedDates} onToggle={toggleDate} />
          </div>
          {r.selectedDates.length > 0 && (
            <div className="space-y-3 mt-2">
              <Label required>2. เลือกสมัครรุ่นการแข่งขันประจำแต่ละวัน</Label>
              {RACE_DATES.filter(d => r.selectedDates.includes(d.id)).map(d => (
                <DateTierPicker key={d.id} date={d} eligible={eligibleTiers} selected={r.selectedRaces[d.id] || []} onChange={newList => onUpdate({ selectedRaces: { ...r.selectedRaces, [d.id]: newList } })} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DatePicker({ dates, selected, onToggle }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {dates.map(d => {
        const isSel = selected.includes(d.id);
        return (
          <button key={d.id} type="button" onClick={() => onToggle(d.id)} className={`p-2 rounded border text-center transition ${isSel ? 'bg-slate-900 text-white' : 'bg-white'}`}>
            <div className="text-[10px] opacity-60">{d.weekday}</div>
            <div className="text-xs font-bold">{d.day} {d.month}</div>
          </button>
        );
      })}
    </div>
  );
}

function DateTierPicker({ date, eligible, selected, onChange }) {
  const mainTierId = selected.length > 0 ? selected[0] : null;
  const additionalTiers = selected.slice(1);
  const hasMainTier = !!mainTierId;
  const handleSelectMain = (tid) => {
    if (mainTierId === tid) onChange([]);
    else {
      const rest = selected.filter(x => x !== tid && x !== mainTierId);
      onChange([tid, ...rest]);
    }
  };
  const handleToggleAdditional = (tid) => {
    if (selected.includes(tid)) onChange(selected.filter(x => x !== tid));
    else onChange([...selected, tid]);
  };
  return (
    <div className="rounded-lg border bg-white overflow-hidden text-xs space-y-2 p-2">
      <div className="bg-slate-900 text-white p-1.5 rounded font-bold">{date.full}</div>
      <div className="border-2 p-2 rounded border-red-100 bg-red-50/10">
        <div className="text-[10px] font-bold text-red-900 mb-1">เลือกรุ่นหลัก (เลือกได้ 1 รุ่นก่อน)</div>
        <div className="flex flex-wrap gap-1">
          {eligible.map(t => (
            <button key={`m-${t.id}`} type="button" onClick={() => handleSelectMain(t.id)} className={`p-1.5 border rounded text-[11px] font-bold ${mainTierId === t.id ? 'bg-red-600 text-white' : 'bg-white text-slate-700'}`}>{t.name}</button>
          ))}
        </div>
      </div>
      {eligible.length > 1 && (
        <div className={`border-2 p-2 rounded ${hasMainTier ? 'border-amber-100 bg-amber-50/10' : 'opacity-40'}`}>
          <div className="text-[10px] font-bold text-amber-900 mb-1">เพิ่มรุ่นเพิ่มเติม (ต้องเลือกรุ่นหลักก่อน)</div>
          <div className="flex flex-wrap gap-1">
            {eligible.filter(t => t.id !== mainTierId).map(t => {
              const isSel = additionalTiers.includes(t.id);
              return (
                <button key={`a-${t.id}`} type="button" disabled={!hasMainTier} onClick={() => handleToggleAdditional(t.id)} className={`p-1.5 border rounded text-[11px] ${isSel ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'}`}>{t.name}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StepGuardian({ data, setData, next, prev }) {
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });
  const submit = () => {
    if (!form.name || !form.phone) return alert('กรุณากรอกข้อมูลหลักผู้ปกครอง');
    setData({ ...data, guardian: form });
    next();
  };
  return (
    <Card>
      <Header icon={User} title="ข้อมูลรายละเอียดผู้ปกครอง" />
      <div className="space-y-3">
        <div><Label required>ชื่อ-นามสกุล ผู้ปกครอง</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label required>ที่อยู่จัดส่งของรางวัล</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label required>เบอร์โทร</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label required>อีเมล</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={prev} className="flex-1">ย้อนกลับ</Button>
          <Button onClick={submit} className="flex-1">ถัดไป</Button>
        </div>
      </div>
    </Card>
  );
}

function StepSummary({ racers, data, setData, next, prev }) {
  const breakdown = useMemo(() => {
    return racers.map(r => {
      let total = 0;
      r.selectedDates.forEach(did => {
        (r.selectedRaces[did] || []).forEach(tid => {
          total += (RACE_TIERS.find(x => x.id === tid)?.price || 0);
        });
      });
      return { r, total };
    });
  }, [racers]);
  const subTotal = breakdown.reduce((s, x) => s + x.total, 0);
  return (
    <Card>
      <Header icon={Tag} title="สรุปยอดค่าลงทะเบียนสมัคร" />
      <div className="space-y-3 text-xs">
        {breakdown.map((b, i) => (
          <div key={i} className="p-2 border rounded bg-slate-50 flex justify-between">
            <span>นักแข่ง: {b.r.thFirstName} {b.r.thLastName}</span>
            <span className="font-bold">{fmt(b.total)} ฿</span>
          </div>
        ))}
        <div className="p-3 bg-slate-900 text-white rounded font-bold flex justify-between">
          <span>ยอดชำระเงินสุทธิ:</span><span>{fmt(subTotal)} ฿</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={prev} className="flex-1">ย้อนกลับ</Button>
          <Button onClick={() => { setData({ ...data, finalTotal: subTotal }); next(); }} className="flex-1">ชำระเงิน</Button>
        </div>
      </div>
    </Card>
  );
}

function StepPayment({ data, next }) {
  return (
    <Card>
      <Header icon={CreditCard} title="ปลอดภัยผ่านเกตเวย์ชำระเงิน" />
      <div className="text-center space-y-3 p-4">
        <p className="text-sm font-bold text-slate-800">ยอดเงินเรียกเก็บสุทธิ: {fmt(data.finalTotal)} ฿</p>
        <div className="p-4 border rounded bg-slate-50 font-mono text-xs">จำลองช่องทางจ่ายเงิน Thai QR / Credit Card</div>
        <Button onClick={next} className="w-full">ยืนยันทำรายการชำระเงินเรียบร้อย</Button>
      </div>
    </Card>
  );
}

function StepSuccess({ onBackToHome }) {
  return (
    <Card>
      <div className="text-center py-6 space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto font-bold text-xl">✓</div>
        <h2 className="text-base font-bold text-slate-900">ลงทะเบียนสำเร็จเสร็จสิ้น!</h2>
        <Button onClick={onBackToHome} className="w-full">กลับไปหน้าหลักทำเนียบนักแข่ง</Button>
      </div>
    </Card>
  );
}

function MyRacersPage({ racers }) {
  return (
    <div className="space-y-3 text-xs">
      <h1 className="text-base font-bold text-slate-900">ทำเนียบรายชื่อนักแข่งที่บันทึก</h1>
      {racers.length === 0 ? <div className="p-4 border border-dashed text-center text-slate-400">ยังไม่พบข้อมูลรายชื่อนักแข่งประจำประวัติบัญชีนี้</div> : null}
    </div>
  );
}

function GuardianPage({ guardian }) {
  return (
    <div className="space-y-2 text-xs bg-white p-4 border rounded-xl shadow-sm">
      <h1 className="font-bold text-sm text-slate-900">ประวัติข้อมูลผู้ปกครองผู้ดูแล</h1>
      <p className="text-slate-600">ชื่อ: {guardian?.name || 'ยังไม่ระบุ'}</p>
      <p className="text-slate-600">เบอร์โทร: {guardian?.phone || 'ยังไม่ระบุ'}</p>
    </div>
  );
}

function HistoryPage({ registrations, onRegisterClick }) {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-bold text-slate-900">ประวัติสิทธิ์ใบสมัครสะสม</h1>
        <Button size="sm" onClick={onRegisterClick}>+ สมัครรุ่นใหม่</Button>
      </div>
      {registrations.length === 0 ? <div className="p-6 border border-dashed text-center text-slate-400 bg-white rounded-xl">ไม่มีประวัติใบสมัครใดๆ ในระบบ</div> : null}
    </div>
  );
}

function Navbar({ onNavigate, user, onLogout }) {
  return (
    <nav className="fixed top-0 inset-x-0 h-14 bg-slate-900 text-white flex items-center justify-between px-4 text-xs font-bold z-40">
      <button onClick={() => onNavigate('landing')} className="text-sm font-black">GRANDPRIX RUNBIKE</button>
      <div className="flex gap-3">
        <button onClick={() => onNavigate('landing')}>หน้าหลัก</button>
        {user ? (
          <>
            <button onClick={() => onNavigate('racers')}>ทำเนียบ</button>
            <button onClick={() => onNavigate('guardian')}>ผู้ปกครอง</button>
            <button onClick={() => onNavigate('history')}>ประวัติสมัคร</button>
            <button onClick={onLogout} className="text-red-400">ออกระบบ</button>
          </>
        ) : (
          <button onClick={() => onNavigate('register')} className="bg-red-600 px-2.5 py-1 rounded">สมัครแข่งขัน</button>
        )}
      </div>
    </nav>
  );
}

function LandingPage({ onRegisterClick }) {
  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center p-4 text-center space-y-4">
      <h1 className="text-2xl sm:text-4xl font-black">GRANDPRIX RUNBIKE CHAMPIONSHIP 2026</h1>
      <p className="text-xs text-slate-400 max-w-md">เปิดรับสมัครประลองสนามอย่างเป็นทางการ คัดเลือกเยาวชนตัวแทนเข้าสู่รอบแชมเปี้ยนชิพ</p>
      <Button onClick={onRegisterClick} size="lg" className="font-bold">สมัครลงทะเบียนเข้าแข่งขันเลยทันที</Button>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [savedRacers, setSavedRacers] = useState([]);
  const [savedGuardian, setSavedGuardian] = useState(null);

  const handleRegistrationComplete = ({ racers, data }) => {
    const nextReg = {
      id: Date.now(),
      refId: 'GPRC-' + Math.floor(Math.random() * 9000000 + 1000000),
      racers,
      total: data.finalTotal,
      date: new Date().toLocaleDateString('th-TH')
    };
    setRegistrations([nextReg, ...registrations]);
    setSavedRacers([...savedRacers, ...racers]);
    if (data.guardian) setSavedGuardian(data.guardian);
    setUser({ username: data.username });
    setView('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Navbar onNavigate={setView} user={user} onLogout={() => { setUser(null); setView('landing'); }} />
      <main className="pt-14">
        {view === 'landing' && <LandingPage onRegisterClick={() => setView('register')} />}
        {view === 'register' && (
          <div className="max-w-xl mx-auto p-4">
            <RaceRegistration onBackToHome={() => setView('landing')} onComplete={handleRegistrationComplete} />
          </div>
        )}
        {view === 'racers' && <div className="max-w-xl mx-auto p-4"><MyRacersPage racers={savedRacers} /></div>}
        {view === 'guardian' && <div className="max-w-xl mx-auto p-4"><GuardianPage guardian={savedGuardian} /></div>}
        {view === 'history' && <div className="max-w-xl mx-auto p-4"><HistoryPage registrations={registrations} onRegisterClick={() => setView('register')} /></div>}
      </main>
    </div>
  );
}

function RaceRegistration({ onBackToHome, onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ username: '', email: '', guardian: null, finalTotal: 0 });
  const [racers, setRacers] = useState([newRacer()]);

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  return (
    <div className="space-y-4">
      {step <= 5 && <ProgressBar current={step} />}
      {step === 1 && <StepAccount data={data} setData={setData} next={next} />}
      {step === 2 && <StepRacers racers={racers} setRacers={setRacers} next={next} prev={prev} />}
      {step === 3 && <StepGuardian data={data} setData={setData} next={next} prev={prev} />}
      {step === 4 && <StepSummary racers={racers} data={data} setData={setData} next={next} prev={prev} />}
      {step === 5 && <StepPayment data={data} next={next} />}
      {step === 6 && <StepSuccess onBackToHome={() => onComplete({ racers, data })} />}
    </div>
  );
}
