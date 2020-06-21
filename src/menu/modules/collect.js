export default {
  path: '/collect',
  title: '医疗数据采集',
  icon: 'flask',
  children: (pre => [{
      path: `${pre}index`,
      title: '医疗数据采集',
      icon: 'home'
    },
    {
      path: `${pre}manager`,
      title: '采集数据管理',
      iconSvg: 'd2-admin',
    },
    {
      path: `${pre}position`,
      title: 'IP地址定位',
      icon: 'bolt'
    },
    {
      path: `${pre}hl7`,
      title: 'HL7采集数据管理',
      icon: 'folder-o',
    },
    {
        path: `${pre}dicom`,
        title: 'DICOM采集数据管理',
        icon: 'folder-o'
    },
    {
        path: `${pre}astm`,
        title: 'ASTM采集数据管理',
        icon: 'folder-o'
    }
    
  ])('/collect/')
}
