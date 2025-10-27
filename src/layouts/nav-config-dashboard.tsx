import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

/**
 * Input nav data is an array of navigation section items used to define the structure and content of a navigation bar.
 * Each section contains a subheader and an array of items, which can include nested children items.
 *
 * Each item can have the following properties:
 * - `title`: The title of the navigation item.
 * - `path`: The URL path the item links to.
 * - `icon`: An optional icon component to display alongside the title.
 * - `info`: Optional additional information to display, such as a label.
 * - `allowedRoles`: An optional array of roles that are allowed to see the item.
 * - `caption`: An optional caption to display below the title.
 * - `children`: An optional array of nested navigation items.
 * - `disabled`: An optional boolean to disable the item.
 */
export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    items: [
      { title: 'Tổng quan', path: paths.dashboard.root, icon: ICONS.dashboard },
      // { title: 'Ecommerce', path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      // { title: 'Banking', path: paths.dashboard.general.banking, icon: ICONS.banking },
      // { title: 'Booking', path: paths.dashboard.general.booking, icon: ICONS.booking },
      // { title: 'File', path: paths.dashboard.general.file, icon: ICONS.file },
      // { title: 'Course', path: paths.dashboard.general.course, icon: ICONS.course },
    ],
  },
  /**
   * Management
   */
  {
    items: [
      {
        title: 'Nghiệp vụ khách hàng',
        path: paths.dashboard.customerServices.contract,
        icon: <Iconify icon={'lsicon:contract-filled'} />,
        children: [
          {
            title: 'Báo giá',
            path: paths.dashboard.customerServices.quotation,
            icon: <Iconify icon={'streamline-cyber-color:megaphone-1'} />,
          },
          {
            title: 'Hợp đồng',
            path: paths.dashboard.customerServices.contract,
            icon: <Iconify icon={'streamline-cyber-color:new-document-layer'} />
          }
        ]
      },
    ]
  },
  {
    items: [
      {
        title: 'Quản lý danh mục',
        path: paths.dashboard.product.root,
        icon: <Iconify icon={'material-symbols:category-rounded'} />,
        children: [
          { title: 'Nhóm sản phẩm', path: paths.dashboard.category.root, icon: <Iconify icon={'streamline-cyber-color:package-stack-2'} /> },
          { title: 'Sản phẩm', path: paths.dashboard.product.root, icon: <Iconify icon={'streamline-cyber-color:shopping-product'} /> },
          {
            title: 'Đơn vị tính',
            path: paths.dashboard.unit,
            icon: <Iconify icon={'streamline-cyber-color:coin-stack'} />
          },
          { title: 'Khách hàng', path: paths.dashboard.customer.root, icon: <Iconify icon={'streamline-cyber-color:businessman'} /> },
          {
            title: 'Phòng ban',
            path: paths.dashboard.department,
            icon: <Iconify icon={'streamline-cyber-color:hierarchy-business-2'} />
          },
          {
            title: 'Chức vụ',
            path: paths.dashboard.employeeType,
            icon: <Iconify icon={'streamline-cyber-color:business-pick-user'} />
          },
          { title: 'Nhân viên', path: paths.dashboard.employees.root, icon: <Iconify icon={'streamline-cyber-color:account-group'} /> },
          { title: 'Nhà cung cấp', path: paths.dashboard.suppliers.root, icon: <Iconify icon={'streamline-cyber-color:business-handshake-deal'} /> },
          { title: 'Tài khoản ngân hàng', path: paths.dashboard.general.banking, icon: <Iconify icon={'streamline-cyber-color:bank-1'} /> },
        ],
      },
      {
        title: 'Quản lý nội bộ',
        path: paths.dashboard.user.root,
        icon: <Iconify icon={'carbon:id-management'} />,
        children: [
          {
            title: 'Phiếu thu', path: paths.dashboard.receipt.root, icon: <Iconify icon={'streamline-cyber-color:piggy-bank'} />
          },
          // { 
          //   title: 'Phiếu chi', path: paths.dashboard.order.root, icon: <Iconify icon={'streamline-cyber-color:bank-notes-stack'} />
          //  },
        ],
      },
      // {
      //   title: 'Thu chi',
      //   path: paths.dashboard.order.root,
      //   icon: ICONS.invoice,
      //   children: [
      //     { title: 'Phiếu thu', path: paths.dashboard.invoice.root, icon: <Iconify icon={'streamline-cyber-color:piggy-bank'} /> },
      //     { title: 'Phiếu chi', path: paths.dashboard.order.root, icon: <Iconify icon={'streamline-cyber-color:bank-notes-stack'} /> },
      //   ],
      // },
      // {
      //   title: 'Blog',
      //   path: paths.dashboard.post.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'List', path: paths.dashboard.post.root },
      //     { title: 'Details', path: paths.dashboard.post.demo.details },
      //     { title: 'Create', path: paths.dashboard.post.new },
      //     { title: 'Edit', path: paths.dashboard.post.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Job',
      //   path: paths.dashboard.job.root,
      //   icon: ICONS.job,
      //   children: [
      //     { title: 'List', path: paths.dashboard.job.root },
      //     { title: 'Details', path: paths.dashboard.job.demo.details },
      //     { title: 'Create', path: paths.dashboard.job.new },
      //     { title: 'Edit', path: paths.dashboard.job.demo.edit },
      //   ],
      // },
      // {
      //   title: 'Tour',
      //   path: paths.dashboard.tour.root,
      //   icon: ICONS.tour,
      //   children: [
      //     { title: 'List', path: paths.dashboard.tour.root },
      //     { title: 'Details', path: paths.dashboard.tour.demo.details },
      //     { title: 'Create', path: paths.dashboard.tour.new },
      //     { title: 'Edit', path: paths.dashboard.tour.demo.edit },
      //   ],
      // },
      // { title: 'File manager', path: paths.dashboard.fileManager, icon: ICONS.folder },
      // {
      //   title: 'Mail',
      //   path: paths.dashboard.mail,
      //   icon: ICONS.mail,
      //   info: (
      //     <Label color="error" variant="inverted">
      //       +32
      //     </Label>
      //   ),
      // },
      // { title: 'Chat', path: paths.dashboard.chat, icon: ICONS.chat },
      // { title: 'Calendar', path: paths.dashboard.calendar, icon: ICONS.calendar },
      // { title: 'Kanban', path: paths.dashboard.kanban, icon: ICONS.kanban },
    ],
  },
  {
    items: [
      {
        title: 'Cài đặt',
        path: paths.dashboard.settings.root,
        icon: <Iconify icon={'uil:setting'} />,
        disabled: true,
        info: (
          <Label
            color="info"
            variant="inverted"
            startIcon={<Iconify icon="maki:construction" />}
          >
            Đang phát triển
          </Label>
        ),
      },
    ]
  },
  /**
   * Item state
   */
  // {
  //   subheader: 'Misc',
  //   items: [
  //     {
  //       title: 'Permission',
  //       path: paths.dashboard.permission,
  //       icon: ICONS.lock,
  //       allowedRoles: ['admin', 'manager'],
  //       caption: 'Only admin can see this item.',
  //     },
  //     {
  //       title: 'Level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'Level 1a',
  //           path: '#/dashboard/menu_level/menu_level_1a',
  //           children: [
  //             { title: 'Level 2a', path: '#/dashboard/menu_level/menu_level_1a/menu_level_2a' },
  //             {
  //               title: 'Level 2b',
  //               path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b',
  //               children: [
  //                 {
  //                   title: 'Level 3a',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3a',
  //                 },
  //                 {
  //                   title: 'Level 3b',
  //                   path: '#/dashboard/menu_level/menu_level_1a/menu_level_2b/menu_level_3b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         { title: 'Level 1b', path: '#/dashboard/menu_level/menu_level_1b' },
  //       ],
  //     },
  //     {
  //       title: 'Disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },
  //     {
  //       title: 'Label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label
  //           color="info"
  //           variant="inverted"
  //           startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
  //         >
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'Caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'Params',
  //       path: '/dashboard/params?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
  //       icon: ICONS.parameter,
  //     },
  //     {
  //       title: 'External link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //       info: <Iconify width={18} icon="eva:external-link-fill" />,
  //     },
  //     { title: 'Blank', path: paths.dashboard.blank, icon: ICONS.blank },
  //   ],
  // },
];
