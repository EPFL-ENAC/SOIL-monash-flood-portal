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
}

export interface SelectableSingleItem extends SelectableParentItem {
  id: string
  ids: string[]
  legend?: string
  legendImage?: string
  legendScale?: ScaleEntry[]
}
export interface SelectableGroupItem extends SelectableParentItem {
  id: string
  multiple: boolean
  children: SelectableSingleItem[]
}
