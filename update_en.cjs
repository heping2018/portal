const fs = require('fs');
const enPath = 'src/locales/en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const newTranslations = {
  export: 'Export Excel',
  import: 'Import Users',
  batch_delete: 'Batch Delete',
  import_title: 'Import Users',
  download_template: 'Download Template',
  select_file: 'Select File',
  update_support: 'Support updating existing users',
  change_password_title: 'Change Password',
  import_success: 'Import successful! Success: {success}, Failed: {failed}',
  import_error: 'Import failed',
  export_error: 'Export failed',
  template_error: 'Template download failed',
  password_changed: 'Password changed successfully',
  password_mismatch: 'Passwords do not match',
  confirm_batch_delete: 'Are you sure to delete {count} selected users?',
  status_active: 'Active',
  status_inactive: 'Inactive',
  password_placeholder_edit: 'Leave blank to keep current password',
  table: {
    username: 'Username',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    actions: 'Actions'
  },
  form: {
    username: 'Username',
    email: 'Email',
    role: 'Role',
    password: 'Password',
    new_password: 'New Password',
    confirm_password: 'Confirm Password'
  },
  actions: {
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    change_password: 'Password',
    enable: 'Enable',
    disable: 'Disable'
  }
};

en.admin_user = { ...en.admin_user, ...newTranslations };
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
console.log('Updated en.json successfully');
