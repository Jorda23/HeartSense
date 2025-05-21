import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useSidebar,
} from '@/components/ui'
import { SidebarLeftIcon } from '@/public/Icons'
import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleSidebar}
            variant="outline"
            className="md:px-2 md:h-fit"
          >
            <SidebarLeftIcon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="start">Toggle Sidebar</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="md:px-2 md:h-fit"
          >
            <FontAwesomeIcon
              icon={theme === 'light' ? faMoon : faSun}
              size="sm"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="start">
          Toggle {theme === 'light' ? 'dark' : 'light'} mode
        </TooltipContent>
      </Tooltip>
    </>
  )
}
