import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IModel } from "@/types/model"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface OrderPinnedMenuProps {
  children: React.ReactNode
  pinnedModels: IModel[]
  onOrderChange: (newModels: IModel[]) => void
}

export default function OrderPinnedMenu({ children, pinnedModels, onOrderChange }: OrderPinnedMenuProps) {
  const [items, setItems] = useState(pinnedModels.map((model) => model.name))
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setItems(pinnedModels.map((model) => model.name))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedModels.length])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = items.indexOf(active.id as string)
    const newIndex = items.indexOf(over.id as string)
    const newItems = arrayMove(items, oldIndex, newIndex)

    setItems(newItems)

    const newModels = newItems
      .map((name) => pinnedModels.find((m) => m.name === name))
      .filter((m): m is IModel => Boolean(m))
    onOrderChange(newModels)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        side="right"
        align="start"
        sideOffset={55}
        className="w-fit p-2"
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col space-y-1">
              {items.map((item) => (
                <Sortable key={item} item={item} pinnedModels={pinnedModels} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </PopoverContent>
    </Popover>
  )
}

function Sortable({ item, pinnedModels }: { item: string; pinnedModels: IModel[] }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const model = pinnedModels.find((model) => model.name === item)!
  if (!model) {
    // model isn’t pinned any more, so don’t render a ghost
    return null
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center space-x-4 pr-2 py-1 hover:bg-sky-50 dark:hover:bg-accent/50 rounded"
    >
      <div {...listeners} className="px-2 cursor-grab">
        <GripVertical className="size-4 " />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm">{model.name}</span>
        <div className="relative size-3">
          <Image src={`/images/${model.provider.toLowerCase()}/logo_dark-blue.png`} alt="Provider logo" fill />
        </div>
      </div>
    </li>
  )
}
