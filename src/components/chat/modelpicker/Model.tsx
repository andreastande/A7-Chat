import { updateChatModel } from "@/actions/chat"
import { addPinnedModel, removePinnedModel } from "@/actions/model"
import { IModel } from "@/types/model"
import Cookies from "js-cookie"
import { Pin } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface ModelProps {
  model: IModel
  isPinned?: boolean
  pinnedModelsLength: number
  selectedModel: IModel
  onTogglePin: (model: IModel) => void
  setSelectedModel: (model: IModel) => void
  closeModelPicker: () => void
}

export default function Model({
  model,
  isPinned,
  pinnedModelsLength,
  selectedModel,
  onTogglePin,
  setSelectedModel,
  closeModelPicker,
}: ModelProps) {
  const pathname = usePathname()

  const handleSelectModel = async () => {
    setSelectedModel(model)
    Cookies.set("selectedModel", model.name, { expires: 7, path: "/" })
    closeModelPicker()
    if (pathname.startsWith("/chat/")) {
      await updateChatModel(pathname.split("/")[2], model.name)
    }
  }

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation()
    onTogglePin(model)
    if (isPinned) {
      await removePinnedModel(model.name)
    } else {
      await addPinnedModel(model.name, pinnedModelsLength + 1)
    }
  }

  return (
    <button
      className={`
        relative group flex flex-col justify-start items-center h-28 border rounded-lg cursor-pointer
        hover:bg-sky-100 hover:border-sky-300
        ${
          model.name === selectedModel.name
            ? "bg-sky-100 dark:bg-zinc-800/30 border-sky-400 dark:border-zinc-300"
            : "bg-sky-50 dark:bg-secondary border-sky-200 dark:border-zinc-500"
        }
      `}
      onClick={handleSelectModel}
    >
      <div
        className={`
          absolute -right-1 -top-1 p-1 bg-sky-200 border border-sky-300 rounded-md
          hover:bg-sky-300 hover:border-sky-400 invisible group-hover:visible
        `}
        onClick={(e) => handleTogglePin(e)}
      >
        <Pin className="size-4" />
      </div>
      <div className="absolute left-1 top-1 size-4">
        <Image src={`/images/${model.provider.toLowerCase()}/logo_dark-blue.png`} alt="Provider logo" fill />
      </div>

      <p className="pt-6 text-sm text-[#192f72] dark:text-white font-medium">{model.baseModel}</p>
      {model.variant ? <p className="text-xs text-[#192f72] dark:text-white font-medium">{model.variant}</p> : <p />}
    </button>
  )
}
