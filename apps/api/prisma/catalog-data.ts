// Launch catalog (doc 02: home repair & maintenance). Reference content, not demo data:
// safe to load in every environment. Urdu/Arabic are drafts that MUST be reviewed by native
// speakers before launch (doc 22 §8.1). Prices are deliberately absent: they are a business
// decision per city and arrive through the pricing config, not through code.

type Tr = { ur: string; ar: string };
export interface CatalogIssue { code: string; en: string; tr: Tr }
export interface CatalogService { en: string; ur: string }
export interface CatalogCategory {
  name: string;          // stable key used by matching
  icon: string;          // key the app maps to an Ionicons glyph
  en: string; tr: Tr;
  description: string;
  services: CatalogService[];
  issues: CatalogIssue[];
}

const i = (code: string, en: string, ur: string, ar: string): CatalogIssue => ({ code, en, tr: { ur, ar } });

export const CATALOG: CatalogCategory[] = [
  {
    name: 'HVAC', icon: 'snow', en: 'AC & Cooling', tr: { ur: 'اے سی اور کولنگ', ar: 'التكييف والتبريد' },
    description: 'AC repair, servicing, gas refill and installation',
    services: [{ en: 'AC servicing', ur: 'اے سی سروس' }, { en: 'AC repair', ur: 'اے سی کی مرمت' }, { en: 'Gas refill', ur: 'گیس بھروانا' }],
    issues: [
      i('ac_not_cooling', 'AC not cooling', 'اے سی ٹھنڈا نہیں کر رہا', 'المكيف لا يبرد'),
      i('ac_water_leak', 'Water leaking from AC', 'اے سی سے پانی ٹپک رہا ہے', 'تسرب ماء من المكيف'),
      i('ac_noise', 'AC making noise', 'اے سی میں شور ہے', 'ضوضاء في المكيف'),
      i('ac_not_turning_on', 'AC will not turn on', 'اے سی آن نہیں ہو رہا', 'المكيف لا يعمل'),
      i('ac_service', 'Regular service', 'عام سروس', 'صيانة دورية'),
      i('ac_gas_refill', 'Gas refill', 'گیس بھروانی ہے', 'تعبئة الغاز'),
    ],
  },
  {
    name: 'PLUMBING', icon: 'water', en: 'Plumbing', tr: { ur: 'پلمبنگ', ar: 'السباكة' },
    description: 'Leaks, blocked drains, taps, toilets and geysers',
    services: [{ en: 'Tap & mixer repair', ur: 'نل اور مکسر کی مرمت' }, { en: 'Drain unblocking', ur: 'نالی کھولنا' }, { en: 'Geyser repair', ur: 'گیزر کی مرمت' }],
    issues: [
      i('leaking_tap', 'Leaking tap', 'نل ٹپک رہا ہے', 'تسريب في الصنبور'),
      i('blocked_drain', 'Blocked drain', 'نالی بند ہے', 'انسداد في المصرف'),
      i('no_water', 'No water coming', 'پانی نہیں آ رہا', 'لا يوجد ماء'),
      i('toilet_problem', 'Toilet problem', 'ٹوائلٹ کا مسئلہ', 'مشكلة في المرحاض'),
      i('geyser_problem', 'Geyser not working', 'گیزر خراب ہے', 'عطل في السخان'),
      i('pipe_burst', 'Burst pipe', 'پائپ پھٹ گیا ہے', 'انفجار أنبوب'),
    ],
  },
  {
    name: 'ELECTRICAL', icon: 'flash', en: 'Electrical', tr: { ur: 'بجلی کا کام', ar: 'الكهرباء' },
    description: 'Wiring, switches, fans, lights and power problems',
    services: [{ en: 'Wiring & fault finding', ur: 'وائرنگ اور خرابی کی تلاش' }, { en: 'Switch & socket repair', ur: 'سوئچ اور ساکٹ کی مرمت' }, { en: 'Fan & light repair', ur: 'پنکھے اور لائٹ کی مرمت' }],
    issues: [
      i('no_power', 'No power', 'بجلی نہیں ہے', 'انقطاع الكهرباء'),
      i('sparks_burning_smell', 'Sparks or burning smell', 'چنگاریاں یا جلنے کی بو', 'شرر أو رائحة حرق'),
      i('breaker_tripping', 'Breaker keeps tripping', 'بریکر بار بار ٹرپ ہو رہا ہے', 'القاطع يفصل باستمرار'),
      i('switch_socket', 'Broken switch or socket', 'سوئچ یا ساکٹ خراب ہے', 'مفتاح أو مقبس تالف'),
      i('fan_problem', 'Fan not working', 'پنکھا خراب ہے', 'عطل في المروحة'),
      i('light_problem', 'Light not working', 'لائٹ خراب ہے', 'عطل في الإضاءة'),
    ],
  },
  {
    name: 'APPLIANCE_REPAIR', icon: 'hardware-chip', en: 'Appliance repair', tr: { ur: 'گھریلو آلات کی مرمت', ar: 'إصلاح الأجهزة المنزلية' },
    description: 'Fridge, washing machine, oven and other home appliances',
    services: [{ en: 'Fridge repair', ur: 'فریج کی مرمت' }, { en: 'Washing machine repair', ur: 'واشنگ مشین کی مرمت' }, { en: 'Oven & stove repair', ur: 'اوون اور چولہے کی مرمت' }],
    issues: [
      i('fridge', 'Fridge not cooling', 'فریج ٹھنڈا نہیں کر رہا', 'الثلاجة لا تبرد'),
      i('washing_machine', 'Washing machine problem', 'واشنگ مشین کا مسئلہ', 'مشكلة في الغسالة'),
      i('microwave_oven', 'Microwave or oven', 'مائیکروویو یا اوون', 'ميكروويف أو فرن'),
      i('stove', 'Stove or cooker', 'چولہا یا کوکر', 'موقد أو طباخ'),
      i('water_dispenser', 'Water dispenser', 'واٹر ڈسپنسر', 'موزع المياه'),
      i('tv_repair', 'TV problem', 'ٹی وی کا مسئلہ', 'مشكلة في التلفاز'),
    ],
  },
  {
    name: 'CARPENTRY', icon: 'hammer', en: 'Carpentry', tr: { ur: 'بڑھئی کا کام', ar: 'النجارة' },
    description: 'Doors, wardrobes, furniture repair and woodwork',
    services: [{ en: 'Door & window repair', ur: 'دروازے اور کھڑکی کی مرمت' }, { en: 'Furniture repair', ur: 'فرنیچر کی مرمت' }, { en: 'Custom woodwork', ur: 'لکڑی کا خاص کام' }],
    issues: [
      i('door_repair', 'Door not closing properly', 'دروازہ ٹھیک بند نہیں ہو رہا', 'الباب لا يغلق جيدا'),
      i('cupboard_wardrobe', 'Cupboard or wardrobe', 'الماری یا وارڈروب', 'خزانة أو دولاب'),
      i('furniture_repair', 'Broken furniture', 'ٹوٹا ہوا فرنیچر', 'أثاث مكسور'),
      i('kitchen_cabinets', 'Kitchen cabinets', 'کچن کیبنٹ', 'خزائن المطبخ'),
      i('new_furniture', 'Make new furniture', 'نیا فرنیچر بنوانا', 'تصنيع أثاث جديد'),
      i('polish', 'Wood polish', 'لکڑی کی پالش', 'تلميع الخشب'),
    ],
  },
  {
    name: 'PAINTING', icon: 'color-palette', en: 'Painting', tr: { ur: 'رنگ و روغن', ar: 'الدهان' },
    description: 'Interior and exterior painting and wall repair',
    services: [{ en: 'Room painting', ur: 'کمرے کا رنگ' }, { en: 'Whole house painting', ur: 'پورے گھر کا رنگ' }, { en: 'Wall repair & putty', ur: 'دیوار کی مرمت اور پٹی' }],
    issues: [
      i('room_painting', 'Paint a room', 'ایک کمرہ رنگوانا', 'دهان غرفة'),
      i('whole_house', 'Paint whole house', 'پورا گھر رنگوانا', 'دهان المنزل كاملا'),
      i('wall_repair_paint', 'Wall cracks or damp', 'دیوار میں دراڑیں یا سیلن', 'شقوق أو رطوبة في الجدار'),
      i('exterior_paint', 'Outside walls', 'باہر کی دیواریں', 'الجدران الخارجية'),
    ],
  },
  {
    name: 'CLEANING', icon: 'sparkles', en: 'Cleaning', tr: { ur: 'صفائی', ar: 'التنظيف' },
    description: 'Home, kitchen, bathroom, sofa and water tank cleaning',
    services: [{ en: 'Deep home cleaning', ur: 'گھر کی مکمل صفائی' }, { en: 'Sofa & carpet cleaning', ur: 'صوفے اور قالین کی صفائی' }, { en: 'Water tank cleaning', ur: 'پانی کی ٹینکی کی صفائی' }],
    issues: [
      i('home_deep_cleaning', 'Deep clean my home', 'گھر کی مکمل صفائی', 'تنظيف عميق للمنزل'),
      i('kitchen_cleaning', 'Kitchen cleaning', 'کچن کی صفائی', 'تنظيف المطبخ'),
      i('bathroom_cleaning', 'Bathroom cleaning', 'باتھ روم کی صفائی', 'تنظيف الحمام'),
      i('sofa_carpet', 'Sofa or carpet', 'صوفہ یا قالین', 'أريكة أو سجاد'),
      i('water_tank_cleaning', 'Water tank cleaning', 'پانی کی ٹینکی کی صفائی', 'تنظيف خزان المياه'),
      i('post_construction', 'After construction', 'تعمیرات کے بعد صفائی', 'تنظيف بعد البناء'),
    ],
  },
  {
    name: 'GENERAL_HANDYMAN', icon: 'construct', en: 'Handyman', tr: { ur: 'عام مرمت', ar: 'أعمال الصيانة العامة' },
    description: 'Small repairs and odd jobs around the home',
    services: [{ en: 'General repairs', ur: 'عام مرمت' }, { en: 'Furniture assembly', ur: 'فرنیچر جوڑنا' }],
    issues: [
      i('general_repair', 'Something is broken', 'کچھ ٹوٹ گیا ہے', 'شيء ما مكسور'),
      i('shelf_hanging', 'Hang shelf or picture', 'شیلف یا تصویر لگانا', 'تركيب رف أو لوحة'),
      i('curtain_rod', 'Curtains or blinds', 'پردے یا بلائنڈز', 'ستائر أو شبابيك'),
      i('furniture_assembly', 'Assemble furniture', 'فرنیچر جوڑنا', 'تركيب أثاث'),
      i('door_window_repair', 'Door or window fix', 'دروازے یا کھڑکی کی مرمت', 'إصلاح باب أو نافذة'),
    ],
  },
  {
    name: 'LOCKSMITH', icon: 'key', en: 'Locksmith', tr: { ur: 'تالہ ساز', ar: 'الأقفال والمفاتيح' },
    description: 'Lockouts, lost keys and lock replacement',
    services: [{ en: 'Open locked door', ur: 'بند دروازہ کھولنا' }, { en: 'Lock replacement', ur: 'تالہ تبدیل کرنا' }],
    issues: [
      i('locked_out', 'Locked out', 'دروازہ بند ہو گیا ہے', 'مغلق خارج المنزل'),
      i('key_lost', 'Lost key', 'چابی گم ہو گئی', 'فقدان المفتاح'),
      i('lock_broken', 'Broken lock', 'تالہ ٹوٹ گیا', 'قفل مكسور'),
      i('new_lock', 'Fit a new lock', 'نیا تالہ لگوانا', 'تركيب قفل جديد'),
    ],
  },
  {
    name: 'INSTALLATION', icon: 'build', en: 'Installation', tr: { ur: 'تنصیب', ar: 'التركيب' },
    description: 'Fans, TVs, ACs, geysers, lights and cameras',
    services: [{ en: 'AC installation', ur: 'اے سی لگانا' }, { en: 'TV wall mounting', ur: 'ٹی وی دیوار پر لگانا' }, { en: 'Fan & light fitting', ur: 'پنکھا اور لائٹ لگانا' }],
    issues: [
      i('ac_install', 'Install an AC', 'اے سی لگوانا', 'تركيب مكيف'),
      i('tv_mounting', 'Mount a TV', 'ٹی وی دیوار پر لگانا', 'تركيب تلفاز على الحائط'),
      i('ceiling_fan_install', 'Fit a ceiling fan', 'سیلنگ فین لگوانا', 'تركيب مروحة سقف'),
      i('geyser_install', 'Install a geyser', 'گیزر لگوانا', 'تركيب سخان'),
      i('light_fixture', 'Fit lights', 'لائٹس لگوانا', 'تركيب إضاءة'),
      i('camera_install', 'Install CCTV', 'سی سی ٹی وی لگوانا', 'تركيب كاميرات مراقبة'),
    ],
  },
];
