import { updatePinnedModels } from "@/actions/model"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { models } from "@/lib/constants"
import { IModel } from "@/types/model"
import { ChevronDownIcon, Filter, List, Pin, Search } from "lucide-react"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import React, { useEffect, useState } from "react"
import Model from "./Model"
import OrderPinnedMenu from "./OrderPinnedMenu"

interface ModelPickerProps {
  children: React.ReactNode
  initialPinnedModels: IModel[]
  selectedModel: IModel
  setSelectedModel: (model: IModel) => void
}

export default function ModelPicker({
  children,
  initialPinnedModels,
  selectedModel,
  setSelectedModel,
}: ModelPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false)
  const [pinnedModels, setPinnedModels] = useState(initialPinnedModels)

  const otherModels = models.filter((m) => !pinnedModels.some((p) => p.name === m.name))

  const filteredPinnedModels = pinnedModels.filter((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase())) // prettier-ignore
  const filteredOtherModels = otherModels.filter((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const [openAccordions, setOpenAccordions] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("modelPicker-openAccordions")
      if (stored) return JSON.parse(stored)
    }
    // default open accordions
    return ["item-1", "item-2"]
  })

  useEffect(() => {
    localStorage.setItem("modelPicker-openAccordions", JSON.stringify(openAccordions))
  }, [openAccordions])

  const handleCloseModelPicker = (open: boolean) => {
    setIsModelPickerOpen(open)
    setTimeout(() => {
      setSearchTerm("") // reset search when closing model picker
    }, 200)
  }

  const togglePinnedModel = async (model: IModel) => {
    const isPinned = pinnedModels.some((m) => m.name === model.name)
    const newPinnedModels = isPinned ? pinnedModels.filter((m) => m.name !== model.name) : [...pinnedModels, model]

    setPinnedModels(newPinnedModels)
    await updatePinnedModels(newPinnedModels)
  }

  const handlePinnedModelsReorder = async (newOrder: IModel[]) => {
    setPinnedModels(newOrder)
    await updatePinnedModels(newOrder)
  }

  return (
    <Popover open={isModelPickerOpen} onOpenChange={(open) => handleCloseModelPicker(open)}>
      <PopoverTrigger
        type="button"
        className="flex items-center cursor-pointer gap-2 rounded-lg p-2 hover:bg-sky-150 dark:hover:bg-zinc-700 -translate-x-1.5"
      >
        {children}
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-130 py-4 px-0">
        <div className="flex items-center pb-1 border-b border-sky-200 dark:border-zinc-500 px-4">
          <div className="flex flex-1 items-center space-x-2 w-full">
            <Search className="size-4" />
            <input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm w-full outline-none"
            />
          </div>
          <Button variant="ghost" className="cursor-pointer size-8 ml-2 hover:bg-sky-100">
            <Filter className="size-4" />
          </Button>
        </div>

        <OverlayScrollbarsComponent
          options={{ scrollbars: { autoHide: "scroll" } }}
          defer
          className="h-full max-h-118 px-4"
        >
          <Accordion
            type="multiple"
            value={openAccordions}
            onValueChange={(newOpen: string[]) => {
              setOpenAccordions(newOpen)
            }}
          >
            {pinnedModels.length > 0 && (
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="h-14 items-center">
                  <div className="flex items-center gap-2">
                    <Pin className="size-4" />
                    Pinned
                  </div>
                  <div className="flex gap-2 items-center -translate-x-2">
                    <OrderPinnedMenu
                      pinnedModels={pinnedModels}
                      onOrderChange={(newModels: IModel[]) => handlePinnedModelsReorder(newModels)}
                    >
                      <span
                        className={`
                          flex items-center justify-center cursor-pointer size-6 rounded-md hover:bg-sky-100 transition-opacity  
                          ${pinnedModels.length >= 2 && openAccordions.includes("item-1") ? "opacity-100" : "opacity-0 pointer-events-none"}
                        `}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <List className="size-4" />
                      </span>
                    </OrderPinnedMenu>
                    <ChevronDownIcon
                      className={`text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200 ${openAccordions.includes("item-1") && "rotate-180"}`}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-5 gap-2 pt-1 pr-1">
                    {filteredPinnedModels.map((model) => (
                      <Model
                        key={model.name}
                        model={model}
                        onTogglePin={(model) => togglePinnedModel(model)}
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                        closeModelPicker={() => handleCloseModelPicker(false)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="item-2">
              <AccordionTrigger className="h-14 items-center">
                {pinnedModels.length === 0 ? "All models" : "Others"}
                <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 -translate-x-2 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-5 gap-2 pt-1 pr-1">
                  {filteredOtherModels.map((model) => (
                    <Model
                      key={model.name}
                      model={model}
                      onTogglePin={(model) => togglePinnedModel(model)}
                      selectedModel={selectedModel}
                      setSelectedModel={setSelectedModel}
                      closeModelPicker={() => handleCloseModelPicker(false)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </OverlayScrollbarsComponent>
      </PopoverContent>
    </Popover>
  )
}
