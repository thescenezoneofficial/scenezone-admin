import { ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // Effect to handle Escape key press for closing the modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    // Cleanup listener on component unmount or when modal closes
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent rendering if not open
  if (!isOpen) {
    return null
  }

  // Use React Portal to render the modal at the end of the body
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-50 w-full max-w-xl rounded-lg border border-border bg-background p-6 shadow-xl text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  )
}