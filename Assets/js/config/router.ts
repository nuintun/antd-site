import loadable from '@loadable/component';
import { Route } from '~js/utils/getRouter';

const router: Route[] = [
  {
    name: '首页',
    path: '/',
    hideInMenu: true,
    component: loadable(() => import('~js/pages/home/index.tsx')),
    children: [
      {
        name: '登录',
        path: 'login',
        skipLayout: true,
        component: loadable(() => import('~js/pages/login/index.tsx'))
      },
      // 错误页
      {
        name: '403',
        path: '403',
        skipLayout: true,
        component: loadable(() => import('~js/pages/403.tsx'))
      },
      {
        name: '404',
        path: '404',
        skipLayout: true,
        component: loadable(() => import('~js/pages/404.tsx'))
      },
      {
        name: '500',
        path: '500',
        skipLayout: true,
        component: loadable(() => import('~js/pages/500.tsx'))
      }
    ]
  },
  {
    name: '考试管理',
    path: '/examination',
    icon: require('~images/menu/examination.svg'),
    children: [
      {
        name: '考试预约',
        path: 'schedules',
        icon: require('~images/menu/examination-schedules.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      },
      {
        name: '成绩确认',
        path: 'achievements',
        icon: require('~images/menu/examination-achievements.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      },
      {
        name: '预约提醒',
        path: 'notification',
        icon: require('~images/menu/examination-notification.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      }
    ]
  },
  {
    name: '统计报表',
    path: '/dashboard',
    icon: require('~images/menu/dashboard.svg'),
    children: [
      {
        name: '考试报表',
        hideChildrenInMenu: true,
        href: 'examinations/car',
        path: 'examinations/:type',
        icon: require('~images/menu/dashboard-examinations.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx')),
        children: [
          {
            name: '小车报表',
            path: '/dashboard/examinations/car',
            icon: require('~images/car.svg')
          },
          {
            name: '大车报表',
            path: '/dashboard/examinations/truck',
            icon: require('~images/truck.svg')
          }
        ]
      },
      {
        name: '绩效报表',
        hideChildrenInMenu: true,
        href: 'performances/car',
        path: 'performances/:type',
        icon: require('~images/menu/dashboard-performances.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx')),
        children: [
          {
            name: '小车报表',
            path: '/dashboard/performances/car',
            icon: require('~images/car.svg')
          },
          {
            name: '大车报表',
            path: '/dashboard/performances/truck',
            icon: require('~images/truck.svg')
          }
        ]
      }
    ]
  },
  {
    name: '信息管理',
    path: '/information',
    icon: require('~images/menu/information.svg'),
    children: [
      {
        name: '学员管理',
        path: 'students',
        icon: require('~images/menu/information-students.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      },
      {
        name: '开票管理',
        path: 'invoices',
        icon: require('~images/menu/information-invoices.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      },
      {
        name: '教练管理',
        path: 'coaches',
        icon: require('~images/menu/information-coaches.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      },
      {
        name: '驾校管理',
        path: 'schools',
        icon: require('~images/menu/information-schools.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      }
    ]
  },
  {
    name: '系统管理',
    path: '/system',
    icon: require('~images/menu/system.svg'),
    children: [
      {
        name: '账号管理',
        path: 'users',
        icon: require('~images/menu/system-users.svg'),
        component: loadable(() => import('~js/pages/home/index.tsx'))
      }
    ]
  }
];

export default router;
