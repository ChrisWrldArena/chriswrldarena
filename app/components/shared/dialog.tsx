/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

type DialogType = 'alert' | 'confirm' | 'progress' | 'component'

interface DialogState {
  isOpen: boolean
  type: DialogType
  title: string
  message: string
  onConfirm?: () => void
  onCancel?: () => void
  progress?: number
  component?: ReactNode
  close?: () => void
}

interface DialogContextType {
  showDialog: (options: Omit<DialogState, 'isOpen'>) => void
  closeDialog: () => void
  state: DialogState
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {

  const [state, setState] = useState<DialogState>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    component: null,
  })

  const showDialog = (options: Omit<DialogState, 'isOpen'>) => {
    setState({ ...options, isOpen: true })
  }

  const closeDialog = () => {
    setState(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <DialogContext.Provider value={{ showDialog, closeDialog, state }}>
      {children}
      {state.isOpen && (
        <div className="fixed w-full h-full inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          {state.type !== 'component' && <div className="bg-neutral-100 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {state.type === 'alert' && <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />}
                {state.type === 'confirm' && <InformationCircleIcon className="w-6 h-6 text-blue-800" />}
                {state.type === 'progress' && <CheckCircleIcon className="w-6 h-6 text-green-600" />}
                <h3 className="text-lg font-semibold text-black">{state.title}</h3>
              </div>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-black">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-black mb-6 text-sm break-words">{state.message}</p>

            {state.type === 'progress' && (
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div
                  className="bg-blue-800 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.progress || 0}%` }}
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              {state.type === 'confirm' && (
                <button
                  onClick={() => {
                    state.onCancel?.()
                    closeDialog()
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  state.onConfirm?.()
                  closeDialog()
                }}
                className="px-4 py-2 rounded-lg bg-green-900 text-white hover:bg-green-600 transition-colors"
              >
                {state.type === 'progress' ? 'Close' : 'OK'}
              </button>
            </div>
          </div>}
          {state.type === 'component' && <div className="bg-white border rounded-lg shadow-xl max-w-md w-full p-6">

            <div className="flex flex-col items-start justify-between mb-2 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{state.title}</h3>
              {state.message && <p className="text-neutral-500 mb-2 text-sm break-words">{state.message}</p>}
              {state.component}
             
              <div className="flex w-full justify-end mt-4 gap-4">
                <button
                  onClick={() => {
                    state.onCancel?.()
                    closeDialog()
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    state.onConfirm?.()
                    closeDialog()
                  }}
                  className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-900 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>}
        </div>
      )}
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}

// Dialog functions
export const dialog = {
  alert: (title: string, message: string) => {
    const { showDialog } = useDialog()
    showDialog({
      type: 'alert',
      title,
      message,
    })
  },

  confirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    const { showDialog } = useDialog()
    showDialog({
      type: 'confirm',
      title,
      message,
      onConfirm,
      onCancel,
    })
  },

  progress: (title: string, message: string, progress: number) => {
    const { showDialog } = useDialog()
    showDialog({
      type: 'progress',
      title,
      message,
      progress,
    })
  },

  component: (component: ReactNode) => {
    const { showDialog } = useDialog()
    showDialog({
      type: 'component',
      component,
      title: '',
      message: ''
    })
  },

  close: () => {
    const { closeDialog } = useDialog()
    closeDialog()
  }
} 