<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { ref } from 'vue'
import {
  AllCommunityModule,
  type CellClassParams,
  type ColDef,
  ModuleRegistry,
  type ValueFormatterParams,
} from 'ag-grid-community'
import { TreeDataModule, LicenseManager, RowGroupingPanelModule } from 'ag-grid-enterprise'
import {
  type TreeItem,
  TreeItemCategory,
  type TreeItemForAgGrid,
  TreeStore,
} from '@/classes/TreeStore.ts'

LicenseManager.setLicenseKey(
  '[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-112714}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{24 December 2025}____[v3]_[0102]_MTc2NjUzNDQwMDAwMA==20b6a109bc4eac2be82dfa158e01cceb',
)
ModuleRegistry.registerModules([RowGroupingPanelModule, AllCommunityModule, TreeDataModule])
const rowData = ref<TreeItemForAgGrid[]>([])

const items: TreeItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]
const itemsInit = new TreeStore(items)
rowData.value = itemsInit.getArr()
console.log('getTree', itemsInit.getArr())
const colDefs = ref<ColDef<TreeItemForAgGrid>[]>([
  {
    field: 'id',
    headerName: '№ п/п',
    cellDataType: 'string',
    headerClass: 'font-bold',
    cellClass: 'font-bold',
    valueFormatter: (item: ValueFormatterParams<TreeItemForAgGrid>) =>
      item.node?.rowIndex ? String(item.node.rowIndex + 1) : '',
  },
  {
    field: 'category',
    headerName: 'Категория',
    showRowGroup: true,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true,
    },
    valueFormatter: (item: ValueFormatterParams<TreeItemForAgGrid>) => item.value.category,
    headerClass: 'font-bold',
    cellClassRules: {
      'font-bold': (item: CellClassParams) => item.value === TreeItemCategory.GROUP,
    },
  },
  {
    field: 'label',
    headerName: 'Наименование',
    headerClass: 'font-bold',
    cellClassRules: {
      'font-bold': (item: CellClassParams) => item.value === TreeItemCategory.GROUP,
    },
  },
])
</script>

<template>
  <main class="main">
    <div class="caption">Режим: просмотр</div>
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      style="height: 500px"
      :treeData="true"
      :groupDefaultExpanded="-1"
      :defaultColDef="{
        flex: 1,
      }"
      groupDisplayType="custom"
      :getDataPath="(data) => data.path"
    />
  </main>
</template>
