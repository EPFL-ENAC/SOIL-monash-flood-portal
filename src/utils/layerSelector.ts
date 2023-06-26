export type SelectableItem = SelectableSingleItem | SelectableGroupItem
export interface SelectableParentItem {
  label: string
  selected?: boolean
}
export interface SelectableSingleItem extends SelectableParentItem {
  id: string
  ids: string[]
  legend?: string
  legendImage?: string
}
export interface SelectableGroupItem extends SelectableParentItem {
  id: string
  multiple: boolean
  children: SelectableSingleItem[]
}
