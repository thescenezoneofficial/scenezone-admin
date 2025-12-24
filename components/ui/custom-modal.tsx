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
  // This helps avoid z-index and styling conflicts
  return ReactDOM.createPortal(
    <div
      // Overlay: Covers the entire screen
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose} // Close modal when clicking the overlay
    >
      <div
        // Modal Content Container: Stop propagation prevents closing when clicking inside the modal content
        className="relative z-50 w-full max-w-xl rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Modal Header with Title and Close Button */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          {title && (
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Render the children passed to the component */}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body, // Target element for the portal
  )
}
