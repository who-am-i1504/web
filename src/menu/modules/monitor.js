export default {
  path: '/monitor',
  title: '数据监测',
  iconSvg: 'monitor',
  children: (pre => [{
      path: `${pre}index`,
      title: '疑似数据泄露',
      iconSvg: 'graph'
    },
    {
      path: `${pre}rule`,
      title: '监测黑名单管理',
      iconSvg: 'black'
    },
    {
      path: `${pre}port`,
      title: '端口主动发现',
      icon: 'eye'
    },
    {
      path: `${pre}hl7`,
      title: 'HL7传输监测',
      iconSvg: 'hl7'
    },
    {
      path: `${pre}dicom`,
      title: 'DICOM传输监测',
      iconSvg: 'DICOM'
    },
    {
      path: `${pre}astm`,
      title: 'ASTM传输监测',
      iconSvg: 'ASTM'
    }
  ])('/monitor/')
}
