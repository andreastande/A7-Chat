import { updateChatModel } from "@/actions/chat"
import { IModel } from "@/types/model"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"

interface ModelProps {
  model: IModel
  selectedModel: IModel
  setSelectedModel: (model: IModel) => void
  closeModelPicker: () => void
}

export default function Model({ model, selectedModel, setSelectedModel, closeModelPicker }: ModelProps) {
  const pathname = usePathname()

  const handleSelectModel = async (model: IModel) => {
    setSelectedModel(model)
    Cookies.set("selectedModel", model.name, { expires: 7, path: "/" })
    closeModelPicker()
    if (pathname.startsWith("/chat/")) {
      await updateChatModel(pathname.split("/")[2], model.name)
    }
  }

  return (
    <button
      className={`flex flex-col justify-start items-center h-28 border rounded-lg cursor-pointer ${model.name === selectedModel.name ? "bg-sky-100 dark:bg-zinc-800/30 border-sky-400 dark:border-zinc-300" : "bg-sky-50 dark:bg-secondary border-sky-200 dark:border-zinc-500"}  `}
      onClick={() => handleSelectModel(model)}
    >
      <p className="pt-6 text-sm text-[#192f72] dark:text-white font-medium">{model.baseModel}</p>
      {model.variant ? <p className="text-xs text-[#192f72] dark:text-white font-medium">{model.variant}</p> : <p />}
    </button>
  )
}
