import React, { useState, useMemo, useEffect } from 'react';
import { 
  masterMarketingPlan, 
  calculateKPIs, 
  getNextMilestones 
} from './data/marketingPlan';
import { ContentItem, ContentStatus, MonthFilter, TemporalFilter, PeriodFilter, YearFilter } from './types/marketing';
import { Employee, BirthdayTribute } from './types/employee';
import { TeamTask } from './types/task';
import { AppUser } from './types/auth';
import { AppNotification } from './types/notification';
import { 
  initialEmployees, 
  getDaysUntilBirthday, 
  getBirthdayAlerts 
} from './data/employeesData';
import { initialTasksData } from './data/tasksData';
import { initialNotificationsData } from './data/notificationsData';
import { teamUsersList } from './data/authUsersData';
import { 
  getRecifeTodayDate, 
  formatToDateBR, 
  getEventTemporalStatus, 
  findNextEventDate 
} from './utils/dateUtils';
import { storageService } from './services/storageService';
import { 
  isFirebaseConfigured, 
  firestoreSyncService, 
  firebaseAuthService 
} from './services/firebase';
import { pinAuthService } from './services/pinAuthService';
import { usePWAInstall } from './hooks/usePWAInstall';

import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { MobileBottomNav, MainAppTab } from './components/MobileBottomNav';
import { HomeDashboardView } from './components/HomeDashboardView';
import { ProfileView } from './components/ProfileView';
import { FilterBar, FilterValues } from './components/FilterBar';
import { CalendarGridView } from './components/CalendarGridView';
import { CalendarAgendaView } from './components/CalendarAgendaView';
import { KanbanView } from './components/KanbanView';
import { ContentListView } from './components/ContentListView';
import { DashboardKpiView } from './components/DashboardKpiView';
import { BirthdayHubView } from './components/BirthdayHubView';
import { StoriesStrategyView } from './components/StoriesStrategyView';
import { WhatsAppHubView } from './components/WhatsAppHubView';
import { SolarCalculatorView } from './components/SolarCalculatorView';
import { ContentDetailModal } from './components/ContentDetailModal';
import { ContentEditModal } from './components/ContentEditModal';
import { BirthdayTributeModal } from './components/BirthdayTributeModal';
import { EmployeeEditModal } from './components/EmployeeEditModal';
import { NotificationsModal } from './components/NotificationsModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { NowTechLogo } from './components/NowTechLogo';
import { 
  Calendar as CalendarIcon, 
  LayoutGrid, 
  Kanban, 
  List, 
  ListFilter,
  Download, 
  Sun, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  MapPin, 
  FileSpreadsheet 
} from 'lucide-react';

export default function App() {
  // PWA Install Hook
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Auth User Session (requiring authentication with email/password or saved session)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = storageService.load<AppUser | null>(
      storageService.STORAGE_KEYS.AUTH_USER,
      null
    );
    if (saved && saved.id === 'user-williams') {
      return {
        ...saved,
        role: 'Assistente de Marketing | T.I',
        userRole: 'ADMIN',
        department: 'Marketing & T.I',
      };
    }
    return saved;
  });

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsubscribe = firebaseAuthService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        if (!currentUser || currentUser.id !== firebaseUser.uid) {
          let profile: AppUser | null = null;
          try {
            profile = await firebaseAuthService.getUserProfile(firebaseUser.uid);
          } catch {
            // Profile may be created on first login
          }
          const emailStr = firebaseUser.email || '';
          const isAdmin = emailStr.includes('admin') || emailStr.includes('carlos') || emailStr.includes('william') || emailStr === 'utonhy.dev@gmail.com';
          const syncedUser: AppUser = profile || {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || emailStr.split('@')[0] || 'Colaborador NowTech',
            role: isAdmin ? 'Diretoria / Administrador' : 'Colaborador NowTech',
            userRole: isAdmin ? 'ADMIN' : 'COLABORADOR',
            email: emailStr,
            avatar: firebaseUser.photoURL || undefined
          };
          setCurrentUser(syncedUser);
          storageService.save(storageService.STORAGE_KEYS.AUTH_USER, syncedUser);
        }
      }
    });
    return unsubscribe;
  }, [currentUser]);

  // Marketing Items with storage service (merges masterMarketingPlan with loaded cache)
  const [items, setItems] = useState<ContentItem[]>(() => {
    const loaded = storageService.load<ContentItem[]>(
      storageService.STORAGE_KEYS.CONTENT_ITEMS,
      masterMarketingPlan
    );
    const itemMap = new Map<string, ContentItem>();
    for (const item of masterMarketingPlan) {
      itemMap.set(item.id, item);
    }
    for (const item of loaded) {
      itemMap.set(item.id, item);
    }
    return Array.from(itemMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  });

  // Employees state with storage service
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const loaded = storageService.load<Employee[]>(
      storageService.STORAGE_KEYS.EMPLOYEES,
      initialEmployees
    );
    return loaded.map((emp) =>
      emp.id === 'emp-10' && emp.role === 'Assistente de Marketing'
        ? { ...emp, role: 'Assistente de Marketing | T.I' }
        : emp
    );
  });

  // Birthday tributes state with storage service
  const [tributes, setTributes] = useState<BirthdayTribute[]>(() => {
    return storageService.load<BirthdayTribute[]>(
      storageService.STORAGE_KEYS.TRIBUTES,
      []
    );
  });

  // Tasks state with storage service
  const [tasks, setTasks] = useState<TeamTask[]>(() => {
    return storageService.load<TeamTask[]>(
      storageService.STORAGE_KEYS.TASKS,
      initialTasksData
    );
  });

  // Notifications state with storage service
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return storageService.load<AppNotification[]>(
      storageService.STORAGE_KEYS.NOTIFICATIONS,
      initialNotificationsData
    );
  });
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Today reference date based on America/Recife timezone (UTC-3)
  const [currentToday, setCurrentToday] = useState<string>(() => getRecifeTodayDate());
  const [isSimulatedDate, setIsSimulatedDate] = useState<boolean>(false);

  // Auto-refresh clock effect (checks every 30s for date change in America/Recife)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSimulatedDate) {
        const liveToday = getRecifeTodayDate();
        setCurrentToday((prev) => (prev !== liveToday ? liveToday : prev));
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [isSimulatedDate]);

  // Cross-tab real-time sync listener (BroadcastChannel / LocalStorage)
  useEffect(() => {
    const unsubscribe = storageService.onSync((key) => {
      if (key === storageService.STORAGE_KEYS.CONTENT_ITEMS) {
        setItems(storageService.load(key, masterMarketingPlan));
      } else if (key === storageService.STORAGE_KEYS.EMPLOYEES) {
        setEmployees(storageService.load(key, initialEmployees));
      } else if (key === storageService.STORAGE_KEYS.TASKS) {
        setTasks(storageService.load(key, initialTasksData));
      } else if (key === storageService.STORAGE_KEYS.TRIBUTES) {
        setTributes(storageService.load(key, []));
      } else if (key === storageService.STORAGE_KEYS.NOTIFICATIONS) {
        setNotifications(storageService.load(key, initialNotificationsData));
      }
    });
    return unsubscribe;
  }, []);

  // Cloud Firestore Real-time Multi-Device Sync (when Firebase is configured)
  useEffect(() => {
    // Initialize PIN authentication database in Firebase
    pinAuthService.initialize();

    if (!isFirebaseConfigured()) return;

    // Seed empty collections on first run
    firestoreSyncService.seedIfEmpty('events', masterMarketingPlan);
    firestoreSyncService.seedIfEmpty('employees', initialEmployees);
    firestoreSyncService.seedIfEmpty('tasks', initialTasksData);
    firestoreSyncService.seedIfEmpty('notifications', initialNotificationsData);

    const unsubEvents = firestoreSyncService.subscribe<ContentItem>('events', (data) => {
      if (data && data.length > 0) {
        const itemMap = new Map<string, ContentItem>();
        for (const item of masterMarketingPlan) {
          itemMap.set(item.id, item);
        }
        for (const item of data) {
          itemMap.set(item.id, item);
        }
        const merged = Array.from(itemMap.values()).sort((a, b) => a.date.localeCompare(b.date));
        setItems(merged);
        storageService.save(storageService.STORAGE_KEYS.CONTENT_ITEMS, merged);

        // Upload any 2027 items missing from Firestore non-destructively
        const firestoreIds = new Set(data.map((d) => d.id));
        const missingFromFirestore = masterMarketingPlan.filter((m) => !firestoreIds.has(m.id));
        if (missingFromFirestore.length > 0) {
          missingFromFirestore.forEach((item) => {
            firestoreSyncService.saveItem('events', item);
          });
        }
      }
    });

    const unsubEmployees = firestoreSyncService.subscribe<Employee>('employees', (data) => {
      if (data && data.length > 0) {
        setEmployees(data);
        storageService.save(storageService.STORAGE_KEYS.EMPLOYEES, data);
      }
    });

    const unsubTasks = firestoreSyncService.subscribe<TeamTask>('tasks', (data) => {
      if (data && data.length > 0) {
        setTasks(data);
        storageService.save(storageService.STORAGE_KEYS.TASKS, data);
      }
    });

    const unsubTributes = firestoreSyncService.subscribe<BirthdayTribute>('tributes', (data) => {
      if (data && data.length > 0) {
        setTributes(data);
        storageService.save(storageService.STORAGE_KEYS.TRIBUTES, data);
      }
    });

    const unsubNotifs = firestoreSyncService.subscribe<AppNotification>('notifications', (data) => {
      if (data && data.length > 0) {
        setNotifications(data);
        storageService.save(storageService.STORAGE_KEYS.NOTIFICATIONS, data);
      }
    });

    return () => {
      unsubEvents();
      unsubEmployees();
      unsubTasks();
      unsubTributes();
      unsubNotifs();
    };
  }, []);

  // Main active tab (Mobile First: Default 'home' dashboard)
  const [activeTab, setActiveTab] = useState<MainAppTab>('home');
  const [calendarViewMode, setCalendarViewMode] = useState<'grid' | 'agenda' | 'kanban' | 'list'>('grid');

  // Modal states for marketing
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal states for birthdays & employees
  const [selectedBirthdayEmployee, setSelectedBirthdayEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEmployeeEditModalOpen, setIsEmployeeEditModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    period: 'HISTORICO_2026',
    year: '2026',
    month: 'TODOS',
    category: 'TODAS',
    campaign: 'TODAS',
    format: 'TODOS',
    funnelStage: 'TODAS',
    status: 'TODOS',
    contentType: 'TODOS',
    onlyHolidays: false,
    temporal: 'TODAS',
    responsible: 'TODOS',
  });

  // Next upcoming active event strictly after today
  const nextEventDate = useMemo(() => {
    return findNextEventDate(items.map((i) => i.date), currentToday);
  }, [items, currentToday]);

  // Persist items (local state & storage cache only)
  const updateItems = (newItems: ContentItem[]) => {
    setItems(newItems);
    storageService.save(storageService.STORAGE_KEYS.CONTENT_ITEMS, newItems);
  };

  // Persist employees (local state & storage cache only)
  const updateEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    storageService.save(storageService.STORAGE_KEYS.EMPLOYEES, newEmployees);
  };

  // Persist tributes (local state & storage cache only)
  const updateTributes = (newTributes: BirthdayTribute[]) => {
    setTributes(newTributes);
    storageService.save(storageService.STORAGE_KEYS.TRIBUTES, newTributes);
  };

  // Persist tasks (local state & storage cache only)
  const updateTasks = (newTasks: TeamTask[]) => {
    setTasks(newTasks);
    storageService.save(storageService.STORAGE_KEYS.TASKS, newTasks);
  };

  // Persist notifications (local state & storage cache only)
  const updateNotifications = (newNotifs: AppNotification[]) => {
    setNotifications(newNotifs);
    storageService.save(storageService.STORAGE_KEYS.NOTIFICATIONS, newNotifs);
  };

  // Auth User change & clean logout
  const handleSetUser = (user: AppUser | null) => {
    setCurrentUser(user);
    storageService.save(storageService.STORAGE_KEYS.AUTH_USER, user);
  };

  const handleLogout = async () => {
    if (isFirebaseConfigured()) {
      try {
        await firebaseAuthService.logout();
      } catch (err) {
        console.warn('Logout error:', err);
      }
    }
    handleSetUser(null);
  };

  // Tasks actions (Granular Firestore atomic writes)
  const handleToggleTask = (taskId: string) => {
    let modifiedTask: TeamTask | null = null;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus: TeamTask['status'] = t.status === 'CONCLUIDA' ? 'PENDENTE' : 'CONCLUIDA';
        const updatedT: TeamTask = {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'CONCLUIDA' ? new Date().toISOString() : undefined,
        };
        modifiedTask = updatedT;
        return updatedT;
      }
      return t;
    });
    updateTasks(updated);
    if (modifiedTask && isFirebaseConfigured()) {
      firestoreSyncService.saveItem('tasks', modifiedTask);
    }
  };

  const handleToggleChecklistItem = (taskId: string, itemId: string) => {
    let modifiedTask: TeamTask | null = null;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextChecklist = t.checklist.map((item) => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const updatedT: TeamTask = { ...t, checklist: nextChecklist };
        modifiedTask = updatedT;
        return updatedT;
      }
      return t;
    });
    updateTasks(updated);
    if (modifiedTask && isFirebaseConfigured()) {
      firestoreSyncService.saveItem('tasks', modifiedTask);
    }
  };

  const handleAddTask = (newTaskData: Omit<TeamTask, 'id' | 'createdAt'>) => {
    const newTask: TeamTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    updateTasks([newTask, ...tasks]);

    // Create companion notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'TAREFA_ATRIBUIDA',
      title: 'Nova tarefa registrada',
      message: `${newTask.title} atribuída a ${newTask.assignedTo}.`,
      date: new Date().toISOString().slice(0, 10),
      read: false,
      targetTab: 'home',
      targetId: newTask.id,
      createdAt: new Date().toISOString(),
    };
    updateNotifications([newNotif, ...notifications]);

    // Atomic write to Firestore
    if (isFirebaseConfigured()) {
      firestoreSyncService.saveItem('tasks', newTask);
      firestoreSyncService.saveItem('notifications', newNotif);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    updateTasks(updated);
    if (isFirebaseConfigured()) {
      firestoreSyncService.deleteItem('tasks', taskId);
    }
  };

  // Notifications actions (Granular Firestore atomic writes)
  const handleMarkNotificationAsRead = (id: string) => {
    let modifiedNotif: AppNotification | null = null;
    const updated = notifications.map((n) => {
      if (n.id === id) {
        const updatedN = { ...n, read: true };
        modifiedNotif = updatedN;
        return updatedN;
      }
      return n;
    });
    updateNotifications(updated);
    if (modifiedNotif && isFirebaseConfigured()) {
      firestoreSyncService.saveItem('notifications', modifiedNotif);
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    updateNotifications(updated);
    if (isFirebaseConfigured()) {
      updated.forEach((n) => {
        firestoreSyncService.saveItem('notifications', n);
      });
    }
  };

  const handleSelectNotification = (notif: AppNotification) => {
    handleMarkNotificationAsRead(notif.id);
    if (notif.targetTab) {
      setActiveTab(notif.targetTab);
    }
  };

  // Employee actions (Granular Firestore atomic writes)
  const handleSaveEmployee = (emp: Employee) => {
    const exists = employees.some((e) => e.id === emp.id);
    let updated: Employee[];
    if (exists) {
      updated = employees.map((e) => (e.id === emp.id ? emp : e));
    } else {
      updated = [...employees, emp];
    }
    updateEmployees(updated);
    if (isFirebaseConfigured()) {
      firestoreSyncService.saveItem('employees', emp);
    }
  };

  const handleToggleEmployeeStatus = (id: string) => {
    let modifiedEmp: Employee | null = null;
    const updated = employees.map((e) => {
      if (e.id === id) {
        const updatedE = {
          ...e,
          status: e.status === 'ATIVO' ? ('DESLIGADO' as const) : ('ATIVO' as const),
        };
        modifiedEmp = updatedE;
        return updatedE;
      }
      return e;
    });
    updateEmployees(updated);
    if (modifiedEmp && isFirebaseConfigured()) {
      firestoreSyncService.saveItem('employees', modifiedEmp);
    }
  };

  const handleSaveTribute = (trib: BirthdayTribute) => {
    const exists = tributes.some((t) => t.id === trib.id);
    let updated: BirthdayTribute[];
    if (exists) {
      updated = tributes.map((t) => (t.id === trib.id ? trib : t));
    } else {
      updated = [...tributes, trib];
    }
    updateTributes(updated);
    if (isFirebaseConfigured()) {
      firestoreSyncService.saveItem('tributes', trib);
    }
  };

  // Marketing actions (Granular Firestore atomic writes)
  const handleUpdateStatus = (id: string, newStatus: ContentStatus) => {
    let modifiedItem: ContentItem | null = null;
    const updated = items.map((i) => {
      if (i.id === id) {
        const itemUpdated = { ...i, status: newStatus };
        modifiedItem = itemUpdated;
        return itemUpdated;
      }
      return i;
    });
    updateItems(updated);
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, status: newStatus });
    }
    if (modifiedItem && isFirebaseConfigured()) {
      firestoreSyncService.saveItem('events', modifiedItem);
    }
  };

  const handleSaveItem = (item: ContentItem) => {
    const exists = items.some((i) => i.id === item.id);
    let updated: ContentItem[];
    if (exists) {
      updated = items.map((i) => (i.id === item.id ? item : i));
    } else {
      updated = [item, ...items].sort((a, b) => a.date.localeCompare(b.date));
    }
    updateItems(updated);
    if (selectedItem?.id === item.id) {
      setSelectedItem(item);
    }
    if (isFirebaseConfigured()) {
      firestoreSyncService.saveItem('events', item);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const updated = items.filter((i) => i.id !== itemId);
    updateItems(updated);
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
    if (isFirebaseConfigured()) {
      firestoreSyncService.deleteItem('events', itemId);
    }
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const backupJson = storageService.exportBackup({
      items,
      employees,
      tributes,
      tasks,
      notifications,
    });
    storageService.downloadBackupFile(backupJson);
  };

  const handleImportBackup = (backupJson: string) => {
    const parsed = storageService.parseBackup(backupJson);
    if (Array.isArray(parsed.items)) updateItems(parsed.items);
    if (Array.isArray(parsed.employees)) updateEmployees(parsed.employees);
    if (Array.isArray(parsed.tributes)) updateTributes(parsed.tributes);
    if (Array.isArray(parsed.tasks)) updateTasks(parsed.tasks);
    if (Array.isArray(parsed.notifications)) updateNotifications(parsed.notifications);
  };

  // Birthday alerts count
  const birthdayAlerts = useMemo(() => {
    const [y, m, d] = currentToday.split('-').map(Number);
    const ref = new Date(y, m - 1, d);
    return getBirthdayAlerts(employees, tributes, ref);
  }, [employees, tributes, currentToday]);

  // Next upcoming employee birthday for dashboard
  const nextEmployeeBirthday = useMemo(() => {
    const active = employees.filter((e) => e.status === 'ATIVO');
    if (active.length === 0) return null;
    const [y, m, d] = currentToday.split('-').map(Number);
    const ref = new Date(y, m - 1, d);
    const sorted = [...active].map((e) => ({
      employee: e,
      daysUntil: getDaysUntilBirthday(e.birthDate, ref),
    })).sort((a, b) => a.daysUntil - b.daysUntil);
    return sorted[0] || null;
  }, [employees, currentToday]);

  // Campaign options for filter dropdown
  const campaignOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.campaign) set.add(item.campaign);
    }
    return Array.from(set).sort();
  }, [items]);

  // Distinct responsibles for filtering
  const responsibleOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.responsible) set.add(item.responsible);
    }
    return Array.from(set).sort();
  }, [items]);

  // Temporal metrics and counts across all items
  const temporalCounts = useMemo(() => {
    let todayCount = 0;
    let nextCount = 0;
    let pastCount = 0;
    let futureCount = 0;
    let pendingPastCount = 0;

    for (const item of items) {
      const status = getEventTemporalStatus(item.date, item.endDate, currentToday, nextEventDate);
      if (status === 'HOJE') todayCount++;
      else if (status === 'PROXIMO') {
        nextCount++;
        futureCount++;
      } else if (status === 'PASSADA') {
        pastCount++;
        if (item.status !== 'PUBLICADO') pendingPastCount++;
      } else if (status === 'FUTURA') {
        futureCount++;
      }
    }

    return {
      today: todayCount,
      next: nextCount,
      past: pastCount,
      future: futureCount,
      pendingPast: pendingPastCount,
    };
  }, [items, currentToday, nextEventDate]);

  // Indicadores de Resumo do Período Selecionado (Prompt 8: total, publicadas, pendentes, atrasadas, feriados, aniversários)
  const periodSummaryMetrics = useMemo(() => {
    const periodItems = items.filter((item) => {
      if (filters.period === 'HISTORICO_2026' && item.date > '2026-12-31') return false;
      if (filters.period === 'PLANEJAMENTO_2027' && (item.date < '2027-01-01' || item.date > '2027-12-31')) return false;
      if (filters.period === 'FUTUROS' && item.date < '2028-01-01') return false;
      if (filters.year !== 'TODOS' && !item.date.startsWith(filters.year)) return false;
      return true;
    });

    let published = 0;
    let pending = 0;
    let overdue = 0;
    let holidays = 0;

    for (const it of periodItems) {
      if (it.holiday) holidays++;
      if (it.status === 'PUBLICADO') {
        published++;
      } else {
        const isPastDate = it.date < currentToday;
        if (isPastDate) {
          overdue++;
        } else {
          pending++;
        }
      }
    }

    const activeEmps = employees.filter((e) => e.status === 'ATIVO');

    return {
      total: periodItems.length,
      published,
      pending,
      overdue,
      holidays,
      birthdays: activeEmps.length,
    };
  }, [items, filters.period, filters.year, currentToday, employees]);

  // Filtered Items (incorporating Rule 11 filters: past, today, future, pending past, plus all 12 months, periods, categories and responsibles)
  const filteredItems = useMemo(() => {
    const MONTH_NAME_MAP: Record<string, string> = {
      JANEIRO: 'Janeiro',
      FEVEREIRO: 'Fevereiro',
      MARÇO: 'Março',
      ABRIL: 'Abril',
      MAIO: 'Maio',
      JUNHO: 'Junho',
      JULHO: 'Julho',
      AGOSTO: 'Agosto',
      SETEMBRO: 'Setembro',
      OUTUBRO: 'Outubro',
      NOVEMBRO: 'Novembro',
      DEZEMBRO: 'Dezembro',
    };

    return items.filter((item) => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTheme = item.theme.toLowerCase().includes(query);
        const matchCaption = item.caption.toLowerCase().includes(query);
        const matchHoliday = item.holiday?.toLowerCase().includes(query);
        const matchNotes = item.notes?.toLowerCase().includes(query);
        const matchDate = item.date.includes(query);
        const matchCategory = item.category?.toLowerCase().includes(query);
        const matchResp = item.responsible?.toLowerCase().includes(query);
        if (!matchTheme && !matchCaption && !matchHoliday && !matchNotes && !matchDate && !matchCategory && !matchResp) {
          return false;
        }
      }

      // Period Filter (Prompt 1 & 8)
      if (filters.period !== 'TODOS') {
        if (filters.period === 'HISTORICO_2026') {
          if (item.date > '2026-12-31') return false;
        } else if (filters.period === 'PLANEJAMENTO_2027') {
          if (item.date < '2027-01-01' || item.date > '2027-12-31') return false;
        } else if (filters.period === 'FUTUROS') {
          if (item.date < '2028-01-01') return false;
        }
      }

      // Year Filter
      if (filters.year !== 'TODOS') {
        if (!item.date.startsWith(filters.year)) return false;
      }

      // Month Filter (All 12 Months)
      if (filters.month !== 'TODOS') {
        const expectedMonth = MONTH_NAME_MAP[filters.month];
        if (expectedMonth && item.month !== expectedMonth) return false;
      }

      // Category Filter (Prompt 4 & 8)
      if (filters.category !== 'TODAS' && item.category !== filters.category) {
        return false;
      }

      // Responsible Filter (Prompt 8)
      if (filters.responsible && filters.responsible !== 'TODOS') {
        if (!item.responsible || !item.responsible.toLowerCase().includes(filters.responsible.toLowerCase())) {
          return false;
        }
      }

      // Campaign
      if (filters.campaign !== 'TODAS' && item.campaign !== filters.campaign) {
        return false;
      }

      // Format
      if (filters.format !== 'TODOS' && item.format !== filters.format) {
        return false;
      }

      // Funnel Stage
      if (filters.funnelStage !== 'TODAS' && item.funnelStage !== filters.funnelStage) {
        return false;
      }

      // Status
      if (filters.status !== 'TODOS' && item.status !== filters.status) {
        return false;
      }

      // Content Type
      if (filters.contentType !== 'TODOS' && item.contentType !== filters.contentType) {
        return false;
      }

      // Only Holidays
      if (filters.onlyHolidays && !item.holiday) {
        return false;
      }

      // Temporal Filter (Regra 11)
      if (filters.temporal && filters.temporal !== 'TODAS') {
        const temporalStatus = getEventTemporalStatus(item.date, item.endDate, currentToday, nextEventDate);
        if (filters.temporal === 'HOJE' && temporalStatus !== 'HOJE') return false;
        if (filters.temporal === 'PROXIMO' && temporalStatus !== 'PROXIMO') return false;
        if (filters.temporal === 'PASSADAS' && temporalStatus !== 'PASSADA') return false;
        if (filters.temporal === 'FUTURAS' && (temporalStatus === 'PASSADA' || temporalStatus === 'HOJE')) return false;
        if (filters.temporal === 'PENDENTES_PASSADAS' && (temporalStatus !== 'PASSADA' || item.status === 'PUBLICADO')) return false;
        if (filters.temporal === 'CONCLUIDAS' && item.status !== 'PUBLICADO') return false;
      }

      return true;
    });
  }, [items, filters, currentToday, nextEventDate]);

  // KPIs & Milestones
  const kpis = useMemo(() => calculateKPIs(items), [items]);
  const milestones = useMemo(() => getNextMilestones(items, currentToday), [items, currentToday]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Data',
      'Dia da Semana',
      'Mes',
      'Data Comemorativa',
      'Campanha',
      'Tema',
      'Formato',
      'Objetivo',
      'Etapa do Funil',
      'Tipo de Conteudo',
      'Horario Sugerido',
      'Status',
      'CTA',
      'Legenda Sugerida',
      'Observacoes',
    ];

    const escapeCsv = (val: string | null | undefined) => {
      if (!val) return '""';
      const clean = val.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = items.map((i) => [
      escapeCsv(i.date),
      escapeCsv(i.dayOfWeek),
      escapeCsv(i.month),
      escapeCsv(i.holiday),
      escapeCsv(i.campaign),
      escapeCsv(i.theme),
      escapeCsv(i.format),
      escapeCsv(i.objective),
      escapeCsv(i.funnelStage),
      escapeCsv(i.contentType),
      escapeCsv(i.suggestedTime),
      escapeCsv(i.status),
      escapeCsv(i.cta),
      escapeCsv(i.caption),
      escapeCsv(i.notes),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `planejamento-marketing-nowtech-solar-${currentToday}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingTasksCount = useMemo(() => {
    return tasks.filter((t) => t.status !== 'CONCLUIDA').length;
  }, [tasks]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // If user is not logged in, render dedicated team login screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleSetUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Offline Status Float Indicator */}
      <OfflineIndicator />

      {/* Main Responsive Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewModal={() => {
          setEditingItem(null);
          setIsEditModalOpen(true);
        }}
        onExport={handleExportCSV}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        totalItems={items.length}
        upcomingBirthdaysCount={birthdayAlerts.length}
      />

      {/* Main Container - pb-24 on mobile ensures bottom tab bar doesn't cover content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 pb-28 md:pb-10">
        
        {/* TAB 0: HOME / INÍCIO — PAINEL DO COLABORADOR */}
        {activeTab === 'home' && (
          <HomeDashboardView
            currentUser={currentUser}
            todayStr={currentToday}
            items={items}
            employees={employees}
            tributes={tributes}
            onNavigateTab={setActiveTab}
            onSelectContent={(item) => setSelectedItem(item)}
            onSelectEmployee={(emp) => setSelectedBirthdayEmployee(emp)}
          />
        )}

        {/* TAB 1: CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* View Mode Switcher Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setCalendarViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap min-h-[36px] ${
                    calendarViewMode === 'grid'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Mês (Grid)</span>
                </button>

                <button
                  onClick={() => setCalendarViewMode('agenda')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap min-h-[36px] ${
                    calendarViewMode === 'agenda'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Feed / Agenda Diária</span>
                </button>

                <button
                  onClick={() => setCalendarViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap min-h-[36px] ${
                    calendarViewMode === 'kanban'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>

                <button
                  onClick={() => setCalendarViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap min-h-[36px] ${
                    calendarViewMode === 'list'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Lista Tabular</span>
                </button>
              </div>

              {/* Status info */}
              <div className="text-xs text-slate-400 flex items-center justify-between sm:justify-end gap-2">
                <span>Exibindo: <strong className="text-white font-mono">{filteredItems.length}</strong> de {items.length} postagens</span>
              </div>
            </div>

            {/* Filter Bar with Temporal Status Filter */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              campaignOptions={campaignOptions}
              responsibleOptions={responsibleOptions}
              summaryMetrics={periodSummaryMetrics}
              totalMatches={filteredItems.length}
              totalTotal={items.length}
              onOpenBirthdays={() => setActiveTab('birthdays')}
              temporalCounts={temporalCounts}
            />

            {/* Active View Mode Component */}
            {calendarViewMode === 'grid' && (
              <CalendarGridView
                items={filteredItems}
                employees={employees}
                tributes={tributes}
                selectedMonth={filters.month}
                selectedYear={filters.year}
                todayStr={currentToday}
                nextEventDate={nextEventDate}
                onSelectContent={(item) => setSelectedItem(item)}
                onSelectEmployeeBirthday={(emp) => setSelectedBirthdayEmployee(emp)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {calendarViewMode === 'agenda' && (
              <CalendarAgendaView
                items={filteredItems}
                employees={employees}
                todayStr={currentToday}
                nextEventDate={nextEventDate}
                onSelectContent={(item) => setSelectedItem(item)}
                onSelectEmployeeBirthday={(emp) => setSelectedBirthdayEmployee(emp)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {calendarViewMode === 'kanban' && (
              <KanbanView
                items={filteredItems}
                todayStr={currentToday}
                nextEventDate={nextEventDate}
                onSelectContent={(item) => setSelectedItem(item)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {calendarViewMode === 'list' && (
              <ContentListView
                items={filteredItems}
                employees={employees}
                todayStr={currentToday}
                nextEventDate={nextEventDate}
                onSelectContent={(item) => setSelectedItem(item)}
                onSelectEmployeeBirthday={(emp) => setSelectedBirthdayEmployee(emp)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        )}

        {/* TAB 2: TEAM BIRTHDAYS HUB */}
        {activeTab === 'birthdays' && (
          <BirthdayHubView
            employees={employees}
            tributes={tributes}
            todayStr={currentToday}
            currentYear={filters.year === '2026' ? 2026 : 2027}
            isAdmin={currentUser.userRole === 'ADMIN'}
            onOpenTributeModal={(emp) => setSelectedBirthdayEmployee(emp)}
            onOpenNewEmployeeModal={() => {
              setEditingEmployee(null);
              setIsEmployeeEditModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeEditModalOpen(true);
            }}
            onToggleEmployeeStatus={handleToggleEmployeeStatus}
          />
        )}

        {/* TAB 3: PROFILE VIEW */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchUser={handleSetUser}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            isPWAInstalled={isInstalled}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}

        {/* TAB 4: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <DashboardKpiView
            kpis={kpis}
            milestones={milestones}
            nextEmployeeBirthday={nextEmployeeBirthday}
            todayStr={currentToday}
            temporalMetrics={{
              pastCount: temporalCounts.past,
              todayCount: temporalCounts.today,
              futureCount: temporalCounts.future,
              pendingPastCount: temporalCounts.pendingPast,
            }}
            onSelectContent={(item) => setSelectedItem(item)}
            onSelectBirthday={(emp) => setSelectedBirthdayEmployee(emp)}
            onNavigateToCalendar={() => setActiveTab('calendar')}
            onNavigateToBirthdays={() => setActiveTab('birthdays')}
          />
        )}

        {/* TAB 5: STORIES STRATEGY VIEW */}
        {activeTab === 'stories' && <StoriesStrategyView />}

        {/* TAB 6: WHATSAPP HUB VIEW */}
        {activeTab === 'whatsapp' && <WhatsAppHubView />}

        {/* TAB 7: SOLAR CALCULATOR VIEW */}
        {activeTab === 'calculator' && <SolarCalculatorView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-7 px-4 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NowTechLogo size="sm" variant="compact" />
            <span className="text-slate-500">|</span>
            <span className="font-semibold text-slate-300">NowTech Solar Fotovoltaica</span>
            <span>· Pernambuco & Nordeste</span>
          </div>
          <div className="text-slate-400 text-center md:text-right">
            Aplicativo de Gestão Interna & Marketing · Equipe NowTech Solar
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        upcomingBirthdaysCount={birthdayAlerts.length}
      />

      {/* Marketing Detail Modal */}
      {selectedItem && (
        <ContentDetailModal
          item={selectedItem}
          isAdmin={currentUser.userRole === 'ADMIN'}
          onClose={() => setSelectedItem(null)}
          onEdit={(item) => {
            setEditingItem(item);
            setIsEditModalOpen(true);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Marketing Edit / Create Modal */}
      <ContentEditModal
        initialItem={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
      />

      {/* Birthday Tribute Planning Modal */}
      {selectedBirthdayEmployee && (
        <BirthdayTributeModal
          employee={selectedBirthdayEmployee}
          existingTribute={tributes.find((t) => t.employeeId === selectedBirthdayEmployee.id && t.year === (filters.year === '2026' ? 2026 : 2027))}
          currentYear={filters.year === '2026' ? 2026 : 2027}
          showAge={true}
          isOpen={Boolean(selectedBirthdayEmployee)}
          onClose={() => setSelectedBirthdayEmployee(null)}
          onSave={handleSaveTribute}
        />
      )}

      {/* Employee Edit / Register Modal */}
      <EmployeeEditModal
        initialEmployee={editingEmployee}
        isOpen={isEmployeeEditModalOpen}
        onClose={() => {
          setIsEmployeeEditModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
      />

      {/* Notifications Modal Center */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isIOS={isIOS}
        onInstallAndroid={install}
        canInstallDirect={isInstallable}
      />
    </div>
  );
}
