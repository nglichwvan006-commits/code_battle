export const dictionaries = {
  en: {
    // General
    loading: "Loading...",
    error: "An error occurred",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    
    // Auth
    login: "Login",
    register: "Register",
    logout: "Logout",
    
    // Sidebar/Navigation
    dashboard: "Dashboard",
    problems: "Problems",
    map: "World Map",
    quests: "Daily Quests",
    achievements: "Achievements",
    leaderboard: "Leaderboard",
    inventory: "Inventory",
    pets: "Pets",
    admin: "Admin",

    // Dashboard
    welcomeBack: "Welcome back",
    continueAdventure: "Continue your adventure and level up your skills",
    noCharacter: "No Character Yet",
    createCharacter: "Create your hero to begin the adventure",
    createBtn: "Create Character",
    progress: "Progress",
    solved: "Solved",
    unlocked: "Unlocked",
    quickActions: "Quick Actions",
    dailyQuests: "Daily Quests",
  },
  vi: {
    // General
    loading: "Đang tải...",
    error: "Đã xảy ra lỗi",
    save: "Lưu",
    cancel: "Hủy",
    confirm: "Xác nhận",
    
    // Auth
    login: "Đăng nhập",
    register: "Đăng ký",
    logout: "Đăng xuất",
    
    // Sidebar/Navigation
    dashboard: "Bảng Điều Khiển",
    problems: "Bài Tập",
    map: "Bản Đồ Thế Giới",
    quests: "Nhiệm Vụ Hàng Ngày",
    achievements: "Thành Tựu",
    leaderboard: "Bảng Xếp Hạng",
    inventory: "Hành Trang",
    pets: "Thú Cưng",
    admin: "Quản Trị",

    // Dashboard
    welcomeBack: "Chào mừng trở lại",
    continueAdventure: "Tiếp tục cuộc phiêu lưu và thăng cấp kỹ năng của bạn",
    noCharacter: "Chưa Có Nhân Vật",
    createCharacter: "Tạo anh hùng của bạn để bắt đầu cuộc hành trình",
    createBtn: "Tạo Nhân Vật",
    progress: "Tiến Trình",
    solved: "Đã Giải",
    unlocked: "Đã Mở Khóa",
    quickActions: "Hành Động Nhanh",
    dailyQuests: "Nhiệm Vụ Hàng Ngày",
  }
};

export type Language = 'en' | 'vi';
export type DictionaryKey = keyof typeof dictionaries.en;
