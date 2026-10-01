// ============================================================
// SkillBridge Shared Constants
// Category definitions, defaults, and configuration values
// ============================================================

import {
  JobCategory,
  type ISubCategory,
  type IDaySchedule,
  type IWorkingHours,
  type IWorkerVerificationDetails,
  VerificationStatus,
} from '../types';

// ── App Constants ────────────────────────────────────────────

export const APP_NAME = 'SkillBridge';
export const MAX_MATCHED_WORKERS_TO_SHOW = 3;
export const DEFAULT_WORKER_PROFILE_IMAGE = 'https://picsum.photos/seed/newworker/200';
export const DEFAULT_CUSTOMER_PROFILE_IMAGE = 'https://picsum.photos/seed/newcustomer/100';
export const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17';

// ── Schedule Defaults ────────────────────────────────────────

export const DEFAULT_DAY_SCHEDULE: IDaySchedule = {
  isActive: true,
  startTime: '09:00',
  endTime: '17:00',
};

export const WEEKEND_OFF_SCHEDULE: IDaySchedule = {
  isActive: false,
  startTime: '09:00',
  endTime: '17:00',
};

export const DEFAULT_WORKING_HOURS: IWorkingHours = {
  monday: { ...DEFAULT_DAY_SCHEDULE },
  tuesday: { ...DEFAULT_DAY_SCHEDULE },
  wednesday: { ...DEFAULT_DAY_SCHEDULE },
  thursday: { ...DEFAULT_DAY_SCHEDULE },
  friday: { ...DEFAULT_DAY_SCHEDULE },
  saturday: { ...WEEKEND_OFF_SCHEDULE },
  sunday: { ...WEEKEND_OFF_SCHEDULE },
};

// ── Verification Defaults ────────────────────────────────────

export const DEFAULT_VERIFICATION_DETAILS: IWorkerVerificationDetails = {
  idVerifiedStatus: VerificationStatus.NONE,
  backgroundCheckStatus: VerificationStatus.NONE,
  referencesStatus: VerificationStatus.NONE,
};

// ── Category Definitions ─────────────────────────────────────

export interface ICategoryDefinition {
  id: string;
  nameEnum: JobCategory;
  iconName: string; // Icon reference name (resolved in the app layer)
  color: string;
  textColor: string;
  descriptionKey: string; // i18n key
  subCategories: ISubCategory[];
}

export const CATEGORIES: ICategoryDefinition[] = [
  {
    id: 'cat_plumbing',
    nameEnum: JobCategory.PLUMBING,
    iconName: 'wrench',
    color: '#3B82F6',
    textColor: '#FFFFFF',
    descriptionKey: 'category.plumbing.description',
    subCategories: [
      { id: 'sub_faucet_repair', name: 'subcategory.plumbing.faucet_repair' },
      { id: 'sub_toilet_repair', name: 'subcategory.plumbing.toilet_repair' },
      { id: 'sub_drain_cleaning', name: 'subcategory.plumbing.drain_cleaning' },
      { id: 'sub_leak_detection', name: 'subcategory.plumbing.leak_detection' },
      { id: 'sub_water_heater', name: 'subcategory.plumbing.water_heater' },
    ],
  },
  {
    id: 'cat_electrical',
    nameEnum: JobCategory.ELECTRICAL,
    iconName: 'bolt',
    color: '#EAB308',
    textColor: '#FFFFFF',
    descriptionKey: 'category.electrical.description',
    subCategories: [
      { id: 'sub_lighting_fix', name: 'subcategory.electrical.lighting_installation_repair' },
      { id: 'sub_outlet_switch', name: 'subcategory.electrical.outlet_switch_repair_install' },
      { id: 'sub_wiring_issues', name: 'subcategory.electrical.wiring_rewiring_projects' },
      { id: 'sub_panel_upgrade', name: 'subcategory.electrical.electrical_panel_services' },
      { id: 'sub_appliance_wiring', name: 'subcategory.electrical.appliance_wiring' },
    ],
  },
  {
    id: 'cat_salon',
    nameEnum: JobCategory.SALON,
    iconName: 'face-smile',
    color: '#EC4899',
    textColor: '#FFFFFF',
    descriptionKey: 'category.salon.description',
    subCategories: [
      { id: 'sub_makeup', name: 'subcategory.salon.makeup_artist' },
      { id: 'sub_waxing', name: 'subcategory.salon.waxing_services' },
      { id: 'sub_mani_pedi', name: 'subcategory.salon.manicure_pedicure' },
      { id: 'sub_facial', name: 'subcategory.salon.facial_treatments' },
    ],
  },
  {
    id: 'cat_car_services',
    nameEnum: JobCategory.CAR_SERVICES,
    iconName: 'truck',
    color: '#475569',
    textColor: '#FFFFFF',
    descriptionKey: 'category.car_services.description',
    subCategories: [
      { id: 'sub_car_detailing', name: 'subcategory.car_services.car_detailing' },
      { id: 'sub_car_service', name: 'subcategory.car_services.routine_car_service' },
      { id: 'sub_car_mechanic', name: 'subcategory.car_services.general_mechanic' },
      { id: 'sub_auto_electrician', name: 'subcategory.car_services.auto_electrician' },
    ],
  },
  {
    id: 'cat_carpentry',
    nameEnum: JobCategory.CARPENTRY,
    iconName: 'hammer',
    color: '#F97316',
    textColor: '#FFFFFF',
    descriptionKey: 'category.carpentry.description',
    subCategories: [
      { id: 'sub_custom_furniture', name: 'subcategory.carpentry.custom_furniture_building' },
      { id: 'sub_deck_repair', name: 'subcategory.carpentry.deck_fence_repair' },
      { id: 'sub_cabinetry', name: 'subcategory.carpentry.cabinet_installation_repair' },
      { id: 'sub_trim_molding', name: 'subcategory.carpentry.trim_molding_work' },
      { id: 'sub_door_window_frames', name: 'subcategory.carpentry.door_window_framing' },
    ],
  },
  {
    id: 'cat_painting',
    nameEnum: JobCategory.PAINTING,
    iconName: 'paint-brush',
    color: '#A855F7',
    textColor: '#FFFFFF',
    descriptionKey: 'category.painting.description',
    subCategories: [
      { id: 'sub_interior_paint', name: 'subcategory.painting.interior_room_painting' },
      { id: 'sub_exterior_paint', name: 'subcategory.painting.exterior_house_painting' },
      { id: 'sub_cabinet_paint', name: 'subcategory.painting.cabinet_painting_refinishing' },
      { id: 'sub_wallpaper', name: 'subcategory.painting.wallpaper_removal_installation' },
    ],
  },
  {
    id: 'cat_cleaning',
    nameEnum: JobCategory.CLEANING,
    iconName: 'sparkles',
    color: '#22C55E',
    textColor: '#FFFFFF',
    descriptionKey: 'category.cleaning.description',
    subCategories: [
      { id: 'sub_house_cleaning', name: 'subcategory.cleaning.standard_house_cleaning' },
      { id: 'sub_deep_cleaning', name: 'subcategory.cleaning.deep_cleaning_services' },
      { id: 'sub_office_cleaning', name: 'subcategory.cleaning.office_commercial_cleaning' },
      { id: 'sub_window_cleaning', name: 'subcategory.cleaning.window_cleaning' },
    ],
  },
  {
    id: 'cat_hvac',
    nameEnum: JobCategory.HVAC,
    iconName: 'briefcase',
    color: '#14B8A6',
    textColor: '#FFFFFF',
    descriptionKey: 'category.hvac.description',
    subCategories: [
      { id: 'sub_ac_repair', name: 'subcategory.hvac.air_conditioner_repair' },
      { id: 'sub_furnace_repair', name: 'subcategory.hvac.heater_furnace_repair' },
      { id: 'sub_hvac_install', name: 'subcategory.hvac.hvac_system_installation' },
      { id: 'sub_hvac_maintenance', name: 'subcategory.hvac.hvac_maintenance' },
    ],
  },
  {
    id: 'cat_general_handyman',
    nameEnum: JobCategory.GENERAL_HANDYMAN,
    iconName: 'briefcase',
    color: '#6B7280',
    textColor: '#FFFFFF',
    descriptionKey: 'category.general_handyman.description',
    subCategories: [
      { id: 'sub_assembly', name: 'subcategory.general_handyman.furniture_assembly' },
      { id: 'sub_mounting', name: 'subcategory.general_handyman.tv_mounting_shelf_installation' },
      { id: 'sub_minor_repairs', name: 'subcategory.general_handyman.minor_home_repairs' },
      { id: 'sub_picture_hanging', name: 'subcategory.general_handyman.picture_mirror_hanging' },
    ],
  },
];
