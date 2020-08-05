export default {
  path: '/collect',
  title: '医疗数据采集',
  iconSvg: 'collect',
  children: (pre => [{
      path: `${pre}index`,
      title: '医疗数据采集',
      icon: 'area-chart'
    },
    {
      path: `${pre}manager`,
      title: '采集数据管理',
      iconSvg: 'config',
    },
    {
      path: `${pre}position`,
      title: 'IP地址定位',
      iconSvg: 'place',
    },
    {
      path: `${pre}hl7`,
      title: 'HL7采集数据管理',
      iconSvg: 'hl7',
    },
    {
        path: `${pre}dicom`,
        title: 'DICOM采集数据管理',
        iconSvg: 'DICOM',
    },
    {
        path: `${pre}astm`,
        title: 'ASTM采集数据管理',
        iconSvg: 'ASTM',
    }
    
  ])('/collect/')
}
