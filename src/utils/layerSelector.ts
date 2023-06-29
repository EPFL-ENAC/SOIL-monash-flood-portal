export type SelectableItem = SelectableSingleItem | SelectableGroupItem
export interface SelectableParentItem {
  label: string
  selected?: boolean
}

export interface ScaleEntry {
  color: string
  label: string
  min?: number
  max?: number
  unit?: string
}

export interface SelectableSingleItem extends SelectableParentItem {
  id: string
  legend?: string
  legendImage?: string
  legendScale?: ScaleEntry[]
}
export interface SelectableGroupItem extends SelectableParentItem {
  id: string
  permanent: boolean
  tab: boolean
  children: SelectableSingleItem[]
}
