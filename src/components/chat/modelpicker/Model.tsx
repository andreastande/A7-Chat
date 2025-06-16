import { updateChatModel } from "@/actions/chat"
import { IModel } from "@/types/model"
import Cookies from "js-cookie"
import { Pin } from "lucide-react"
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

      <p className="pt-6 text-sm text-[#192f72] dark:text-white font-medium">{model.baseModel}</p>
      {model.variant ? <p className="text-xs text-[#192f72] dark:text-white font-medium">{model.variant}</p> : <p />}
    </motion.button>
  )
}
