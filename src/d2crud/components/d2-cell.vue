<template>
  <span>
      <template v-if="item.rowSlot === true">
        <slot :name="item.key+'Slot'" :row="row"/>
      </template>
      <render-custom-component
        v-else-if="item.component && item.component.name"
        v-model="row[item.key]"
        :component-name="item.component.name"
        :scope="{rowIndex: rowIndex, key: item.key, value: row[item.key], row: row}"
        :disabled="getComponentProp(item,item.key,'disabled', false)"
        :readonly="getComponentProp(item,item.key,'readonly', false)"
        :props="item.component.props ? item.component.props : null"
        :events="item.component.events"
        :slots="item.component.slots"
        @change="handleCellDataChange($event, {rowIndex: rowIndex, key: item.key, value: row[item.key], row: row})"
        @ready="handleCellComponentReady($event, {rowIndex: rowIndex, key: item.key, value: row[item.key], row: row})"
        @custom="handleCellComponentCustomEvent($event, {rowIndex: rowIndex, key: item.key, value: row[item.key], row: row})"
        >
      </render-custom-component>
      <render-component
        v-else-if="item.component && item.component.render"
        :scope="{rowIndex: rowIndex, key: item.key, value: row[item.key], row: row}"
        :render-function="item.component.render"
        @change="handleCellDataChange($event, {rowIndex: rowIndex, key: item.key, value: row[item.key], row: row})"
      >
      </render-component>
      <template v-else>{{item.formatter ? item.formatter(row, item, _get(row, item.key), rowIndex) : _get(row, item.key)}}</template>
  </span>
</template>

<script>
import utils from '../mixin/utils'
import renderComponent from '../components/renderComponent.vue'
import renderCustomComponent from '../components/renderCustomComponent.vue'
import _get from 'lodash.get'
export default {
  name: 'd2-cell',
  mixins: [
    utils
  ],
  components: {
    renderComponent, renderCustomComponent
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    row: {
      type: Object,
      required: true
    },
    rowIndex: {
      required: false
    }
  },
  methods: {
    /**
     * @description lodash.get
     */
    _get,
    handleCellDataChange (value, column) {
      column.value = value
      this.$emit('cell-data-change', column)
    },
    handleCellComponentReady ($event, column) {
      column.event = $event
      this.$emit('cell-component-ready', column)
    },
    handleCellComponentCustomEvent ($event, column) {
      column.event = $event
      this.$emit('cell-component-custom-event', column)
    }
  }
}
</script>
