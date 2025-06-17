import { updateChatModel } from "@/actions/chat"
import { IModel } from "@/types/model"
import Cookies from "js-cookie"
import { Brain, Eye, FileText, Globe, Pin } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface ModelProps {
  model: IModel
  selectedModel: IModel
  onTogglePin: (model: IModel) => void
  setSelectedModel: (model: IModel) => void
  closeModelPicker: () => void
}

const filterIcons: Record<string, React.ReactNode> = {
  reasoning: (
    <div className="text-purple-400 dark:text-purple-300">
      <Brain size={16} />
    </div>
  ),
  search: (
    <div className="text-sky-400 dark:text-sky-300">
      <Globe size={16} />
    </div>
  ),
  fileUpload: (
    <div className="text-blue-400 dark:text-blue-300">
      <FileText size={16} />
    </div>
  ),
  imageUpload: (
    <div className="text-green-400 dark:text-green-300">
      <Eye size={16} />
    </div>
  ),
}

const filterBgColor: Record<string, string> = {
  reasoning: "bg-purple-400/25 dark:bg-purple-300/25",
  search: "bg-sky-400/25 dark:bg-sky-300/25",
  fileUpload: "bg-blue-400/25 dark:bg-blue-300/25",
  imageUpload: "bg-green-400/25 dark:bg-green-300/25",
}

export default function Model({ model, selectedModel, onTogglePin, setSelectedModel, closeModelPicker }: ModelProps) {
  const pathname = usePathname()

  const handleSelectModel = async () => {
    setSelectedModel(model)
    Cookies.set("selectedModel", model.name, { expires: 7, path: "/" })
    closeModelPicker()
    if (pathname.startsWith("/chat/")) {
      await updateChatModel(pathname.split("/")[2], model.name)
    }
  }

  const enabledCapabilities = Object.entries(model.capabilities).filter(([, enabled]) => enabled)

  return (
    <motion.button
      layout
      transition={{ duration: 0.15 }}
      className={`
        relative group flex flex-col justify-start items-center h-28 border rounded-lg cursor-pointer
        hover:bg-sky-100 hover:border-sky-300 dark:hover:bg-zinc-800/30 dark:hover:border-zinc-400
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
          absolute -right-1 -top-1 p-1 bg-sky-200 dark:bg-zinc-900 border border-sky-300 dark:border-zinc-400 
          rounded-md hover:bg-sky-300 hover:border-sky-400 dark:hover:bg-zinc-800 dark:hover:border-zinc-300
          invisible group-hover:visible
        `}
        onClick={(e) => {
          e.stopPropagation()
          onTogglePin(model)
        }}
      >
        <Pin className="size-4" />
      </div>
      <div className="absolute left-1 top-1 size-4">
        <Image src={`/images/${model.provider.toLowerCase()}/logo_dark-blue.png`} alt="Provider logo" fill />
      </div>

      <div className="flex-1 pt-6">
        <p className="text-sm text-[#192f72] dark:text-white font-medium">{model.baseModel}</p>
        {model.variant ? (
          <p className="text-xs text-[#192f72] dark:text-white font-medium">{model.variant}</p>
        ) : (
          <p className="h-4" />
        )}
      </div>
      <div
        className={
          enabledCapabilities.length === 4
            ? "grid grid-cols-2 gap-1 pb-2"
            : "flex justify-center items-center gap-1 pb-2"
        }
      >
        {enabledCapabilities.map(([key]) => (
          <div key={key} className={`size-5 rounded flex justify-center items-center ${filterBgColor[key]}`}>
            {filterIcons[key]}
          </div>
        ))}
      </div>
    </motion.button>
  )
}
