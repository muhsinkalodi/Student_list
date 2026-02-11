// Application Configuration
// Copyright © 2026 qmexai

export const APP_CONFIG = {
  APP_NAME: 'Ramadan Data Collection',
  VERSION: '2.0.0',
  AUTHOR: 'qmexai',
  
  // Branding
  BRAND: {
    name: 'qmexai',
    year: 2026,
    tagline: 'Beautiful Data Collection & Analytics'
  },

  // Colors (Tailwind classes as strings)
  COLORS: {
    primary: 'from-amber-700 via-orange-600 to-red-600',
    secondary: 'from-orange-500 to-red-500',
    success: 'from-green-500 to-emerald-600',
    info: 'from-blue-500 to-blue-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
  },

  // Text
  STRINGS: {
    TITLE: 'Ramadan Data',
    SUBTITLE: 'Collection & Analytics',
    TOTAL_RECORDS: 'Total Records',
    ACTIVE_STATES: 'Active States',
    COLLEGES: 'Colleges',
    ADD_RECORD: 'Add Record',
    SAVE_RECORD: 'Save Record',
    CANCEL: 'Cancel',
    SEARCH_PLACEHOLDER: 'Search by name or state...',
    NO_RECORDS: 'No records found',
    TRY_ADJUST: 'Try adjusting your search or add a new record',
    FEATURES: 'Features',
    INFORMATION: 'Information',
    SUCCESS_MESSAGE: '✓ Data added successfully!',
    ERROR_MESSAGE: '✗ Error: ',
    LOADING: 'Saving...',
  },

  // API Endpoints
  API: {
    BASE_URL: '/api',
    ENDPOINTS: {
      GET_ALL: '/api',
      ADD_RECORD: '/api',
    }
  },

  // Table Configuration
  TABLE: {
    HEADERS: ['Name', 'Roll Number', 'College Type', 'State'],
    COLUMNS: ['name', 'roll_number', 'college_type', 'state'],
  },

  // Form Fields
  FORM_FIELDS: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      required: true,
    },
    {
      name: 'roll_number',
      label: 'Roll Number',
      type: 'text',
      placeholder: 'Enter roll number',
      required: true,
    },
    {
      name: 'college_type',
      label: 'College Type',
      type: 'text',
      placeholder: 'Enter college type',
      required: true,
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      placeholder: 'Enter state',
      required: true,
    },
  ],

  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300, // ms
    MESSAGE_DURATION: 3000, // ms
    BORDER_RADIUS: {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
    },
  },

  // Feature Flags
  FEATURES: {
    ENABLE_SEARCH: true,
    ENABLE_ADD_FORM: true,
    ENABLE_STATS: true,
    ENABLE_FOOTER: true,
  },
};

// Helper function to get the full title
export const getPageTitle = () => `${APP_CONFIG.STRINGS.TITLE} - ${APP_CONFIG.STRINGS.SUBTITLE}`;

// Helper function to get branding text
export const getBrandingText = () => `© ${APP_CONFIG.BRAND.year} ${APP_CONFIG.BRAND.name}`;
