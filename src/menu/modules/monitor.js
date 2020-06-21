export default {
  path: '/monitor',
  title: '数据监测',
  icon: 'flask',
  children: (pre => [{
      path: `${pre}index`,
      title: '监测数据',
      icon: 'home'
    },
    {
      path: `${pre}rule`,
      title: '监测黑名单管理',
      iconSvg: 'd2-admin'
    },
    {
      path: `${pre}port`,
      title: '端口主动发现',
      iconSvg: 'd2-admin'
    },
    {
      path: `${pre}hl7`,
      title: 'HL7传输监测',
      iconSvg: 'd2-admin'
    },
    {
      path: `${pre}dicom`,
      title: 'DICOM传输监测',
      iconSvg: 'd2-admin'
    },
    {
      path: `${pre}astm`,
      title: 'ASTM传输监测',
      iconSvg: 'd2-admin'
    }
  ])('/monitor/')
}
